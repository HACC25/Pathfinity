import { 
    streamText,
    UIMessage,
    convertToModelMessages,
    tool,
    InferUITools,
    UIDataTypes,
    stepCountIs
} from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { semanticSearch } from '@/lib/semantic-search';
import { db } from '@/app/db/index';
import { embedding as e } from '@/app/db/schema';
import { sql } from 'drizzle-orm';

const tools = {
    listCourses: tool({
        description: "List courses from the knowledge base. Use when user wants to see all courses, browse courses, or list courses from a specific department/campus.",
        inputSchema: z.object({
            department: z.string().optional().describe("Filter by department name (e.g., 'Pacific Center for Advanced Technology Training')"),
            campus: z.string().optional().describe("Filter by campus name"),
            limit: z.number().optional().default(20).describe("Maximum number of courses to return"),
        }),
        execute: async ({ department, campus, limit = 20 }) => {
            try {
                // Build WHERE conditions
                const conditions = [];
                if (department) {
                    conditions.push(sql`${e.metadata}->>'dept_name' ILIKE ${`%${department}%`}`);
                }
                if (campus) {
                    conditions.push(sql`${e.campus} ILIKE ${`%${campus}%`}`);
                }

                const baseSelect = db.select({
                    course_code: e.courseCode,
                    title: e.title,
                    campus: e.campus,
                    metadata: e.metadata,
                }).from(e);

                // If conditions exist, apply them, otherwise run the base select
                const whereClause = conditions.length > 0 ? sql.join(conditions, sql` AND `) : undefined;

                const courses = whereClause
                    ? await baseSelect.where(whereClause).limit(limit).orderBy(e.courseCode)
                    : await baseSelect.limit(limit).orderBy(e.courseCode);

                if (!courses || courses.length === 0) {
                    return 'No courses found matching those criteria.';
                }

                const formattedResults = courses.map((course, index) => {
                    const metadata = course.metadata as any;
                    const lines = [
                        `[${index + 1}] ${course.course_code} - ${course.title}`,
                    ];
                    
                    if (course.campus) lines.push(`   Campus/Department: ${course.campus}`);
                    if (metadata?.num_units) lines.push(`   Units: ${metadata.num_units}`);
                    
                    if (metadata?.course_desc) {
                        const desc = String(metadata.course_desc);
                        const truncated = desc.length > 200 ? desc.substring(0, 200) + '...' : desc;
                        lines.push(`   Description: ${truncated}`);
                    }
                    
                    return lines.join('\n');
                }).join('\n\n');

                return formattedResults;
            } catch (error) {
                console.error('List courses error:', error);
                return 'Error retrieving course list. Please try again.';
            }
        }
    }),

    searchKnowledgeBase: tool({
        description: "Search the course knowledge base for specific courses or topics. Use when user asks about specific course codes, prerequisites, topics, or detailed course information.",
        inputSchema: z.object({
            query: z.string().describe("The search query to find relevant information"),
        }),
        execute: async ({ query }) => {
            try {
                const results = await semanticSearch(query, 5, 0.3);

                if (!results || results.length === 0) {
                    return 'No relevant course information found. Try rephrasing your question or ask about a specific course code.';
                }

                const formattedResults = results.map((result: any, index: number) => {
                    // Build header with source info
                    const headerParts = [`[${index + 1}]`];
                    if (result.source) headerParts.push(result.source);
                    if (result.course_code) headerParts.push(result.course_code);
                    const header = headerParts.join(' | ');

                    const content = result.content;

                    // Helper function to extract fields from object
                    const pick = (obj: any, candidates: string[]) => {
                        for (const k of candidates) {
                            if (obj[k] !== undefined && obj[k] !== null && String(obj[k]).trim() !== '') {
                                return obj[k];
                            }
                        }
                        return undefined;
                    };

                    // Handle different content types
                    if (typeof content === 'string') {
                        return `${header}\n${content.trim()}`;
                    }

                    if (Array.isArray(content)) {
                        const body = content
                            .map((c) => (typeof c === 'string' ? c : JSON.stringify(c)))
                            .join('\n');
                        return `${header}\n${body}`;
                    }

                    if (content && typeof content === 'object') {
                        // Extract course fields
                        const courseCode = pick(content, ['course_code', 'course', 'courseId', 'course_num', 'course_number', 'code']);
                        const coursePrefix = pick(content, ['course_prefix']);
                        const courseNumber = pick(content, ['course_number']);
                        const title = pick(content, ['course_title', 'title', 'name']);
                        const dept = pick(content, ['dept_name', 'department', 'dept', 'division']);
                        const units = pick(content, ['num_units', 'units', 'credits', 'credit_hours']);
                        const desc = pick(content, ['course_desc', 'description', 'desc', 'summary', 'overview']);
                        const metadata = pick(content, ['metadata', 'additional_info', 'additional', 'notes']);
                        const outcomes = pick(content, ['learner_outcomes', 'outcomes', 'learning_outcomes']);
                        const prereqs = pick(content, ['prerequisites', 'required_prep', 'required_prereq', 'prereq']);
                        const sectionNotes = pick(content, ['section_notes', 'sectionNotes', 'section', 'section_note']);

                        const lines: string[] = [];

                        // Course code line
                        const courseCodeParts: string[] = [];
                        if (courseCode) {
                            courseCodeParts.push(String(courseCode));
                        } else if (coursePrefix && courseNumber) {
                            courseCodeParts.push(`${coursePrefix} ${courseNumber}`);
                        }
                        if (title) courseCodeParts.push(String(title));
                        if (courseCodeParts.length) {
                            lines.push(`Course: ${courseCodeParts.join(' - ')}`);
                        }

                        // Other fields
                        if (dept) lines.push(`Department: ${String(dept)}`);
                        if (units !== undefined) lines.push(`Units: ${String(units)}`);
                        if (desc) lines.push(`Description: ${String(desc)}`);
                        if (metadata) lines.push(`Additional Info: ${String(metadata)}`);
                        
                        // Handle outcomes (array or string)
                        if (Array.isArray(outcomes)) {
                            lines.push(`Learner Outcomes:\n${outcomes.map(o => `  • ${o}`).join('\n')}`);
                        } else if (outcomes) {
                            lines.push(`Learner Outcomes: ${String(outcomes)}`);
                        }
                        
                        if (prereqs) lines.push(`Prerequisites: ${String(prereqs)}`);
                        if (sectionNotes) lines.push(`Section Notes: ${String(sectionNotes)}`);

                        // Fallback if no structured fields found
                        if (lines.length === 0) {
                            const fallback = pick(content, ['text', 'content', 'snippet']) || JSON.stringify(content, null, 2);
                            return `${header}\n${String(fallback)}`;
                        }

                        return `${header}\n${lines.join('\n')}`;
                    }

                    // Last resort: stringify
                    return `${header}\n${JSON.stringify(content)}`;
                }).join('\n\n');

                return formattedResults;
            } catch (error) {
                console.error('Search error:', error);
                return 'Error searching the course knowledge base. Please try again or refine your query.';
            }
        }
    })
};

export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

export async function POST(req: Request) {
    try{
        const { messages }: { messages: ChatMessage[] } = await req.json();

        const result = streamText({
            model: openai('gpt-4.1-mini'),
            messages: convertToModelMessages(messages),
            tools,
            system: `You are a helpful university course assistant with access to the course knowledge base.

HOW TO RESPOND:

For greetings and casual conversation:
- Respond naturally and briefly, then offer to help with courses
- Example: "Hello! I'm doing well, thank you. I'm here to help you find course information. What courses are you interested in?"

For listing/browsing courses:
- Use listCourses tool for requests like "list all courses", "show me courses", "what courses are available"
- Can filter by department or campus if user specifies
- Present results in a clear, organized way
- If many results, suggest being more specific

For specific course searches:
- Use searchKnowledgeBase for specific course codes, topics, or detailed questions
- Examples: "Com 2158", "AWS courses", "courses about networking", "prerequisites for X"
- Always cite results with [1], [2], etc.

For course-related questions:
- Choose the appropriate tool (listCourses for browsing, searchKnowledgeBase for specific queries)
- If results found: Answer concisely with citations [1], [2], etc.
- If no results: Explain you couldn't find that specific information and suggest alternatives

For non-course questions (sports, weather, celebrities, general facts):
- Politely decline and redirect to course information
- Example: "I can only help with course information from our catalog. I don't have access to information about sports teams or other topics. Is there a course or program I can help you find?"

RULES:
- Always use tools for course-related questions
- Be conversational and helpful, not robotic
- Cite sources with [1], [2] when providing course information from searchKnowledgeBase
- Keep responses concise (2-5 sentences typically)
- Guide users toward more specific queries if their question is too broad`,
            stopWhen: stepCountIs(2),
        });

        return result.toUIMessageStreamResponse();
    } catch (error) {
        console.error('Error streaming chat completion:', error);
        return new Response('Failed to stream chat completion', { status: 500 });
    }
}
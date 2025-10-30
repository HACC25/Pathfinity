import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth-server';
import Link from 'next/link';

export default async function Home() {
  const session = await getSession();

  // If the user is authenticated, send them to the dashboard (which lives
  // under the `(with-sidebar)` route group so it includes the sidebar).
  if (session) {
    redirect('/Home');
  }

  // Otherwise render the public landing page
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-[#f8fafc]">
      <header className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-indigo-600 flex items-center justify-center text-white font-bold">
            P
          </div>
          <span className="text-xl font-semibold">Pathfinity</span>
        </Link>

        <nav className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-gray-900">
            Log in
          </Link>
          <Link href="/login" className="ml-2 inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700">
            Sign up
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex items-center justify-center px-6">
        <section className="max-w-4xl text-center py-20">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-6">Bring student journeys to life with Pathfinity</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Pathfinity helps institutions map programs, people, and career pathways so students
            can discover meaningful majors, internships, and careers. Connect learners with
            resources, mentors, and real-world outcomes — all in one place.
          </p>

          <div className="flex justify-center gap-4">
            <Link href="/signup" className="inline-flex items-center px-6 py-3 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700">
              Get started
            </Link>
            <Link href="/dashboard" className="inline-flex items-center px-6 py-3 rounded-md border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Learn more
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}


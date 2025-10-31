# Interactive Academic Roadmap - React Flow Implementation

## Overview
The Roadmap page now features a fully interactive, drag-and-drop academic planning tool built with React Flow, themed with UH Manoa's signature green colors.

## Features

### 🎯 Interactive Node-Based Planning
- **Drag & Drop**: Move nodes around to reorganize your academic pathway
- **Visual Connections**: Draw connections between courses and milestones
- **Dynamic Editing**: Click on any node to edit its title and description
- **Add New Steps**: Click "Add Step" to create new milestones

### 🌺 UH Manoa Green Theme
- **Primary Green (#024731)**: UH Manoa Dark Green for headers and borders
- **Secondary Green (#0F7B0F)**: UH Manoa Green for buttons and nodes
- **Light Green (#3E8B3E)**: For intermediate nodes and accents
- **Forest Green (#228B22)**: For advanced milestones
- **Light Background (#F0F8F0)**: Subtle green background for comfort

### 📚 Pre-configured Academic Path
The roadmap comes with a sample academic journey:
1. **🎯 Start Your Journey** - Define career goals
2. **📚 Foundation Courses** - Core prerequisites
3. **🔬 Specialized Track** - Choose specialization
4. **💼 Internship** - Gain practical experience
5. **🚀 Advanced Projects** - Build portfolio
6. **🎓 Career Ready** - Achieve goals

## How to Use

### Creating Your Roadmap
1. **Start with the Template**: Use the pre-configured nodes as a starting point
2. **Edit Existing Nodes**: Click on any node to modify its title and description
3. **Add New Milestones**: Use the "➕ Add Step" button to create new nodes
4. **Connect Steps**: Drag from one node to another to create connections
5. **Reorganize**: Drag nodes to better positions

### Navigation Controls
- **Zoom**: Use mouse wheel or the zoom controls
- **Pan**: Click and drag on empty space to move around
- **Fit View**: Use controls to fit entire roadmap in view
- **Minimap**: Use the minimap for quick navigation

### Editing Nodes
1. Click on any node to open the editing sidebar
2. Modify the title and description
3. Click "✅ Done Editing" to close the sidebar

## Technical Implementation

### Components Used
- **React Flow**: Core diagramming library
- **CSS Modules**: For styling with UH Manoa theme
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework

### Key Features
- **Responsive Design**: Works on desktop and tablet devices
- **Accessibility**: Proper labels and keyboard navigation
- **Performance**: Optimized rendering with React Flow
- **State Management**: Local state with React hooks

### File Structure
```
app/(with-sidebar)/Roadmap/
├── page.tsx              # Main roadmap component
├── roadmap.module.css     # UH Manoa themed styles
└── README.md             # This documentation
```

## Customization

### Adding New Node Types
You can extend the roadmap with different node types by:
1. Adding new CSS classes in `roadmap.module.css`
2. Creating new initial nodes with different `className` properties
3. Implementing custom node components if needed

### Color Theme Customization
The UH Manoa green theme is defined in the `MANOA_COLORS` object:
```typescript
const MANOA_COLORS = {
  primary: '#024731',    // UH Manoa Dark Green
  secondary: '#0F7B0F',  // UH Manoa Green
  light: '#3E8B3E',      // Light Green
  accent: '#228B22',     // Forest Green
  bg: '#F0F8F0',         // Very Light Green
  text: '#1B4332',       // Dark Green Text
  white: '#FFFFFF',
  border: '#6B8E23',     // Olive Green
};
```

### Future Enhancements
- **Save/Load Functionality**: Persist roadmaps to database
- **Templates**: Pre-made roadmaps for different majors
- **Collaboration**: Share roadmaps with advisors
- **Progress Tracking**: Mark completed milestones
- **Course Integration**: Link to actual course catalog
- **Timeline View**: Show roadmap on a timeline
- **Export Options**: PDF or image export

## Browser Compatibility
- ✅ Chrome/Chromium (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge

## Mobile Support
The roadmap is optimized for desktop use but provides basic functionality on tablets. Mobile support is limited due to the complex nature of the interface.

## Performance Notes
- The roadmap can handle up to 100+ nodes efficiently
- Large roadmaps may benefit from virtualization (future enhancement)
- Real-time collaboration features would require WebSocket implementation

## Getting Started
1. Navigate to `/Roadmap` in your application
2. Explore the sample academic pathway
3. Click nodes to edit them
4. Add new steps using the "Add Step" button
5. Create connections by dragging between nodes
6. Use the minimap and controls for navigation

The Interactive Academic Roadmap provides students with a visual, intuitive way to plan their academic journey at UH Manoa, making complex degree requirements easier to understand and manage.
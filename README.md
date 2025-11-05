# Task Auto-Organizer

AI-powered task management system with automatic classification, time tracking, and intelligent insights.

## Features

### Phase 1 (MVP) ✅

- **Quick Input + AI Auto-Classification**
  - Enter a single line of text
  - Claude AI automatically extracts tags, priority, project, and estimated time
  - Editable after creation

- **Time Tracking**
  - Start/Stop timer for each task
  - Track actual vs estimated time
  - Daily/weekly/monthly aggregation

- **Timeline & Calendar Views**
  - Timeline view: See what you did when
  - Calendar view: Date-based task visualization
  - Drag to adjust time (coming soon)

- **Daily Auto-Review**
  - Automatically generated at 6 PM (configurable)
  - Summary of the day's work
  - Time analysis by project and tags
  - AI-generated insights and suggestions for tomorrow

### Phase 2 (Coming Soon)

- Weekly/monthly reviews
- Pattern insights and analytics
- Context connections between tasks
- Git integration for automatic task creation from commits

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: TailwindCSS with custom Helvetica typography
- **State**: Zustand
- **Backend**: Supabase (PostgreSQL)
- **AI**: Claude API (Anthropic)
- **Time Handling**: date-fns

## Design

- Dark mode by default (light mode supported)
- Helvetica typography
- Minimal color palette
- Smooth transitions (200ms)
- Clear visual hierarchy
- 1/2 line spacing between paragraphs

## Setup

### 1. Clone and Install

\`\`\`bash
git clone <your-repo>
cd ob2
npm install
\`\`\`

### 2. Setup Supabase

1. Create a new Supabase project at https://supabase.com
2. Run the SQL schema in `supabase-schema.sql` in the Supabase SQL editor
3. Get your project URL and anon key from Settings > API

### 3. Setup Claude API

1. Get an API key from https://console.anthropic.com
2. Note: In production, use a backend proxy instead of exposing the key

### 4. Environment Variables

Create a `.env` file:

\`\`\`env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key
\`\`\`

### 5. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit http://localhost:5173

## Usage

### Adding Tasks

1. Type a task description in the quick input
2. AI automatically classifies it
3. Click "Add Task" or press Enter
4. Edit tags/priority if needed

### Time Tracking

1. Click "Start" on any task
2. Timer begins automatically
3. Click "Pause" to stop
4. Click "Done" to mark complete
5. Actual time is recorded

### Views

- **Dashboard**: Overview, stats, and quick actions
- **Calendar**: Monthly/weekly/daily calendar view
- **Timeline**: Chronological history of tasks
- **List**: Filterable and sortable task list

### Daily Review

- Automatically generated at 6 PM
- View in Dashboard under "Today's Review"
- Click "Generate" to create manually
- Shows completion rate, time spent, insights, and suggestions

## Deployment

### Deploy to Vercel/Netlify

\`\`\`bash
npm run build
\`\`\`

Upload the `dist` folder or connect your git repository.

### Environment Variables in Production

Set the same environment variables in your deployment platform's settings.

## Development

\`\`\`bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Lint code
\`\`\`

## Database Schema

See `supabase-schema.sql` for the complete database schema including:
- `tasks` - Main task table with AI analysis
- `time_entries` - Detailed time tracking
- `daily_reviews` - AI-generated daily summaries
- `weekly_reviews` - Weekly insights (Phase 2)

## Contributing

This is a personal project, but feel free to fork and customize for your needs!

## License

MIT

---

Built with ❤️ using Claude Code

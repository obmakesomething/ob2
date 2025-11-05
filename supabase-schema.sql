-- Task Auto-Organizer Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,

    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'archived')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),

    tags TEXT[] DEFAULT '{}',
    context TEXT,
    project TEXT,

    -- AI analysis
    ai_analyzed BOOLEAN DEFAULT FALSE,
    estimated_duration INTEGER, -- in minutes
    actual_duration INTEGER, -- in minutes

    -- Git integration
    source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'git')),
    git_commit_sha TEXT,
    git_commit_message TEXT,

    -- Time tracking
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    is_timer_running BOOLEAN DEFAULT FALSE
);

-- Time entries table (for detailed time tracking)
CREATE TABLE time_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ NOT NULL,
    ended_at TIMESTAMPTZ,
    duration INTEGER, -- in minutes
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily reviews table
CREATE TABLE daily_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL UNIQUE,
    summary TEXT NOT NULL,
    insights TEXT[],
    total_tasks INTEGER DEFAULT 0,
    completed_tasks INTEGER DEFAULT 0,
    total_time_spent INTEGER DEFAULT 0, -- in minutes
    time_by_project JSONB DEFAULT '{}',
    time_by_tag JSONB DEFAULT '{}',
    suggestions TEXT[],
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Weekly reviews table (Phase 2)
CREATE TABLE weekly_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    week_start DATE NOT NULL,
    week_end DATE NOT NULL,
    summary TEXT NOT NULL,
    insights TEXT[],
    total_tasks INTEGER DEFAULT 0,
    completed_tasks INTEGER DEFAULT 0,
    total_time_spent INTEGER DEFAULT 0,
    patterns JSONB DEFAULT '{}',
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(week_start, week_end)
);

-- Indexes for performance
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
CREATE INDEX idx_tasks_project ON tasks(project);
CREATE INDEX idx_tasks_tags ON tasks USING GIN(tags);
CREATE INDEX idx_time_entries_task_id ON time_entries(task_id);
CREATE INDEX idx_time_entries_started_at ON time_entries(started_at DESC);
CREATE INDEX idx_daily_reviews_date ON daily_reviews(date DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate actual duration when task is completed
CREATE OR REPLACE FUNCTION calculate_task_duration()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND NEW.started_at IS NOT NULL THEN
        NEW.actual_duration = EXTRACT(EPOCH FROM (COALESCE(NEW.ended_at, NOW()) - NEW.started_at)) / 60;
        NEW.ended_at = COALESCE(NEW.ended_at, NOW());
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-calculate duration
CREATE TRIGGER calculate_duration_on_complete
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    WHEN (NEW.status = 'completed' AND OLD.status != 'completed')
    EXECUTE FUNCTION calculate_task_duration();

-- Row Level Security (RLS) - Enable after adding auth
-- ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE daily_reviews ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (uncomment when adding auth)
-- CREATE POLICY "Users can view their own tasks" ON tasks
--     FOR SELECT USING (auth.uid() = user_id);

-- CREATE POLICY "Users can insert their own tasks" ON tasks
--     FOR INSERT WITH CHECK (auth.uid() = user_id);

-- CREATE POLICY "Users can update their own tasks" ON tasks
--     FOR UPDATE USING (auth.uid() = user_id);

-- CREATE POLICY "Users can delete their own tasks" ON tasks
--     FOR DELETE USING (auth.uid() = user_id);

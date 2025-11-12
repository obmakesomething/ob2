import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Initialize database schema
export async function initializeDatabase() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        priority TEXT NOT NULL DEFAULT 'medium',
        tags TEXT[] DEFAULT '{}',
        project TEXT,
        context TEXT,
        due_date TIMESTAMPTZ,
        estimated_duration INTEGER,
        actual_duration INTEGER,
        started_at TIMESTAMPTZ,
        ended_at TIMESTAMPTZ,
        completed_at TIMESTAMPTZ,
        is_timer_running BOOLEAN DEFAULT FALSE,
        ai_analyzed BOOLEAN DEFAULT FALSE,
        source TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS daily_reviews (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        date TEXT UNIQUE NOT NULL,
        summary TEXT,
        insights TEXT[],
        total_tasks INTEGER DEFAULT 0,
        completed_tasks INTEGER DEFAULT 0,
        total_time_spent INTEGER DEFAULT 0,
        time_by_project JSONB,
        time_by_tag JSONB,
        suggestions TEXT[],
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS weekly_reviews (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        summary TEXT,
        insights TEXT[],
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
      CREATE INDEX IF NOT EXISTS idx_daily_reviews_date ON daily_reviews(date);
    `);
    console.log('Database schema initialized');
  } finally {
    client.release();
  }
}

export { pool };

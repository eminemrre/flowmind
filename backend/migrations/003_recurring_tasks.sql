-- Add recurring task support columns
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS recurrence VARCHAR(20) DEFAULT NULL;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS recurrence_end_date DATE DEFAULT NULL;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS parent_task_id INTEGER REFERENCES tasks(id) DEFAULT NULL;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_tasks_recurrence ON tasks(recurrence) WHERE recurrence IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tasks_parent ON tasks(parent_task_id) WHERE parent_task_id IS NOT NULL;

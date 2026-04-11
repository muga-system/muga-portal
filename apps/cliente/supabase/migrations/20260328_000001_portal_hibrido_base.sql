-- Portal hibrido: base schema for internal project operations

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'agency', 'enterprise')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  company_name TEXT,
  email TEXT,
  phone TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'archived')),
  current_stage TEXT NOT NULL DEFAULT 'brief' CHECK (current_stage IN ('brief', 'diseno', 'desarrollo', 'qa', 'publicado')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  stage_key TEXT NOT NULL CHECK (stage_key IN ('brief', 'diseno', 'desarrollo', 'qa', 'publicado')),
  position INTEGER NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (project_id, stage_key),
  UNIQUE (project_id, position)
);

CREATE TABLE IF NOT EXISTS deliverables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  stage_key TEXT NOT NULL CHECK (stage_key IN ('brief', 'diseno', 'desarrollo', 'qa', 'publicado')),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'revision', 'aprobado', 'cambios')),
  due_date TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  deliverable_id UUID REFERENCES deliverables(id) ON DELETE CASCADE,
  author_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  author_role TEXT NOT NULL DEFAULT 'muga' CHECK (author_role IN ('muga', 'cliente')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  deliverable_id UUID REFERENCES deliverables(id) ON DELETE SET NULL,
  stage_key TEXT NOT NULL CHECK (stage_key IN ('brief', 'diseno', 'desarrollo', 'qa', 'publicado')),
  file_kind TEXT NOT NULL DEFAULT 'asset' CHECK (file_kind IN ('brief', 'asset', 'entregable')),
  file_name TEXT NOT NULL,
  file_path TEXT,
  uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  actor_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('stage_change', 'deliverable_status_change', 'comment', 'file_upload')),
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own clients" ON clients
  FOR SELECT USING (auth.uid() = owner_user_id);

CREATE POLICY "Users can create own clients" ON clients
  FOR INSERT WITH CHECK (auth.uid() = owner_user_id);

CREATE POLICY "Users can update own clients" ON clients
  FOR UPDATE USING (auth.uid() = owner_user_id);

CREATE POLICY "Users can delete own clients" ON clients
  FOR DELETE USING (auth.uid() = owner_user_id);

CREATE POLICY "Users can view own projects" ON projects
  FOR SELECT USING (auth.uid() = owner_user_id);

CREATE POLICY "Users can create own projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = owner_user_id);

CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE USING (auth.uid() = owner_user_id);

CREATE POLICY "Users can delete own projects" ON projects
  FOR DELETE USING (auth.uid() = owner_user_id);

CREATE POLICY "Users can view stages from own projects" ON project_stages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_stages.project_id
      AND projects.owner_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert stages from own projects" ON project_stages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_stages.project_id
      AND projects.owner_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update stages from own projects" ON project_stages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_stages.project_id
      AND projects.owner_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view deliverables from own projects" ON deliverables
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = deliverables.project_id
      AND projects.owner_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert deliverables from own projects" ON deliverables
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = deliverables.project_id
      AND projects.owner_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update deliverables from own projects" ON deliverables
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = deliverables.project_id
      AND projects.owner_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view comments from own projects" ON project_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_comments.project_id
      AND projects.owner_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert comments from own projects" ON project_comments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_comments.project_id
      AND projects.owner_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view files from own projects" ON project_files
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_files.project_id
      AND projects.owner_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert files from own projects" ON project_files
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_files.project_id
      AND projects.owner_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view activity from own projects" ON project_activity
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_activity.project_id
      AND projects.owner_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert activity from own projects" ON project_activity
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_activity.project_id
      AND projects.owner_user_id = auth.uid()
    )
  );

CREATE INDEX idx_clients_owner_user_id ON clients(owner_user_id);
CREATE INDEX idx_projects_owner_user_id ON projects(owner_user_id);
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_project_stages_project_id ON project_stages(project_id);
CREATE INDEX idx_deliverables_project_id ON deliverables(project_id);
CREATE INDEX idx_project_comments_project_id ON project_comments(project_id);
CREATE INDEX idx_project_files_project_id ON project_files(project_id);
CREATE INDEX idx_project_activity_project_id ON project_activity(project_id);

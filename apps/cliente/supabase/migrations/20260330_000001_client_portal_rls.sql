-- Client portal RLS policies for accepted clients

CREATE POLICY "Accepted clients can view own client profile" ON clients
  FOR SELECT USING (
    auth.uid() = auth_user_id
    AND portal_status = 'accepted'
  );

CREATE POLICY "Accepted clients can view own projects" ON projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM clients
      WHERE clients.id = projects.client_id
      AND clients.auth_user_id = auth.uid()
      AND clients.portal_status = 'accepted'
    )
  );

CREATE POLICY "Accepted clients can view stages from own projects" ON project_stages
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM projects
      JOIN clients ON clients.id = projects.client_id
      WHERE projects.id = project_stages.project_id
      AND clients.auth_user_id = auth.uid()
      AND clients.portal_status = 'accepted'
    )
  );

CREATE POLICY "Accepted clients can view deliverables from own projects" ON deliverables
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM projects
      JOIN clients ON clients.id = projects.client_id
      WHERE projects.id = deliverables.project_id
      AND clients.auth_user_id = auth.uid()
      AND clients.portal_status = 'accepted'
    )
  );

CREATE POLICY "Accepted clients can view comments from own projects" ON project_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM projects
      JOIN clients ON clients.id = projects.client_id
      WHERE projects.id = project_comments.project_id
      AND clients.auth_user_id = auth.uid()
      AND clients.portal_status = 'accepted'
    )
  );

CREATE POLICY "Accepted clients can add comments to own projects" ON project_comments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1
      FROM projects
      JOIN clients ON clients.id = projects.client_id
      WHERE projects.id = project_comments.project_id
      AND clients.auth_user_id = auth.uid()
      AND clients.portal_status = 'accepted'
    )
    AND author_role = 'cliente'
  );

CREATE POLICY "Accepted clients can view files from own projects" ON project_files
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM projects
      JOIN clients ON clients.id = projects.client_id
      WHERE projects.id = project_files.project_id
      AND clients.auth_user_id = auth.uid()
      AND clients.portal_status = 'accepted'
    )
  );

CREATE POLICY "Accepted clients can add files to own projects" ON project_files
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1
      FROM projects
      JOIN clients ON clients.id = projects.client_id
      WHERE projects.id = project_files.project_id
      AND clients.auth_user_id = auth.uid()
      AND clients.portal_status = 'accepted'
    )
  );

CREATE POLICY "Accepted clients can view activity from own projects" ON project_activity
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM projects
      JOIN clients ON clients.id = projects.client_id
      WHERE projects.id = project_activity.project_id
      AND clients.auth_user_id = auth.uid()
      AND clients.portal_status = 'accepted'
    )
  );

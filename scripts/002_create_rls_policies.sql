-- Users table policies
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Faculty and admin can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role IN ('faculty', 'admin')
    )
  );

-- Leaderboard policies
CREATE POLICY "Everyone can view leaderboard" ON public.leaderboard
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own leaderboard" ON public.leaderboard
  FOR ALL USING (auth.uid() = user_id);

-- Assignments policies
CREATE POLICY "Everyone can view assignments" ON public.assignments
  FOR SELECT USING (true);

CREATE POLICY "Faculty can create assignments" ON public.assignments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role IN ('faculty', 'admin')
    )
  );

CREATE POLICY "Faculty can update their assignments" ON public.assignments
  FOR UPDATE USING (auth.uid() = created_by);

-- Assignment submissions policies
CREATE POLICY "Students can view their own submissions" ON public.assignment_submissions
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Faculty can view all submissions" ON public.assignment_submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role IN ('faculty', 'admin')
    )
  );

CREATE POLICY "Students can create submissions" ON public.assignment_submissions
  FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their submissions" ON public.assignment_submissions
  FOR UPDATE USING (auth.uid() = student_id AND status = 'pending');

CREATE POLICY "Faculty can grade submissions" ON public.assignment_submissions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role IN ('faculty', 'admin')
    )
  );

-- Notes policies
CREATE POLICY "Users can view their own notes" ON public.notes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view public notes" ON public.notes
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can manage their own notes" ON public.notes
  FOR ALL USING (auth.uid() = user_id);

-- Canteen items policies
CREATE POLICY "Everyone can view canteen items" ON public.canteen_items
  FOR SELECT USING (true);

CREATE POLICY "Admin can manage canteen items" ON public.canteen_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Canteen orders policies
CREATE POLICY "Users can view their own orders" ON public.canteen_orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" ON public.canteen_orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can view all orders" ON public.canteen_orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admin can update order status" ON public.canteen_orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Leave requests policies
CREATE POLICY "Users can view their own leave requests" ON public.leave_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own leave requests" ON public.leave_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Faculty and admin can view all leave requests" ON public.leave_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role IN ('faculty', 'admin')
    )
  );

CREATE POLICY "Faculty and admin can approve leave requests" ON public.leave_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role IN ('faculty', 'admin')
    )
  );

-- Announcements policies
CREATE POLICY "Everyone can view announcements" ON public.announcements
  FOR SELECT USING (
    target_audience && ARRAY[
      (SELECT role FROM public.users WHERE id = auth.uid())
    ]
  );

CREATE POLICY "Faculty and admin can create announcements" ON public.announcements
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role IN ('faculty', 'admin')
    )
  );

CREATE POLICY "Creators can update their announcements" ON public.announcements
  FOR UPDATE USING (auth.uid() = created_by);

-- Attendance policies
CREATE POLICY "Users can view their own attendance" ON public.attendance
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own attendance" ON public.attendance
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Faculty and admin can view all attendance" ON public.attendance
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role IN ('faculty', 'admin')
    )
  );

CREATE POLICY "Faculty and admin can manage attendance" ON public.attendance
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role IN ('faculty', 'admin')
    )
  );

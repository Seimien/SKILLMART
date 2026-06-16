create policy "Users insert their own profile"
on public.profiles for insert
with check (auth.uid() = id);

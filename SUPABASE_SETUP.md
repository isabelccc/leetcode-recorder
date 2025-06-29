# Supabase Setup Guide

This guide will help you set up Supabase as the database for your LeetCode Recorder app.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization and enter project details
4. Wait for the project to be created

## 2. Get Your Project Credentials

1. Go to your project dashboard
2. Navigate to Settings > API
3. Copy your Project URL and anon/public key

## 3. Set Up Environment Variables

Create a `.env` file in your project root with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

## 4. Create Database Tables

Run the following SQL in your Supabase SQL Editor:

### Users Table
```sql
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### Problems Table
```sql
CREATE TABLE problems (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard')) NOT NULL,
  category TEXT NOT NULL,
  status TEXT DEFAULT 'Not Started' CHECK (status IN ('Not Started', 'In Progress', 'Completed', 'Failed')),
  notes TEXT,
  solution TEXT,
  language TEXT,
  time_complexity TEXT,
  space_complexity TEXT,
  tags TEXT[] DEFAULT '{}',
  url TEXT,
  attempts INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Enable RLS
ALTER TABLE problems ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own problems" ON problems
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own problems" ON problems
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own problems" ON problems
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own problems" ON problems
  FOR DELETE USING (auth.uid() = user_id);
```

### AI Analyses Table
```sql
CREATE TABLE ai_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  problem_id UUID REFERENCES problems(id) ON DELETE CASCADE NOT NULL,
  analysis TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Enable RLS
ALTER TABLE ai_analyses ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own analyses" ON ai_analyses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyses" ON ai_analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own analyses" ON ai_analyses
  FOR DELETE USING (auth.uid() = user_id);
```

## 5. Set Up Authentication

1. Go to Authentication > Settings in your Supabase dashboard
2. Configure your site URL (e.g., `http://localhost:5173` for development)
3. Add any additional redirect URLs as needed

## 6. Create Admin User

To create an admin user:

1. Sign up normally through the app
2. Go to your Supabase dashboard > Table Editor > users
3. Find your user record and change the role to 'admin'

## 7. Test the Setup

1. Start your development server: `npm run dev`
2. Try signing up and signing in
3. Test creating, updating, and deleting problems
4. Verify that data is being stored in Supabase

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your site URL is configured correctly in Supabase Auth settings
2. **RLS Policy Errors**: Ensure all tables have proper RLS policies
3. **Environment Variables**: Double-check that your `.env` file is in the project root and variables are prefixed with `VITE_`

### Useful Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Features

With Supabase integration, your app now has:

- ✅ Real-time authentication
- ✅ Secure data storage
- ✅ Row-level security
- ✅ User profiles
- ✅ Problem management
- ✅ AI analysis storage
- ✅ Multi-user support
- ✅ Data persistence across sessions 
-- PawsitiveAI Coach Database Setup
-- This script creates all required tables and sets up RLS policies

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    training_experience VARCHAR(50) DEFAULT 'beginner',
    time_commitment_minutes INTEGER DEFAULT 15,
    preferred_reinforcements TEXT[],
    learning_style VARCHAR(50),
    training_goals TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dogs Table
CREATE TABLE IF NOT EXISTS dogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    breed VARCHAR(100),
    breed_mix VARCHAR(200),
    age_years INTEGER,
    age_months INTEGER,
    weight_kg DECIMAL(5,2),
    sex VARCHAR(20),
    is_neutered BOOLEAN DEFAULT false,
    health_conditions TEXT[],
    temperament_traits TEXT[],
    current_skills TEXT[],
    behavioral_concerns TEXT[],
    energy_level VARCHAR(50),
    socialization_level VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Training Plans Table
CREATE TABLE IF NOT EXISTS training_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dog_id UUID NOT NULL,
    user_id UUID NOT NULL,
    plan_name VARCHAR(200) NOT NULL,
    goal_description TEXT,
    difficulty_level VARCHAR(50),
    estimated_duration_weeks INTEGER,
    exercise_sequence JSONB NOT NULL,
    current_exercise_index INTEGER DEFAULT 0,
    ai_recommendations JSONB,
    personalization_factors JSONB,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Training Sessions Table
CREATE TABLE IF NOT EXISTS training_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dog_id UUID NOT NULL,
    user_id UUID NOT NULL,
    training_plan_id UUID,
    exercise_id UUID,
    session_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    duration_minutes INTEGER,
    success_rate INTEGER,
    dog_engagement_level INTEGER,
    difficulty_rating INTEGER,
    notes TEXT,
    reinforcements_used TEXT[],
    environmental_factors JSONB,
    challenges_faced TEXT[],
    wins_achieved TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Training Exercises Table
CREATE TABLE IF NOT EXISTS training_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    difficulty_level VARCHAR(50) NOT NULL,
    duration_minutes INTEGER,
    required_skills TEXT[],
    breed_suitability TEXT[],
    training_method TEXT NOT NULL,
    step_by_step_guide JSONB NOT NULL,
    tips TEXT[],
    common_mistakes TEXT[],
    success_criteria TEXT[],
    video_url TEXT,
    image_url TEXT,
    scientific_basis TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Knowledge Base Table
CREATE TABLE IF NOT EXISTS knowledge_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    content TEXT NOT NULL,
    summary TEXT,
    difficulty_level VARCHAR(50),
    target_audience VARCHAR(100),
    key_concepts TEXT[],
    scientific_references TEXT[],
    author VARCHAR(200),
    image_url TEXT,
    video_url TEXT,
    related_exercises TEXT[],
    tags TEXT[],
    view_count INTEGER DEFAULT 0,
    helpful_count INTEGER DEFAULT 0,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Breed Info Table
CREATE TABLE IF NOT EXISTS breed_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    breed_name VARCHAR(200) NOT NULL UNIQUE,
    breed_group VARCHAR(100),
    size_category VARCHAR(50),
    energy_level VARCHAR(50),
    intelligence_rank INTEGER,
    trainability_score INTEGER,
    common_traits TEXT[],
    training_considerations TEXT[],
    typical_challenges TEXT[],
    recommended_exercises TEXT[],
    exercise_requirements TEXT,
    mental_stimulation_needs TEXT,
    socialization_importance TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Milestones Table
CREATE TABLE IF NOT EXISTS milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dog_id UUID NOT NULL,
    user_id UUID NOT NULL,
    training_plan_id UUID,
    milestone_name VARCHAR(200) NOT NULL,
    description TEXT,
    target_date DATE,
    completed_date DATE,
    status VARCHAR(50) DEFAULT 'pending',
    achievements TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Progress Metrics Table
CREATE TABLE IF NOT EXISTS progress_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dog_id UUID NOT NULL,
    user_id UUID NOT NULL,
    metric_type VARCHAR(100) NOT NULL,
    metric_value DECIMAL(10,2) NOT NULL,
    measurement_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE dogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE breed_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for dogs
CREATE POLICY "Users can view own dogs" ON dogs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own dogs" ON dogs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own dogs" ON dogs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own dogs" ON dogs
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for training_plans
CREATE POLICY "Users can view own training plans" ON training_plans
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own training plans" ON training_plans
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own training plans" ON training_plans
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own training plans" ON training_plans
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for training_sessions
CREATE POLICY "Users can view own training sessions" ON training_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own training sessions" ON training_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own training sessions" ON training_sessions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own training sessions" ON training_sessions
    FOR DELETE USING (auth.uid() = user_id);

-- Public read access for training exercises and knowledge base
CREATE POLICY "Anyone can view training exercises" ON training_exercises
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Anyone can view knowledge base" ON knowledge_base
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Anyone can view breed info" ON breed_info
    FOR SELECT TO authenticated USING (true);

-- RLS Policies for milestones
CREATE POLICY "Users can view own milestones" ON milestones
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own milestones" ON milestones
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own milestones" ON milestones
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own milestones" ON milestones
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for progress_metrics
CREATE POLICY "Users can view own progress metrics" ON progress_metrics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress metrics" ON progress_metrics
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress metrics" ON progress_metrics
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress metrics" ON progress_metrics
    FOR DELETE USING (auth.uid() = user_id);

-- Insert sample data for training exercises
INSERT INTO training_exercises (title, description, category, difficulty_level, training_method, step_by_step_guide, tips, common_mistakes) VALUES
('Basic Sit Command', 'Teach your dog to sit on command using positive reinforcement', 'Basic Obedience', 'Beginner', 'Positive Reinforcement', 
 '{"steps": [{"step": 1, "instruction": "Hold a treat close to your dogs nose"}, {"step": 2, "instruction": "Slowly move the treat up and back over their head"}, {"step": 3, "instruction": "As their bottom touches the ground, say \"sit\""}, {"step": 4, "instruction": "Immediately give the treat and praise"}]}',
 '["Keep sessions short (5-10 minutes)", "Practice in different locations", "Use high-value treats for motivation", "Always end on a positive note"]',
 '["Moving the treat too quickly", "Not timing the command with the behavior", "Repeating the command multiple times", "Not being consistent with rewards"]'),

('Leash Walking', 'Train your dog to walk calmly on a leash without pulling', 'Basic Obedience', 'Beginner', 'Positive Reinforcement',
 '{"steps": [{"step": 1, "instruction": "Start indoors with treats"}, {"step": 2, "instruction": "Hold treats at your side"}, {"step": 3, "instruction": "Begin walking, rewarding when the leash is loose"}, {"step": 4, "instruction": "Stop when the dog pulls, continue when loose"}]}',
 '["Start in low-distraction environments", "Use high-value treats", "Be patient and consistent", "Change direction when dog pulls"]',
 '["Allowing pulling to continue", "Using punishment instead of positive reinforcement", "Not being consistent with timing", "Rushing the process"]'),

('Recall Training', 'Teach your dog to come when called every time', 'Basic Obedience', 'Intermediate', 'Positive Reinforcement',
 '{"steps": [{"step": 1, "instruction": "Start in a fenced area"}, {"step": 2, "instruction": "Get down to your dogs level"}, {"step": 3, "instruction": "Call their name with enthusiasm"}, {"step": 4, "instruction": "When they come, reward immediately"}]}',
 '["Use enthusiastic, happy voice", "Never call to end fun activities", "Make coming to you the best thing ever", "Practice in safe, enclosed areas"]',
 '["Calling the name without following through", "Being angry when they dont come", "Not rewarding promptly", "Using recall for negative experiences"]');
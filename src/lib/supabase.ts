import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://krubbpnebqatomzpivij.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtydWJicG5lYnFhdG9tenBpdmlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDM2MzQsImV4cCI6MjA3ODUxOTYzNH0.lSKxxPsEw5vc3HEFkyeLr8glFPjHkqDmNatywDc8M98";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export interface Dog {
  id: string;
  user_id: string;
  name: string;
  breed?: string;
  breed_mix?: string;
  age_years?: number;
  age_months?: number;
  weight_kg?: number;
  sex?: string;
  is_neutered?: boolean;
  health_conditions?: string[];
  temperament_traits?: string[];
  current_skills?: string[];
  behavioral_concerns?: string[];
  energy_level?: string;
  socialization_level?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserProfile {
  id: string;
  training_experience?: string;
  time_commitment_minutes?: number;
  preferred_reinforcements?: string[];
  learning_style?: string;
  training_goals?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface TrainingExercise {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty_level: string;
  duration_minutes?: number;
  required_skills?: string[];
  breed_suitability?: string[];
  training_method: string;
  step_by_step_guide: any;
  tips?: string[];
  common_mistakes?: string[];
  success_criteria?: string[];
  video_url?: string;
  image_url?: string;
  scientific_basis?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TrainingPlan {
  id: string;
  dog_id: string;
  user_id: string;
  plan_name: string;
  goal_description?: string;
  difficulty_level?: string;
  estimated_duration_weeks?: number;
  exercise_sequence: any;
  current_exercise_index?: number;
  ai_recommendations?: any;
  personalization_factors?: any;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TrainingSession {
  id: string;
  dog_id: string;
  user_id: string;
  training_plan_id?: string;
  exercise_id?: string;
  session_date: string;
  duration_minutes?: number;
  success_rate?: number;
  dog_engagement_level?: number;
  difficulty_rating?: number;
  notes?: string;
  reinforcements_used?: string[];
  environmental_factors?: any;
  challenges_faced?: string[];
  wins_achieved?: string[];
  created_at?: string;
}

export interface KnowledgeBase {
  id: string;
  title: string;
  slug: string;
  category: string;
  subcategory?: string;
  content: string;
  summary?: string;
  difficulty_level?: string;
  target_audience?: string;
  key_concepts?: string[];
  scientific_references?: string[];
  author?: string;
  image_url?: string;
  video_url?: string;
  related_exercises?: string[];
  tags?: string[];
  view_count?: number;
  helpful_count?: number;
  published_at?: string;
  updated_at?: string;
}

export interface BreedInfo {
  id: string;
  breed_name: string;
  breed_group?: string;
  size_category?: string;
  energy_level?: string;
  intelligence_rank?: number;
  trainability_score?: number;
  common_traits?: string[];
  training_considerations?: string[];
  typical_challenges?: string[];
  recommended_exercises?: string[];
  exercise_requirements?: string;
  mental_stimulation_needs?: string;
  socialization_importance?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}
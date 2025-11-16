Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const { dogId } = await req.json();

        if (!dogId) {
            throw new Error('Dog ID is required');
        }

        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        // Get auth token for user ID
        const authHeader = req.headers.get('authorization');
        if (!authHeader) {
            throw new Error('No authorization header');
        }

        const token = authHeader.replace('Bearer ', '');

        // Verify token and get user
        const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'apikey': serviceRoleKey
            }
        });

        if (!userResponse.ok) {
            throw new Error('Invalid token');
        }

        const userData = await userResponse.json();
        const userId = userData.id;

        // Fetch dog profile
        const dogResponse = await fetch(`${supabaseUrl}/rest/v1/dogs?id=eq.${dogId}&user_id=eq.${userId}`, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey
            }
        });

        const dogs = await dogResponse.json();
        if (!dogs || dogs.length === 0) {
            throw new Error('Dog not found');
        }

        const dog = dogs[0];

        // Fetch user profile
        const userProfileResponse = await fetch(`${supabaseUrl}/rest/v1/user_profiles?id=eq.${userId}`, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey
            }
        });

        const userProfiles = await userProfileResponse.json();
        const userProfile = userProfiles && userProfiles.length > 0 ? userProfiles[0] : null;

        // Fetch all training exercises
        const exercisesResponse = await fetch(`${supabaseUrl}/rest/v1/training_exercises?select=*`, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey
            }
        });

        const allExercises = await exercisesResponse.json();

        // Fetch breed info if available
        let breedInfo = null;
        if (dog.breed) {
            const breedResponse = await fetch(`${supabaseUrl}/rest/v1/breed_info?breed_name=eq.${encodeURIComponent(dog.breed)}`, {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey
                }
            });

            const breeds = await breedResponse.json();
            if (breeds && breeds.length > 0) {
                breedInfo = breeds[0];
            }
        }

        // AI Algorithm: Generate personalized training plan
        const trainingPlan = generatePersonalizedPlan(dog, userProfile, allExercises, breedInfo);

        // Save training plan to database
        const insertResponse = await fetch(`${supabaseUrl}/rest/v1/training_plans`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                dog_id: dogId,
                user_id: userId,
                plan_name: trainingPlan.planName,
                goal_description: trainingPlan.goalDescription,
                difficulty_level: trainingPlan.difficultyLevel,
                estimated_duration_weeks: trainingPlan.estimatedDurationWeeks,
                exercise_sequence: trainingPlan.exerciseSequence,
                current_exercise_index: 0,
                ai_recommendations: trainingPlan.aiRecommendations,
                personalization_factors: trainingPlan.personalizationFactors,
                status: 'active'
            })
        });

        if (!insertResponse.ok) {
            const errorText = await insertResponse.text();
            throw new Error(`Database insert failed: ${errorText}`);
        }

        const savedPlan = await insertResponse.json();

        return new Response(JSON.stringify({
            data: {
                plan: savedPlan[0],
                insights: trainingPlan.aiRecommendations
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Generate training plan error:', error);

        const errorResponse = {
            error: {
                code: 'TRAINING_PLAN_GENERATION_FAILED',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});

// AI Algorithm: Generate personalized training plan based on dog characteristics
function generatePersonalizedPlan(dog, userProfile, allExercises, breedInfo) {
    const ageInMonths = (dog.age_years || 0) * 12 + (dog.age_months || 0);
    const isPuppy = ageInMonths < 12;
    const isAdolescent = ageInMonths >= 12 && ageInMonths < 24;
    const ownerExperience = userProfile?.training_experience || 'beginner';
    const timeCommitment = userProfile?.time_commitment_minutes || 15;

    // Determine difficulty level based on owner experience and dog characteristics
    let difficultyLevel = 'beginner';
    if (ownerExperience === 'intermediate' || ownerExperience === 'advanced') {
        difficultyLevel = 'intermediate';
    }

    // Filter exercises based on difficulty and dog's current skills
    const currentSkills = dog.current_skills || [];
    const availableExercises = allExercises.filter(ex => {
        const meetsSkillRequirements = !ex.required_skills || 
            ex.required_skills.length === 0 || 
            ex.required_skills.some(skill => currentSkills.includes(skill));
        
        const appropriateDifficulty = 
            ex.difficulty_level === 'beginner' || 
            (difficultyLevel === 'intermediate' && ex.difficulty_level === 'intermediate');

        return meetsSkillRequirements && appropriateDifficulty;
    });

    // Prioritize exercises based on behavioral concerns and goals
    const prioritizedExercises = prioritizeExercises(
        availableExercises, 
        dog.behavioral_concerns || [], 
        userProfile?.training_goals || [],
        breedInfo
    );

    // Build exercise sequence
    const exerciseSequence = prioritizedExercises.slice(0, 8).map((ex, index) => ({
        exerciseId: ex.id,
        exerciseTitle: ex.title,
        order: index + 1,
        recommendedSessionsPerWeek: calculateSessionFrequency(timeCommitment, ex.duration_minutes),
        estimatedWeeksToMaster: estimateMasteryTime(ex.difficulty_level, dog, breedInfo),
        personalizedTips: generatePersonalizedTips(ex, dog, breedInfo)
    }));

    // Generate AI recommendations
    const aiRecommendations = {
        planRationale: generatePlanRationale(dog, breedInfo, userProfile),
        keyFocusAreas: identifyKeyFocusAreas(dog.behavioral_concerns || [], userProfile?.training_goals || []),
        expectedChallenges: predictChallenges(dog, breedInfo),
        motivationStrategy: determineMotivationStrategy(dog, breedInfo),
        progressMilestones: defineProgressMilestones(exerciseSequence.length)
    };

    // Calculate estimated duration
    const estimatedDurationWeeks = exerciseSequence.reduce((sum, ex) => sum + ex.estimatedWeeksToMaster, 0);

    return {
        planName: `${dog.name}'s Personalized Training Journey`,
        goalDescription: generateGoalDescription(dog, userProfile),
        difficultyLevel,
        estimatedDurationWeeks: Math.ceil(estimatedDurationWeeks),
        exerciseSequence,
        aiRecommendations,
        personalizationFactors: {
            dogAge: ageInMonths,
            isPuppy,
            breed: dog.breed,
            energyLevel: dog.energy_level,
            ownerExperience,
            timeCommitment,
            behavioralConcerns: dog.behavioral_concerns,
            temperamentTraits: dog.temperament_traits
        }
    };
}

function prioritizeExercises(exercises, behavioralConcerns, trainingGoals, breedInfo) {
    return exercises.sort((a, b) => {
        let scoreA = 0;
        let scoreB = 0;

        // Prioritize based on behavioral concerns
        if (behavioralConcerns.includes('leash pulling') && a.title.toLowerCase().includes('leash')) scoreA += 10;
        if (behavioralConcerns.includes('leash pulling') && b.title.toLowerCase().includes('leash')) scoreB += 10;
        
        if (behavioralConcerns.includes('recall issues') && a.title.toLowerCase().includes('recall')) scoreA += 10;
        if (behavioralConcerns.includes('recall issues') && b.title.toLowerCase().includes('recall')) scoreB += 10;

        // Prioritize foundational skills for beginners
        if (a.category === 'Basic Obedience') scoreA += 5;
        if (b.category === 'Basic Obedience') scoreB += 5;

        // Prioritize based on training goals
        trainingGoals.forEach(goal => {
            if (a.title.toLowerCase().includes(goal.toLowerCase())) scoreA += 8;
            if (b.title.toLowerCase().includes(goal.toLowerCase())) scoreB += 8;
        });

        return scoreB - scoreA;
    });
}

function calculateSessionFrequency(timeCommitment, exerciseDuration) {
    const sessionsPerWeek = Math.floor((timeCommitment * 7) / (exerciseDuration || 15));
    return Math.min(Math.max(sessionsPerWeek, 3), 7); // Between 3-7 sessions per week
}

function estimateMasteryTime(difficulty, dog, breedInfo) {
    let baseWeeks = 2;
    
    if (difficulty === 'intermediate') baseWeeks = 3;
    if (difficulty === 'advanced') baseWeeks = 4;

    // Adjust based on breed trainability
    if (breedInfo && breedInfo.trainability_score) {
        if (breedInfo.trainability_score >= 8) baseWeeks *= 0.8;
        else if (breedInfo.trainability_score <= 5) baseWeeks *= 1.3;
    }

    // Adjust for age
    const ageInMonths = (dog.age_years || 0) * 12 + (dog.age_months || 0);
    if (ageInMonths < 6) baseWeeks *= 1.2; // Puppies need more time
    if (ageInMonths >= 12 && ageInMonths < 24) baseWeeks *= 1.1; // Adolescents

    return Math.ceil(baseWeeks);
}

function generatePersonalizedTips(exercise, dog, breedInfo) {
    const tips = [];

    if (breedInfo) {
        if (breedInfo.energy_level === 'high' || breedInfo.energy_level === 'very high') {
            tips.push(`${dog.breed}s are high-energy - ensure adequate exercise before training sessions for better focus`);
        }

        if (breedInfo.trainability_score >= 8) {
            tips.push(`Your ${dog.breed} is highly trainable - take advantage of their eagerness to learn by keeping sessions engaging`);
        } else if (breedInfo.trainability_score <= 5) {
            tips.push(`${dog.breed}s can be independent - use high-value rewards and keep sessions short and fun`);
        }
    }

    const ageInMonths = (dog.age_years || 0) * 12 + (dog.age_months || 0);
    if (ageInMonths < 6) {
        tips.push('Puppy attention spans are short - keep sessions to 5-10 minutes maximum');
    }

    if (dog.energy_level === 'high') {
        tips.push('Burn off excess energy with play before training for better concentration');
    }

    return tips;
}

function generatePlanRationale(dog, breedInfo, userProfile) {
    let rationale = `This personalized plan is designed specifically for ${dog.name}, `;
    
    if (breedInfo) {
        rationale += `a ${dog.breed} with ${breedInfo.energy_level} energy and ${breedInfo.trainability_score}/10 trainability. `;
    } else {
        rationale += `tailored to their unique characteristics. `;
    }

    rationale += `The exercises are sequenced to build on each other progressively, starting with foundational skills and advancing as ${dog.name} demonstrates mastery. `;

    if (userProfile?.training_experience === 'beginner') {
        rationale += `As a beginner trainer, you'll start with clear, straightforward exercises that set you both up for success.`;
    } else {
        rationale += `Your training experience allows for a balanced approach combining fundamental and intermediate skills.`;
    }

    return rationale;
}

function identifyKeyFocusAreas(behavioralConcerns, trainingGoals) {
    const focusAreas = [];

    if (behavioralConcerns.length > 0) {
        focusAreas.push({
            area: 'Behavior Modification',
            priority: 'high',
            description: `Addressing: ${behavioralConcerns.join(', ')}`
        });
    }

    if (trainingGoals.includes('loose leash walking') || trainingGoals.includes('leash manners')) {
        focusAreas.push({
            area: 'Leash Skills',
            priority: 'high',
            description: 'Building polite walking behaviors for enjoyable outings'
        });
    }

    if (trainingGoals.includes('recall') || trainingGoals.includes('off-leash reliability')) {
        focusAreas.push({
            area: 'Reliability',
            priority: 'high',
            description: 'Developing strong recall for safety and freedom'
        });
    }

    focusAreas.push({
        area: 'Foundation Skills',
        priority: 'medium',
        description: 'Essential obedience commands for daily life'
    });

    return focusAreas;
}

function predictChallenges(dog, breedInfo) {
    const challenges = [];

    const ageInMonths = (dog.age_years || 0) * 12 + (dog.age_months || 0);
    if (ageInMonths >= 6 && ageInMonths < 18) {
        challenges.push({
            challenge: 'Adolescent Regression',
            mitigation: 'Stay consistent, be patient, and increase reinforcement value during this phase'
        });
    }

    if (breedInfo) {
        if (breedInfo.energy_level === 'very high') {
            challenges.push({
                challenge: 'Maintaining Focus',
                mitigation: 'Ensure vigorous exercise before training and use very high-value rewards'
            });
        }

        if (breedInfo.breed_group === 'Hound') {
            challenges.push({
                challenge: 'Distraction by Scents',
                mitigation: 'Train in low-scent environments initially and use extra-enticing food rewards'
            });
        }
    }

    if (dog.temperament_traits && dog.temperament_traits.includes('anxious')) {
        challenges.push({
            challenge: 'Training Anxiety',
            mitigation: 'Keep sessions very short, positive, and at your dog\'s pace'
        });
    }

    return challenges;
}

function determineMotivationStrategy(dog, breedInfo) {
    let strategy = 'Use a variety of high-value rewards including: ';
    const motivators = [];

    if (breedInfo) {
        if (breedInfo.breed_group === 'Sporting' || breedInfo.breed_group === 'Herding') {
            motivators.push('play with favorite toys');
        }
        if (['Labrador Retriever', 'Beagle', 'Bulldog'].includes(breedInfo.breed_name)) {
            motivators.push('premium food treats');
        }
    }

    motivators.push('enthusiastic verbal praise');
    motivators.push('brief play breaks');

    strategy += motivators.join(', ');
    strategy += '. Vary rewards to maintain interest and engagement.';

    return strategy;
}

function defineProgressMilestones(totalExercises) {
    return [
        {
            milestone: 'Foundation Complete',
            criteria: 'First 2 exercises mastered',
            celebration: 'Your dog has built a solid training foundation!'
        },
        {
            milestone: 'Halfway Hero',
            criteria: `${Math.ceil(totalExercises / 2)} exercises mastered`,
            celebration: 'Excellent progress - you\'re halfway through the plan!'
        },
        {
            milestone: 'Advanced Achiever',
            criteria: `${Math.ceil(totalExercises * 0.75)} exercises mastered`,
            celebration: 'Outstanding dedication - advanced skills unlocked!'
        },
        {
            milestone: 'Training Champion',
            criteria: 'All exercises completed',
            celebration: 'Congratulations! Your dog is a well-trained superstar!'
        }
    ];
}

function generateGoalDescription(dog, userProfile) {
    let description = `Transform ${dog.name} into a well-behaved companion through positive reinforcement training. `;

    if (userProfile && userProfile.training_goals && userProfile.training_goals.length > 0) {
        description += `Focus areas: ${userProfile.training_goals.slice(0, 3).join(', ')}. `;
    }

    description += 'Build skills progressively while strengthening your bond and communication.';

    return description;
}
Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 200 });
  }

  try {
    const { messages, dogId, userId } = await req.json();

    // Get OpenRouter API key from environment
    const openRouterKey = Deno.env.get('OPENROUTER_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!openRouterKey) {
      // Fallback response when API key not configured
      return new Response(
        JSON.stringify({
          message: "I'm your AI training assistant! While I'm being configured with advanced AI capabilities, I can still help you with basic guidance. For the best experience, please check back soon when full AI chat is enabled. In the meantime, explore our knowledge base for comprehensive training resources!"
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Check if user is requesting a training plan
    const lastMessage = messages[messages.length - 1];
    const needsTrainingPlan = shouldCreateTrainingPlan(lastMessage.content);

    // Extract dog information from messages
    const dogInfo = extractDogInfo(messages);

    // If user wants a training plan and has a dog, create one
    if (needsTrainingPlan && dogId && userId && supabaseUrl && serviceRoleKey) {
      try {
        // Call the generate-training-plan edge function
        const planResponse = await fetch(`${supabaseUrl}/functions/v1/generate-training-plan`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ dogId }),
        });

        if (planResponse.ok) {
          const planData = await planResponse.json();
          return new Response(
            JSON.stringify({
              message: `I've created a personalized training plan for your dog! 🐕

**Your Training Plan Includes:**
- ${planData.data.plan.exercise_sequence.length} tailored exercises
- Progressive difficulty levels
- Estimated ${planData.data.plan.estimated_duration_weeks} weeks to complete
- Breed-specific recommendations

**Next Steps:**
1. Visit your Dashboard to view the full plan
2. Start with the first recommended exercise
3. Track progress as you go

The plan is designed specifically for ${dogInfo.name || 'your dog'} and takes into account their breed characteristics and any training goals you mentioned. Each exercise includes step-by-step instructions and personalized tips!

Would you like me to explain any specific exercise in detail?`,
              trainingPlanCreated: true,
              planId: planData.data.plan.id,
              model: 'gpt-4-turbo',
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200,
            }
          );
        }
      } catch (error) {
        console.error('Error creating training plan:', error);
        // Continue with regular AI response if plan creation fails
      }
    }

    // System prompt for dog training expertise
    const systemPrompt = {
      role: 'system',
      content: `You are an expert dog training assistant specializing in positive reinforcement methods. Your role is to:

1. Provide science-based, ethical dog training advice
2. Focus exclusively on positive reinforcement techniques
3. Be encouraging and supportive to dog owners
4. Offer practical, actionable steps
5. Consider breed characteristics, age, and temperament
6. Address behavioral issues with compassion
7. Recommend professional help when needed
8. Never suggest aversive training methods

${dogInfo.name ? `You know about ${dogInfo.name}` : ''} ${dogInfo.breed ? `(a ${dogInfo.breed})` : ''} ${dogInfo.age ? `who is ${dogInfo.age} old` : ''}.

Always be concise, friendly, and practical. If asked about topics unrelated to dog training, politely redirect to dog training topics.`
    };

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterKey}`,
        'HTTP-Referer': 'https://pawsitiveai.coach',
        'X-Title': 'PawsitiveAI Coach',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4-turbo',
        messages: [systemPrompt, ...messages],
        temperature: 0.7,
        max_tokens: 600,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      // Fallback to Claude if GPT-4 fails
      const claudeResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openRouterKey}`,
          'HTTP-Referer': 'https://pawsitiveai.coach',
          'X-Title': 'PawsitiveAI Coach',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3-haiku',
          messages: [systemPrompt, ...messages],
          temperature: 0.7,
          max_tokens: 600,
        }),
      });

      if (!claudeResponse.ok) {
        throw new Error('Both AI models failed');
      }

      const claudeData = await claudeResponse.json();
      return new Response(
        JSON.stringify({
          message: claudeData.choices[0].message.content,
          model: 'claude-3-haiku',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    const data = await response.json();
    
    return new Response(
      JSON.stringify({
        message: data.choices[0].message.content,
        model: 'gpt-4-turbo',
        dogInfo: dogInfo,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('AI Chat Error:', error);
    
    // Friendly fallback response
    return new Response(
      JSON.stringify({
        message: "I'm having a moment of difficulty connecting to my training knowledge base. Please try again in a moment! In the meantime, check out our comprehensive knowledge base for helpful training tips and techniques."
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  }
});

function shouldCreateTrainingPlan(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  const keywords = [
    'training plan', 'create plan', 'help train', 'how to train', 
    'training schedule', 'exercise plan', 'teach my dog',
    'training program', 'make a plan', 'need help training',
    'personalized plan', 'custom training'
  ];
  return keywords.some(keyword => lowerMessage.includes(keyword));
}

function extractDogInfo(messages: any[]): any {
  const userMessages = messages.filter(m => m.role === 'user');
  const combinedText = userMessages.map(m => m.content).join(' ').toLowerCase();
  
  const dogInfo: any = {};
  
  // Extract dog name
  const nameMatches = combinedText.match(/dog(?:'|')?s?\s+name\s+(?:is\s+)?([a-zA-Z]+)/) || 
                      combinedText.match(/my\s+dog\s+(?:is\s+)?(?:named\s+)?([a-zA-Z]+)/) ||
                      combinedText.match(/name\s*:\s*([a-zA-Z]+)/);
  if (nameMatches) {
    dogInfo.name = nameMatches[1].charAt(0).toUpperCase() + nameMatches[1].slice(1);
  }
  
  // Extract breed
  const breeds = ['golden retriever', 'german shepherd', 'labrador', 'border collie', 'poodle', 'bulldog', 'beagle', 'rottweiler', 'yorkshire terrier', 'dachshund', 'boxer', 'husky'];
  for (const breed of breeds) {
    if (combinedText.includes(breed)) {
      dogInfo.breed = breed.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      break;
    }
  }
  
  // Extract age
  const ageMatch = combinedText.match(/(?:age|y(?:ea)?rs?|months?)\s*:?\s*(\d+)\s*(?:years?|yrs?|months?|mos?)/) ||
                   combinedText.match(/(\d+)\s*(?:years?|yrs?|months?|mos?)\s*old/);
  if (ageMatch) {
    dogInfo.age = `${ageMatch[1]} years`;
  }
  
  return dogInfo;
}

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { message } = await req.json()
    console.log("Received message:", message)

    // Enhanced response mapping
    const responses: { [key: string]: string } = {
      'class': 'Classes run from 8 AM to 5 PM on weekdays. You can check your personal schedule in the Dashboard.',
      'schedule': 'Your class schedule is available in the Dashboard. You can also sync it with your calendar app.',
      'events': 'There are several upcoming events this week! Check the Events page for details on workshops, seminars, and social gatherings.',
      'clubs': 'We have over 50 student clubs covering academics, sports, arts, and social causes. Visit the Clubs page to browse and join.',
      'discussions': 'The discussion forums are active with topics on academics, campus life, and career opportunities.',
      'exams': 'Final exams are scheduled for the last two weeks of the semester. Check with your professors for specific dates.',
      'library': 'The university library is open 24/7 during the academic year. You can reserve study rooms online.',
      'sports': 'Our university has teams in basketball, soccer, swimming, and track. Tryouts are held at the beginning of each semester.',
      'food': 'The main cafeteria is open from 7 AM to 10 PM. There are also cafes in the library and student center.',
      'housing': 'On-campus housing applications for next semester are due by the end of this month.',
      'parking': 'Student parking permits can be purchased online through the university portal.',
      'grades': 'Final grades are posted one week after the end of the semester.',
      'career': 'The Career Services office offers resume reviews, mock interviews, and job placement assistance.',
      'financial': 'For questions about tuition, scholarships, or financial aid, please visit the Financial Services office.',
      'points': 'You can earn engagement points by participating in campus activities, discussions, and attending events!',
      'gamification': 'Our new engagement system rewards active participation with points, badges, and special privileges.',
      'badges': 'Badges are awarded for academic achievements, community service, and participation in university events.',
      'rewards': 'Collect points to unlock special rewards like priority registration, dining discounts, and exclusive events.',
      'default': 'I can help you with information about classes, events, clubs, discussions, facilities, and our new engagement rewards system. What would you like to know?',
    }

    // More sophisticated matching
    let response = responses.default;
    for (const [key, value] of Object.entries(responses)) {
      if (message.toLowerCase().includes(key)) {
        response = value;
        break;
      }
    }

    console.log("Sending response:", response)

    return new Response(
      JSON.stringify({ response }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error("Error processing request:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})


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

    // Simple response mapping
    const responses: { [key: string]: string } = {
      'class': 'Classes run from 8 AM to 5 PM on weekdays.',
      'events': 'You can check upcoming events on the Events page.',
      'clubs': 'Visit the Clubs page to browse and join student organizations.',
      'default': 'I can help you with class schedules, events, and general university information.',
    }

    const response = Object.entries(responses).find(([key]) => 
      message.toLowerCase().includes(key))?.[1] || responses.default

    return new Response(
      JSON.stringify({ response }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})

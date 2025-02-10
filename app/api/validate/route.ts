import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Set CORS headers helper
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Referrer-Policy': 'no-referrer',  // Make it public by removing referrer restrictions
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Request body:', body);

    const { apikey } = body;
    console.log('API Key:', apikey);

    if (!apikey) {
      return NextResponse.json({ 
        message: "Invalid API key",
        debug: "No API key provided" 
      }, { 
        status: 400,
        headers: corsHeaders()
      });
    }

    const { data, error } = await supabase
      .from('api_keys')
      .select('id, usage, max_usage, has_monthly_limit, monthly_limit')
      .eq('key', apikey)
      .single();

    console.log('Supabase response:', { data, error });

    if (error?.code === 'PGRST116' || !data) {
      return NextResponse.json({ 
        message: "Invalid API key",
        debug: error ? error.message : "No data found" 
      }, { 
        status: 401,
        headers: corsHeaders()
      });
    }

    // Check usage limits
    const remaining_calls = data.max_usage - data.usage;
    if (remaining_calls <= 0) {
      return NextResponse.json({ 
        message: "API key has exceeded maximum usage limit" 
      }, { 
        status: 403,
        headers: corsHeaders()
      });
    }

    // Check monthly limit if enabled
    if (data.has_monthly_limit && data.monthly_limit && data.usage >= data.monthly_limit) {
      return NextResponse.json({ 
        message: "API key has exceeded monthly usage limit" 
      }, { 
        status: 403,
        headers: corsHeaders()
      });
    }

    return NextResponse.json({
      message: "API key validated successfully",
      data: {
        remaining_calls,
        monthly_remaining: data.monthly_limit ? data.monthly_limit - data.usage : undefined,
        is_monthly_limit_enabled: data.has_monthly_limit
      }
    }, {
      headers: corsHeaders()
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ 
      message: "Invalid API key",
      debug: error instanceof Error ? error.message : "Unknown error"
    }, { 
      status: 500,
      headers: corsHeaders()
    });
  }
} 
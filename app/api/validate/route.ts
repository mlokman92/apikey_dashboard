import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  // Add CORS headers
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  try {
    const body = await request.json();
    console.log('Request body:', body); // Debug log

    const { apikey } = body;
    console.log('API Key:', apikey); // Debug log

    if (!apikey) {
      return NextResponse.json({ 
        message: "Invalid API key",
        debug: "No API key provided" 
      }, { 
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      });
    }

    const { data, error } = await supabase
      .from('api_keys')
      .select('id, usage, max_usage, has_monthly_limit, monthly_limit')
      .eq('key', apikey)
      .single();

    console.log('Supabase response:', { data, error }); // Debug log

    if (error?.code === 'PGRST116' || !data) {
      return NextResponse.json({ 
        message: "Invalid API key",
        debug: error ? error.message : "No data found" 
      }, { 
        status: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      });
    }

    // Check usage limits
    const remaining_calls = data.max_usage - data.usage;
    if (remaining_calls <= 0) {
      return NextResponse.json({ message: "API key has exceeded maximum usage limit" }, { status: 403 });
    }

    // Check monthly limit if enabled
    if (data.has_monthly_limit && data.monthly_limit && data.usage >= data.monthly_limit) {
      return NextResponse.json({ message: "API key has exceeded monthly usage limit" }, { status: 403 });
    }

    return NextResponse.json({
      message: "API key validated successfully",
      data: {
        remaining_calls,
        monthly_remaining: data.monthly_limit ? data.monthly_limit - data.usage : undefined,
        is_monthly_limit_enabled: data.has_monthly_limit
      }
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    });

  } catch (error) {
    console.error('Error:', error); // Debug log
    return NextResponse.json({ 
      message: "Invalid API key",
      debug: error instanceof Error ? error.message : "Unknown error"
    }, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
} 
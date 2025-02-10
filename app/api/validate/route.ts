import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { apiKey } = await request.json();

    if (!apiKey) {
      return NextResponse.json({ message: "Invalid API key" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('api_keys')
      .select('id, usage, max_usage, has_monthly_limit, monthly_limit')
      .eq('key', apiKey)
      .single();

    if (error?.code === 'PGRST116' || !data) {
      return NextResponse.json({ message: "Invalid API key" }, { status: 401 });
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
    });

  } catch (error) {
    return NextResponse.json({ message: "Invalid API key" }, { status: 500 });
  }
} 
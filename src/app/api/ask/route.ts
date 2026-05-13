import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { Redis } from '@upstash/redis';
import { GTHL_SYSTEM_PROMPT } from '../../../lib/gthlContext';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const DEVICE_DAILY_LIMIT = 5;
const COMMUNITY_DAILY_LIMIT = 400;

// Community counter keys
const COMMUNITY_COUNT_KEY = 'gthl:community:count';
const COMMUNITY_DATE_KEY = 'gthl:community:date';

function getTodayEST(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Toronto' });
}

async function getCommunityCount(): Promise<number> {
  const storedDate = await redis.get<string>(COMMUNITY_DATE_KEY);
  const today = getTodayEST();
  if (storedDate !== today) {
    await redis.set(COMMUNITY_COUNT_KEY, 0);
    await redis.set(COMMUNITY_DATE_KEY, today);
    return 0;
  }
  const count = await redis.get<number>(COMMUNITY_COUNT_KEY);
  return count || 0;
}

async function incrementCommunityCount(): Promise<number> {
  const count = await redis.incr(COMMUNITY_COUNT_KEY);
  return count;
}

async function getIPCount(ip: string): Promise<number> {
  const today = getTodayEST();
  const key = `gthl:ip:${ip}:${today}`;
  const count = await redis.get<number>(key);
  return count || 0;
}

async function incrementIPCount(ip: string): Promise<number> {
  const today = getTodayEST();
  const key = `gthl:ip:${ip}:${today}`;
  const count = await redis.incr(key);
  // Expire after 48 hours to auto-clean old keys
  await redis.expire(key, 172800);
  return count;
}

export async function POST(req: NextRequest) {
  // Get IP address
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1';

  // Check community limit
  const communityCount = await getCommunityCount();
  if (communityCount >= COMMUNITY_DAILY_LIMIT) {
    return NextResponse.json(
      { error: 'COMMUNITY_LIMIT', remainingCommunity: 0 },
      { status: 429 }
    );
  }

  // Check IP limit
  const ipCount = await getIPCount(ip);
  if (ipCount >= DEVICE_DAILY_LIMIT) {
    return NextResponse.json(
      {
        error: "You've used your 5 free questions today. Come back tomorrow at midnight EST!",
        remainingCommunity: Math.max(0, COMMUNITY_DAILY_LIMIT - communityCount),
        remainingDevice: 0,
      },
      { status: 429 }
    );
  }

  const body = await req.json();
  const { question } = body;

  if (!question || question.trim().length === 0) {
    return NextResponse.json(
      { error: 'No question provided' },
      { status: 400 }
    );
  }

  if (question.length > 500) {
    return NextResponse.json(
      { error: 'Question too long — please keep it under 500 characters' },
      { status: 400 }
    );
  }

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
      system: GTHL_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: question }],
    });

    const answer =
      response.content[0].type === 'text' ? response.content[0].text : '';

    // Only increment AFTER successful response
    const newIPCount = await incrementIPCount(ip);
    const newCommunityCount = await incrementCommunityCount();

    return NextResponse.json({
      answer,
      remainingCommunity: Math.max(0, COMMUNITY_DAILY_LIMIT - newCommunityCount),
      remainingDevice: Math.max(0, DEVICE_DAILY_LIMIT - newIPCount),
    });
  } catch (error) {
    console.error('Anthropic API error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

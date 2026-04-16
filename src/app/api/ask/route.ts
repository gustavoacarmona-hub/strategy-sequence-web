import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { GTHL_SYSTEM_PROMPT } from '../../../lib/gthlContext';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const DAILY_LIMIT = 400;
let dailyCount = 0;
let lastReset = new Date().toDateString();

function checkAndResetDaily() {
  const today = new Date().toDateString();
  if (today !== lastReset) {
    dailyCount = 0;
    lastReset = today;
  }
}

export async function POST(req: NextRequest) {
  checkAndResetDaily();

  if (dailyCount >= DAILY_LIMIT) {
    return NextResponse.json(
      { error: 'COMMUNITY_LIMIT', remainingCommunity: 0 },
      { status: 429 }
    );
  }

  const body = await req.json();
  const { question } = body;

  if (!question || question.trim().length === 0) {
    return NextResponse.json(
      { error: 'No question provided', remainingCommunity: DAILY_LIMIT - dailyCount },
      { status: 400 }
    );
  }

  if (question.length > 500) {
    return NextResponse.json(
      { error: 'Question too long — please keep it under 500 characters', remainingCommunity: DAILY_LIMIT - dailyCount },
      { status: 400 }
    );
  }

  try {
    dailyCount++;

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
      system: GTHL_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: question }],
    });

    const answer =
      response.content[0].type === 'text' ? response.content[0].text : '';

    return NextResponse.json({
      answer,
      remainingCommunity: Math.max(0, DAILY_LIMIT - dailyCount),
    });
  } catch (error) {
    dailyCount = Math.max(0, dailyCount - 1);
    console.error('Anthropic API error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.', remainingCommunity: DAILY_LIMIT - dailyCount },
      { status: 500 }
    );
  }
}

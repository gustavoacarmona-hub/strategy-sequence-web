import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { question, answer, helpful, comment } = body;

  const GOOGLE_FORM_URL = process.env.GOOGLE_FORM_URL;

  if (!GOOGLE_FORM_URL) {
    console.log('Feedback received (no Google Form configured):', {
      question,
      helpful,
      comment: comment || 'none',
    });
    return NextResponse.json({ success: true });
  }

  try {
    const formData = new URLSearchParams();
    formData.append(process.env.GOOGLE_FORM_QUESTION_FIELD || 'entry.1', question);
    formData.append(process.env.GOOGLE_FORM_ANSWER_FIELD || 'entry.2', answer);
    formData.append(process.env.GOOGLE_FORM_HELPFUL_FIELD || 'entry.3', helpful ? 'Yes' : 'No');
    formData.append(process.env.GOOGLE_FORM_COMMENT_FIELD || 'entry.4', comment || '');
    formData.append(process.env.GOOGLE_FORM_DATE_FIELD || 'entry.5', new Date().toISOString());

    await fetch(GOOGLE_FORM_URL, { method: 'POST', body: formData });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Feedback submission error:', error);
    return NextResponse.json({ success: true });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const CLIENT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = (process.env.GOOGLE_PRIVATE_KEY || '')
  .replace(/\\n/g, '\n')
  .replace(/^"/, '')
  .replace(/"$/, '');

async function appendToSheet(values: string[][]) {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: CLIENT_EMAIL,
      private_key: PRIVATE_KEY,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: 'Sheet1!A:F',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values,
    },
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { question, answer, helpful, comment } = body;

  const date = new Date().toLocaleString('en-CA', {
    timeZone: 'America/Toronto',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  const helpfulText = helpful ? '👍 Yes' : '👎 No';
  const commentText = comment || '';
  const shortAnswer = answer ? answer.substring(0, 500) : '';

  try {
    await appendToSheet([
      [date, question, shortAnswer, helpfulText, commentText],
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Google Sheets error:', error);
    // Still return success to user — don't break their experience
    return NextResponse.json({ success: true });
  }
}

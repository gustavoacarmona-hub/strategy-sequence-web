'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const DEVICE_DAILY_LIMIT = 5;
const COMMUNITY_DAILY_LIMIT = 400;

const SAMPLE_QUESTIONS = [
  'What is icing?',
  'Can a player wear jewellery?',
  'Minimum players for a team?',
  'No bodychecking rules?',
  'How does player affiliation work?',
  'Playoff tie-breaking rules?',
];

function getTodayKey() {
  return new Date().toDateString();
}

function getDeviceCount(): number {
  if (typeof window === 'undefined') return 0;
  const stored = localStorage.getItem('gthl_device_count');
  const storedDate = localStorage.getItem('gthl_device_date');
  if (storedDate !== getTodayKey()) {
    localStorage.setItem('gthl_device_count', '0');
    localStorage.setItem('gthl_device_date', getTodayKey());
    return 0;
  }
  return parseInt(stored || '0', 10);
}

function incrementDeviceCount(): number {
  if (typeof window === 'undefined') return 0;
  const current = getDeviceCount();
  const next = current + 1;
  localStorage.setItem('gthl_device_count', String(next));
  localStorage.setItem('gthl_device_date', getTodayKey());
  return next;
}

interface AnswerState {
  text: string;
  question: string;
  feedback: 'none' | 'up' | 'down';
  showComment: boolean;
  comment: string;
  submitted: boolean;
}

export default function GTHLAssistant() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<AnswerState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deviceCount, setDeviceCount] = useState(0);
  const [communityRemaining, setCommunityRemaining] = useState(COMMUNITY_DAILY_LIMIT);
  const [isRecording, setIsRecording] = useState(false);
  const [mounted, setMounted] = useState(false);
  const recognitionRef = useRef<any>(null);
  const answerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    setDeviceCount(getDeviceCount());
  }, []);

  const deviceRemaining = mounted ? Math.max(0, DEVICE_DAILY_LIMIT - deviceCount) : DEVICE_DAILY_LIMIT;

  const askQuestion = useCallback(async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;

    if (deviceRemaining <= 0) {
      setError("You've used your 5 free questions today. Come back tomorrow at midnight EST!");
      return;
    }

    if (communityRemaining <= 0) {
      setError("Today's 400 community questions have all been used. Come back tomorrow at midnight EST!");
      return;
    }

    setError('');
    setLoading(true);
    setAnswer(null);
    setQuestion(trimmed);

    const newCount = incrementDeviceCount();
    setDeviceCount(newCount);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: trimmed }),
      });

      const data = await res.json();

      if (res.status === 429) {
        setError("Today's 400 community questions have all been used. Come back tomorrow at midnight EST!");
        setDeviceCount(Math.max(0, newCount - 1));
        localStorage.setItem('gthl_device_count', String(Math.max(0, newCount - 1)));
        return;
      }

      if (!res.ok || data.error) {
        setError(data.error || 'Something went wrong. Please try again.');
        setDeviceCount(Math.max(0, newCount - 1));
        localStorage.setItem('gthl_device_count', String(Math.max(0, newCount - 1)));
        return;
      }

      setCommunityRemaining(data.remainingCommunity ?? communityRemaining - 1);
      setAnswer({
        text: data.answer,
        question: trimmed,
        feedback: 'none',
        showComment: false,
        comment: '',
        submitted: false,
      });

      setTimeout(() => {
        answerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch {
      setError('Connection error. Please check your connection and try again.');
      setDeviceCount(Math.max(0, newCount - 1));
      localStorage.setItem('gthl_device_count', String(Math.max(0, newCount - 1)));
    } finally {
      setLoading(false);
    }
  }, [deviceRemaining, communityRemaining]);

  const handleVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setError('Voice input is not supported in this browser. Please try Chrome or Safari.');
      return;
    }
    if (isRecording) {
      recognitionRef.current?.stop();
      return;
    }
    const recognition = new SR();
    recognitionRef.current = recognition;
    recognition.lang = 'en-CA';
    recognition.interimResults = false;
    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setQuestion(transcript);
      askQuestion(transcript);
    };
    recognition.onerror = () => {
      setError('Could not transcribe audio. Please try again or type your question.');
      setIsRecording(false);
    };
    recognition.onend = () => setIsRecording(false);
    recognition.start();
  };

  const submitFeedback = async (helpful: boolean) => {
    if (!answer) return;
    setAnswer(prev => prev ? {
      ...prev,
      feedback: helpful ? 'up' : 'down',
      showComment: !helpful,
    } : null);

    if (helpful) {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: answer.question,
          answer: answer.text,
          helpful: true,
          comment: '',
        }),
      });
    }
  };

  const submitComment = async () => {
    if (!answer) return;
    await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: answer.question,
        answer: answer.text,
        helpful: false,
        comment: answer.comment,
      }),
    });
    setAnswer(prev => prev ? { ...prev, submitted: true } : null);
  };

  const communityPercent = Math.round((communityRemaining / COMMUNITY_DAILY_LIMIT) * 100);
  const communityLow = communityRemaining < 100;

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Barlow:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
      <div style={{
        fontFamily: "'Barlow', sans-serif",
        background: '#1E2A33',
        borderRadius: '16px',
        overflow: 'hidden',
        color: '#F2F4F3',
        maxWidth: '680px',
        margin: '0 auto',
      }}>

        {/* HEADER */}
        <div style={{
          background: '#0A1828',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '2px solid #00ED8A',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              background: '#2C3A45',
              border: '2px solid #00ED8A',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              flexShrink: 0,
            }}>
              <img
                src="/images/ss-logo.png"
                alt="Strategy Sequence"
                style={{ width: '38px', height: '38px', objectFit: 'contain' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  const parent = (e.target as HTMLImageElement).parentElement;
                  if (parent) parent.innerHTML = '<span style="color:#00ED8A;font-weight:700;font-size:16px;">SS</span>';
                }}
              />
            </div>
            <div>
              <div style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '20px',
                fontWeight: 700,
                color: '#F2F4F3',
                letterSpacing: '0.5px',
                lineHeight: 1.1,
              }}>GTHL Rules Assistant</div>
              <div style={{
                fontSize: '10px',
                color: '#00ED8A',
                fontWeight: 600,
                letterSpacing: '1.5px',
                textTransform: 'uppercase' as const,
              }}>Strategy Sequence</div>
            </div>
          </div>
          <div style={{
            background: 'rgba(0,237,138,0.12)',
            border: '1px solid rgba(0,237,138,0.35)',
            color: '#00ED8A',
            fontSize: '10px',
            fontWeight: 600,
            padding: '5px 12px',
            borderRadius: '20px',
            letterSpacing: '0.5px',
            whiteSpace: 'nowrap' as const,
          }}>2025-26 Rulebook Live</div>
        </div>

        {/* COMMUNITY BANNER */}
        <div style={{
          background: 'rgba(255,184,48,0.1)',
          borderBottom: '1px solid rgba(255,184,48,0.25)',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
        }}>
          <div style={{
            width: '18px',
            height: '18px',
            background: '#FFB830',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 700,
            color: '#1E2A33',
            flexShrink: 0,
            marginTop: '1px',
          }}>!</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,184,48,0.9)', lineHeight: 1.5 }}>
            Free for the whole GTHL community. 5 questions per person, 400 per day total. Be thoughtful — every question counts for someone else.
          </div>
        </div>

        {/* COUNTERS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          padding: '16px 20px',
        }}>
          <div style={{
            background: '#2C3A45',
            border: '1px solid #3D4F5C',
            borderRadius: '12px',
            padding: '12px 14px',
          }}>
            <div style={{
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '1px',
              textTransform: 'uppercase' as const,
              color: 'rgba(242,244,243,0.5)',
              marginBottom: '8px',
            }}>Your questions today</div>
            <div style={{ display: 'flex', gap: '5px', marginBottom: '6px' }}>
              {Array.from({ length: DEVICE_DAILY_LIMIT }).map((_, i) => (
                <div key={i} style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: i < deviceRemaining ? '#00ED8A' : '#3D4F5C',
                }} />
              ))}
            </div>
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: '22px',
              fontWeight: 700,
              color: deviceRemaining === 0 ? '#E84040' : '#F2F4F3',
            }}>
              {deviceRemaining} <span style={{ fontSize: '13px', fontWeight: 400, color: 'rgba(242,244,243,0.5)' }}>of {DEVICE_DAILY_LIMIT} left</span>
            </div>
          </div>

          <div style={{
            background: '#2C3A45',
            border: '1px solid #3D4F5C',
            borderRadius: '12px',
            padding: '12px 14px',
          }}>
            <div style={{
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '1px',
              textTransform: 'uppercase' as const,
              color: 'rgba(242,244,243,0.5)',
              marginBottom: '8px',
            }}>Community questions today</div>
            <div style={{
              height: '6px',
              background: '#3D4F5C',
              borderRadius: '3px',
              marginBottom: '6px',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                background: communityLow ? '#FFB830' : '#00ED8A',
                borderRadius: '3px',
                width: `${communityPercent}%`,
              }} />
            </div>
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: '22px',
              fontWeight: 700,
              color: communityLow ? '#FFB830' : '#F2F4F3',
            }}>
              {communityRemaining} <span style={{ fontSize: '13px', fontWeight: 400, color: 'rgba(242,244,243,0.5)' }}>of {COMMUNITY_DAILY_LIMIT} left</span>
            </div>
          </div>
        </div>

        {/* HERO */}
        <div style={{ padding: '4px 20px 16px', textAlign: 'center' as const }}>
          <h2 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: '32px',
            fontWeight: 700,
            color: '#F2F4F3',
            lineHeight: 1.1,
            marginBottom: '6px',
          }}>
            What&apos;s your <span style={{ color: '#00ED8A' }}>question?</span>
          </h2>
          <p style={{ fontSize: '13px', color: 'rgba(242,244,243,0.5)', maxWidth: '380px', margin: '0 auto' }}>
            Ask anything about GTHL or Hockey Canada rules. Answered straight from the official rulebook.
          </p>
        </div>

        {/* INPUT */}
        <div style={{ padding: '0 20px 14px' }}>
          <div style={{
            background: '#2C3A45',
            border: `1.5px solid ${question ? '#00ED8A' : '#3D4F5C'}`,
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 8px 8px 16px',
          }}>
            <input
              type="text"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && askQuestion(question)}
              placeholder="Ask about a GTHL rule..."
              disabled={loading || deviceRemaining === 0}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontFamily: "'Barlow', sans-serif",
                fontSize: '14px',
                color: '#F2F4F3',
              }}
            />
            <button
              onClick={handleVoice}
              disabled={loading || deviceRemaining === 0}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                border: 'none',
                background: isRecording ? '#E84040' : '#3D4F5C',
                color: '#F2F4F3',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
            </button>
            <button
              onClick={() => askQuestion(question)}
              disabled={loading || !question.trim() || deviceRemaining === 0}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                border: 'none',
                background: loading || !question.trim() || deviceRemaining === 0 ? '#3D4F5C' : '#00ED8A',
                color: '#1E2A33',
                cursor: loading || !question.trim() || deviceRemaining === 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>

          {error && (
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#E84040', padding: '0 4px' }}>
              {error}
            </div>
          )}
        </div>

        {/* SAMPLE CHIPS */}
        {!answer && !loading && (
          <div style={{ padding: '0 20px 16px', display: 'flex', flexWrap: 'wrap' as const, gap: '6px' }}>
            {SAMPLE_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => { setQuestion(q); askQuestion(q); }}
                disabled={deviceRemaining === 0}
                style={{
                  background: '#2C3A45',
                  border: '1px solid #3D4F5C',
                  color: 'rgba(242,244,243,0.7)',
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: '11px',
                  fontWeight: 500,
                  padding: '6px 12px',
                  borderRadius: '20px',
                  cursor: deviceRemaining === 0 ? 'not-allowed' : 'pointer',
                  whiteSpace: 'nowrap' as const,
                }}
              >{q}</button>
            ))}
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div style={{ padding: '0 20px 16px' }}>
            <div style={{
              background: '#2C3A45',
              border: '1px solid #3D4F5C',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              gap: '6px',
              alignItems: 'center',
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#00ED8A',
                  opacity: 0.6,
                }} />
              ))}
              <span style={{ fontSize: '12px', color: 'rgba(242,244,243,0.5)', marginLeft: '4px' }}>
                Looking up the rulebook...
              </span>
            </div>
          </div>
        )}

        {/* ANSWER */}
        {answer && !loading && (
          <div ref={answerRef} style={{ padding: '0 20px 16px' }}>
            <div style={{
              background: '#2C3A45',
              border: '1px solid #3D4F5C',
              borderRadius: '12px',
              padding: '18px',
            }}>
              <div style={{
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '1.5px',
                textTransform: 'uppercase' as const,
                color: '#00ED8A',
                marginBottom: '10px',
              }}>Rulebook Answer</div>

              <div style={{
                fontSize: '14px',
                color: '#F2F4F3',
                lineHeight: 1.7,
                marginBottom: '14px',
                whiteSpace: 'pre-wrap' as const,
              }}>{answer.text}</div>

              {!answer.submitted ? (
                <>
                  <div style={{
                    borderTop: '1px solid #3D4F5C',
                    paddingTop: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    flexWrap: 'wrap' as const,
                  }}>
                    <span style={{ fontSize: '11px', color: 'rgba(242,244,243,0.4)', flex: 1 }}>Was this helpful?</span>
                    <button onClick={() => submitFeedback(true)} style={{
                      background: answer.feedback === 'up' ? 'rgba(0,237,138,0.2)' : '#3D4F5C',
                      border: `1px solid ${answer.feedback === 'up' ? '#00ED8A' : '#4E6270'}`,
                      borderRadius: '8px',
                      color: answer.feedback === 'up' ? '#00ED8A' : '#F2F4F3',
                      fontSize: '12px', padding: '5px 12px', cursor: 'pointer',
                    }}>👍 Yes</button>
                    <button onClick={() => submitFeedback(false)} style={{
                      background: answer.feedback === 'down' ? 'rgba(232,64,64,0.15)' : '#3D4F5C',
                      border: `1px solid ${answer.feedback === 'down' ? '#E84040' : '#4E6270'}`,
                      borderRadius: '8px',
                      color: answer.feedback === 'down' ? '#E84040' : '#F2F4F3',
                      fontSize: '12px', padding: '5px 12px', cursor: 'pointer',
                    }}>👎 No</button>
                  </div>

                  {answer.showComment && (
                    <div style={{ marginTop: '10px' }}>
                      <textarea
                        value={answer.comment}
                        onChange={e => setAnswer(prev => prev ? { ...prev, comment: e.target.value } : null)}
                        placeholder="What was wrong or missing? (optional)"
                        rows={2}
                        style={{
                          width: '100%',
                          background: '#1E2A33',
                          border: '1px solid #3D4F5C',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          fontFamily: "'Barlow', sans-serif",
                          fontSize: '13px',
                          color: '#F2F4F3',
                          resize: 'none' as const,
                          outline: 'none',
                          marginBottom: '8px',
                        }}
                      />
                      <button onClick={submitComment} style={{
                        background: '#00ED8A',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#1E2A33',
                        fontSize: '12px',
                        fontWeight: 600,
                        padding: '6px 16px',
                        cursor: 'pointer',
                      }}>Send feedback</button>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ borderTop: '1px solid #3D4F5C', paddingTop: '12px', fontSize: '12px', color: '#00ED8A' }}>
                  Thanks for your feedback — it helps improve the tool!
                </div>
              )}
            </div>

            {deviceRemaining > 0 && (
              <button
                onClick={() => { setAnswer(null); setQuestion(''); }}
                style={{
                  marginTop: '10px',
                  background: 'transparent',
                  border: '1px solid #3D4F5C',
                  borderRadius: '8px',
                  color: 'rgba(242,244,243,0.5)',
                  fontSize: '12px',
                  padding: '6px 14px',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                Ask another question ({deviceRemaining} remaining today)
              </button>
            )}
          </div>
        )}

        {/* FOOTER */}
        <div style={{
          background: '#0A1828',
          borderTop: '1px solid #3D4F5C',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap' as const,
          gap: '6px',
        }}>
          <div style={{ fontSize: '10px', color: 'rgba(242,244,243,0.3)' }}>
            GTHL 2025-26 · Hockey Canada Casebook · Resets midnight EST
          </div>
          <div style={{ fontSize: '10px', color: 'rgba(242,244,243,0.3)' }}>
            Powered by <span style={{ color: '#00ED8A' }}>Strategy Sequence</span>
          </div>
        </div>
      </div>
    </>
  );
}

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

interface AnswerState {
  text: string;
  question: string;
  feedback: 'none' | 'up' | 'down';
  showComment: boolean;
  comment: string;
  submitted: boolean;
  feedbackAnimating: boolean;
}

export default function GTHLAssistant() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<AnswerState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deviceRemaining, setDeviceRemaining] = useState(DEVICE_DAILY_LIMIT);
  const [communityRemaining, setCommunityRemaining] = useState(COMMUNITY_DAILY_LIMIT);
  const [isRecording, setIsRecording] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const recognitionRef = useRef<any>(null);
  const answerRef = useRef<HTMLDivElement>(null);
  const isSubmittingRef = useRef(false);

  const askQuestion = useCallback(async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    if (isSubmittingRef.current) return;
    if (blocked) {
      setError("You've used your 5 free questions today. Come back tomorrow at midnight EST!");
      return;
    }

    isSubmittingRef.current = true;
    setError('');
    setLoading(true);
    setAnswer(null);
    setQuestion(trimmed);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: trimmed }),
      });

      const data = await res.json();

      // Server says IP is at limit
      if (res.status === 429) {
        if (data.error === 'COMMUNITY_LIMIT') {
          setError("Today's 400 community questions have all been used. Come back tomorrow at midnight EST!");
        } else {
          setBlocked(true);
          setDeviceRemaining(0);
          setError("You've used your 5 free questions today. Come back tomorrow at midnight EST!");
        }
        return;
      }

      if (!res.ok || data.error) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      // Update counters from server response
      const newDeviceRemaining = data.remainingDevice ?? deviceRemaining - 1;
      const newCommunityRemaining = data.remainingCommunity ?? communityRemaining - 1;
      setDeviceRemaining(Math.max(0, newDeviceRemaining));
      setCommunityRemaining(Math.max(0, newCommunityRemaining));

      if (newDeviceRemaining <= 0) {
        setBlocked(true);
      }

      setAnswer({
        text: data.answer,
        question: trimmed,
        feedback: 'none',
        showComment: false,
        comment: '',
        submitted: false,
        feedbackAnimating: false,
      });

      setTimeout(() => {
        answerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch {
      setError('Connection error. Please check your connection and try again.');
    } finally {
      setLoading(false);
      isSubmittingRef.current = false;
    }
  }, [blocked, deviceRemaining, communityRemaining]);

  const handleVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setError('Voice input is not supported in this browser. Please try Chrome or Safari.');
      return;
    }
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }
    const recognition = new SR();
    recognitionRef.current = recognition;
    recognition.lang = 'en-CA';
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setQuestion(transcript);
    };
    recognition.onerror = () => {
      setError('Could not transcribe audio. Please try again or type your question.');
      setIsRecording(false);
    };
    recognition.onend = () => setIsRecording(false);
    recognition.start();
  };

  const submitFeedback = async (helpful: boolean) => {
    if (!answer || answer.feedback !== 'none') return;

    setAnswer(prev => prev ? {
      ...prev,
      feedback: helpful ? 'up' : 'down',
      showComment: !helpful,
      feedbackAnimating: true,
    } : null);

    setTimeout(() => {
      setAnswer(prev => prev ? { ...prev, feedbackAnimating: false } : null);
    }, 600);

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
              width: '44px', height: '44px', background: '#2C3A45',
              border: '2px solid #00ED8A', borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', flexShrink: 0,
            }}>
              <img src="/images/ss-logo.png" alt="Strategy Sequence"
                style={{ width: '38px', height: '38px', objectFit: 'contain' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  const parent = (e.target as HTMLImageElement).parentElement;
                  if (parent) parent.innerHTML = '<span style="color:#00ED8A;font-weight:700;font-size:16px;">SS</span>';
                }}
              />
            </div>
            <div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '20px', fontWeight: 700, color: '#F2F4F3', letterSpacing: '0.5px', lineHeight: 1.1 }}>GTHL Rules Assistant</div>
              <div style={{ fontSize: '10px', color: '#00ED8A', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase' as const }}>Strategy Sequence</div>
            </div>
          </div>
          <div style={{ background: 'rgba(0,237,138,0.12)', border: '1px solid rgba(0,237,138,0.35)', color: '#00ED8A', fontSize: '10px', fontWeight: 600, padding: '5px 12px', borderRadius: '20px', letterSpacing: '0.5px', whiteSpace: 'nowrap' as const }}>2025-26 Rulebook Live</div>
        </div>

        {/* COMMUNITY BANNER */}
        <div style={{ background: 'rgba(255,184,48,0.1)', borderBottom: '1px solid rgba(255,184,48,0.25)', padding: '10px 20px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <div style={{ width: '18px', height: '18px', background: '#FFB830', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#1E2A33', flexShrink: 0, marginTop: '1px' }}>!</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,184,48,0.9)', lineHeight: 1.5 }}>
            Free for the whole GTHL community. 5 questions per person, 400 per day total. Be thoughtful — every question counts for someone else.
          </div>
        </div>

        {/* COUNTERS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '16px 20px' }}>
          <div style={{ background: '#2C3A45', border: '1px solid #3D4F5C', borderRadius: '12px', padding: '12px 14px' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' as const, color: 'rgba(242,244,243,0.5)', marginBottom: '8px' }}>Your questions today</div>
            <div style={{ display: 'flex', gap: '5px', marginBottom: '6px' }}>
              {Array.from({ length: DEVICE_DAILY_LIMIT }).map((_, i) => (
                <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: i < deviceRemaining ? '#00ED8A' : '#3D4F5C' }} />
              ))}
            </div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '22px', fontWeight: 700, color: deviceRemaining === 0 ? '#E84040' : '#F2F4F3' }}>
              {deviceRemaining} <span style={{ fontSize: '13px', fontWeight: 400, color: 'rgba(242,244,243,0.5)' }}>of {DEVICE_DAILY_LIMIT} left</span>
            </div>
          </div>
          <div style={{ background: '#2C3A45', border: '1px solid #3D4F5C', borderRadius: '12px', padding: '12px 14px' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' as const, color: 'rgba(242,244,243,0.5)', marginBottom: '8px' }}>Community questions today</div>
            <div style={{ height: '6px', background: '#3D4F5C', borderRadius: '3px', marginBottom: '6px', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: communityLow ? '#FFB830' : '#00ED8A', borderRadius: '3px', width: `${communityPercent}%` }} />
            </div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '22px', fontWeight: 700, color: communityLow ? '#FFB830' : '#F2F4F3' }}>
              {communityRemaining} <span style={{ fontSize: '13px', fontWeight: 400, color: 'rgba(242,244,243,0.5)' }}>of {COMMUNITY_DAILY_LIMIT} left</span>
            </div>
          </div>
        </div>

        {/* HERO */}
        <div style={{ padding: '4px 20px 16px', textAlign: 'center' as const }}>
          <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '32px', fontWeight: 700, color: '#F2F4F3', lineHeight: 1.1, marginBottom: '6px' }}>
            What&apos;s your <span style={{ color: '#00ED8A' }}>question?</span>
          </h2>
          <p style={{ fontSize: '13px', color: 'rgba(242,244,243,0.5)', maxWidth: '380px', margin: '0 auto' }}>
            Ask anything about GTHL or Hockey Canada rules. Answered straight from the official rulebook.
          </p>
        </div>

        {/* BLOCKED STATE */}
        {blocked && (
          <div style={{ padding: '0 20px 20px' }}>
            <div style={{ background: 'rgba(232,64,64,0.1)', border: '1px solid rgba(232,64,64,0.3)', borderRadius: '12px', padding: '20px', textAlign: 'center' as const }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏒</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#E84040', marginBottom: '8px' }}>You've used your 5 questions today</div>
              <div style={{ fontSize: '13px', color: 'rgba(242,244,243,0.6)', lineHeight: 1.6 }}>
                Come back tomorrow at midnight EST for 5 more free questions. Thanks for using the GTHL Rules Assistant!
              </div>
            </div>
          </div>
        )}

        {/* INPUT */}
        {!blocked && (
          <div style={{ padding: '0 20px 14px' }}>
            <div style={{ background: '#2C3A45', border: `1.5px solid ${isRecording ? '#E84040' : question ? '#00ED8A' : '#3D4F5C'}`, borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 8px 8px 16px' }}>
              <input
                type="text" value={question}
                onChange={e => setQuestion(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && askQuestion(question)}
                placeholder={isRecording ? 'Listening… tap mic again to stop' : 'Ask about a GTHL rule...'}
                disabled={loading}
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: "'Barlow', sans-serif", fontSize: '14px', color: '#F2F4F3' }}
              />
              <button onClick={handleVoice} disabled={loading}
                title={isRecording ? 'Tap to stop recording' : 'Tap to speak your question'}
                style={{ width: '36px', height: '36px', borderRadius: '8px', border: isRecording ? '2px solid #E84040' : 'none', background: isRecording ? 'rgba(232,64,64,0.2)' : '#3D4F5C', color: isRecording ? '#E84040' : '#F2F4F3', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, animation: isRecording ? 'micPulse 1s ease-in-out infinite' : 'none' }}>
                {isRecording ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                    <line x1="12" y1="19" x2="12" y2="23"/>
                    <line x1="8" y1="23" x2="16" y2="23"/>
                  </svg>
                )}
              </button>
              <button onClick={() => askQuestion(question)} disabled={loading || !question.trim()}
                style={{ width: '36px', height: '36px', borderRadius: '8px', border: 'none', background: loading || !question.trim() ? '#3D4F5C' : '#00ED8A', color: '#1E2A33', cursor: loading || !question.trim() ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
            {isRecording && (
              <div style={{ marginTop: '6px', fontSize: '11px', color: '#E84040', padding: '0 4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#E84040', animation: 'micPulse 1s ease-in-out infinite' }} />
                Recording… tap the mic to stop, then tap Send
              </div>
            )}
            {error && <div style={{ marginTop: '8px', fontSize: '12px', color: '#E84040', padding: '0 4px' }}>{error}</div>}
          </div>
        )}

        {/* SAMPLE CHIPS */}
        {!answer && !loading && !blocked && (
          <div style={{ padding: '0 20px 16px', display: 'flex', flexWrap: 'wrap' as const, gap: '6px' }}>
            {SAMPLE_QUESTIONS.map((q) => (
              <button key={q} onClick={() => { setQuestion(q); askQuestion(q); }}
                style={{ background: '#2C3A45', border: '1px solid #3D4F5C', color: 'rgba(242,244,243,0.7)', fontFamily: "'Barlow', sans-serif", fontSize: '11px', fontWeight: 500, padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', whiteSpace: 'nowrap' as const }}>
                {q}
              </button>
            ))}
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div style={{ padding: '0 20px 16px' }}>
            <div style={{ background: '#2C3A45', border: '1px solid #3D4F5C', borderRadius: '12px', padding: '20px', display: 'flex', gap: '6px', alignItems: 'center' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ED8A', opacity: 0.6, animation: `loadingPulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
              ))}
              <span style={{ fontSize: '12px', color: 'rgba(242,244,243,0.5)', marginLeft: '4px' }}>Looking up the rulebook...</span>
            </div>
          </div>
        )}

        {/* ANSWER */}
        {answer && !loading && (
          <div ref={answerRef} style={{ padding: '0 20px 16px' }}>
            <div style={{ background: '#2C3A45', border: '1px solid #3D4F5C', borderRadius: '12px', padding: '18px' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: '#00ED8A', marginBottom: '10px' }}>Rulebook Answer</div>
              <div style={{ fontSize: '14px', color: '#F2F4F3', lineHeight: 1.7, marginBottom: '14px', whiteSpace: 'pre-wrap' as const }}>{answer.text}</div>

              {!answer.submitted ? (
                <div style={{ borderTop: '1px solid #3D4F5C', paddingTop: '14px' }}>
                  <div style={{ fontSize: '12px', color: 'rgba(242,244,243,0.6)', marginBottom: '10px', lineHeight: 1.5 }}>
                    Was this helpful? Your feedback helps us build a better tool for every hockey family across the GTHL.
                  </div>

                  {answer.feedback === 'none' && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => submitFeedback(true)}
                        style={{ flex: 1, background: '#3D4F5C', border: '1px solid #4E6270', borderRadius: '8px', color: '#F2F4F3', fontSize: '13px', fontWeight: 600, padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        👍 Yes, helpful
                      </button>
                      <button onClick={() => submitFeedback(false)}
                        style={{ flex: 1, background: '#3D4F5C', border: '1px solid #4E6270', borderRadius: '8px', color: '#F2F4F3', fontSize: '13px', fontWeight: 600, padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        👎 Not quite
                      </button>
                    </div>
                  )}

                  {answer.feedback === 'up' && (
                    <div style={{ background: 'rgba(0,237,138,0.1)', border: '1px solid rgba(0,237,138,0.3)', borderRadius: '10px', padding: '12px 16px', animation: answer.feedbackAnimating ? 'feedbackPop 0.6s ease' : 'none' }}>
                      <div style={{ fontSize: '20px', marginBottom: '4px' }}>👍</div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#00ED8A', marginBottom: '4px' }}>Thanks for the feedback!</div>
                      <div style={{ fontSize: '12px', color: 'rgba(242,244,243,0.6)', lineHeight: 1.5 }}>
                        Every vote helps us build a better rules tool for hockey families across the GTHL. You're making the community stronger.
                      </div>
                    </div>
                  )}

                  {answer.feedback === 'down' && answer.showComment && (
                    <div style={{ background: 'rgba(232,64,64,0.08)', border: '1px solid rgba(232,64,64,0.25)', borderRadius: '10px', padding: '12px 16px', animation: answer.feedbackAnimating ? 'feedbackPop 0.6s ease' : 'none' }}>
                      <div style={{ fontSize: '20px', marginBottom: '4px' }}>👎</div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#E84040', marginBottom: '4px' }}>Sorry we missed the mark.</div>
                      <div style={{ fontSize: '12px', color: 'rgba(242,244,243,0.6)', lineHeight: 1.5, marginBottom: '10px' }}>
                        Tell us what was wrong or missing — we read every single response and use it to improve the rulebook for the whole community.
                      </div>
                      <textarea
                        value={answer.comment}
                        onChange={e => setAnswer(prev => prev ? { ...prev, comment: e.target.value } : null)}
                        placeholder="What was wrong or missing? (optional)"
                        rows={2}
                        style={{ width: '100%', background: '#1E2A33', border: '1px solid #3D4F5C', borderRadius: '8px', padding: '8px 12px', fontFamily: "'Barlow', sans-serif", fontSize: '13px', color: '#F2F4F3', resize: 'none' as const, outline: 'none', marginBottom: '8px', boxSizing: 'border-box' as const }}
                      />
                      <button onClick={submitComment}
                        style={{ background: '#00ED8A', border: 'none', borderRadius: '8px', color: '#1E2A33', fontSize: '12px', fontWeight: 600, padding: '7px 18px', cursor: 'pointer' }}>
                        Send feedback
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ borderTop: '1px solid #3D4F5C', paddingTop: '12px', background: 'rgba(0,237,138,0.08)', borderRadius: '8px', padding: '12px', marginTop: '2px' }}>
                  <div style={{ fontSize: '16px', marginBottom: '4px' }}>✅</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#00ED8A', marginBottom: '4px' }}>Your feedback has been sent to our team.</div>
                  <div style={{ fontSize: '12px', color: 'rgba(242,244,243,0.6)', lineHeight: 1.5 }}>
                    Thank you for helping improve the GTHL community rules tool. We read every response.
                  </div>
                </div>
              )}
            </div>

            {deviceRemaining > 0 && (
              <button onClick={() => { setAnswer(null); setQuestion(''); }}
                style={{ marginTop: '10px', background: 'transparent', border: '1px solid #3D4F5C', borderRadius: '8px', color: 'rgba(242,244,243,0.5)', fontSize: '12px', padding: '6px 14px', cursor: 'pointer', width: '100%' }}>
                Ask another question ({deviceRemaining} remaining today)
              </button>
            )}
          </div>
        )}

        {/* FOOTER */}
        <div style={{ background: '#0A1828', borderTop: '1px solid #3D4F5C', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: '6px' }}>
          <div style={{ fontSize: '10px', color: 'rgba(242,244,243,0.3)' }}>GTHL 2025-26 · Hockey Canada Casebook · Resets midnight EST</div>
          <div style={{ fontSize: '10px', color: 'rgba(242,244,243,0.3)' }}>Powered by <span style={{ color: '#00ED8A' }}>Strategy Sequence</span></div>
        </div>
      </div>

      <style>{`
        @keyframes micPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes loadingPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes feedbackPop {
          0% { transform: scale(0.95); opacity: 0; }
          60% { transform: scale(1.02); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}

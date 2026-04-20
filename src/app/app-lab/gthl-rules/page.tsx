'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import GTHLAssistant from '../../../components/GTHLAssistant'
import Nav from '../../../components/Nav'

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return { ref, inView }
}

const sections = [
  {
    label: 'The Challenge',
    step: 'S',
    headline: 'The Information Barrier.',
    body: 'Youth hockey regulations are buried in dense, intense PDFs. In the heat of a game, associations, coaches, officials, and parents need instant answers, not hours of reading.',
    accent: '#E84040',
    number: '01',
  },
  {
    label: 'The Strategic Fix',
    step: 'T',
    headline: 'Architectural Clarity.',
    body: 'I stripped away the friction. By rethinking the information architecture and leveraging AI-ready logic, I transformed a static document into a mobile-first "rink-side" companion. The goal was to make the rules as fast as the game itself.',
    accent: '#FFB830',
    number: '02',
  },
  {
    label: 'The Result',
    step: 'E',
    headline: 'Rules at the Speed of the Game.',
    body: 'No barriers, no logins. Just the right answer, right now — built for everyone on the ice and in the stands.',
    accent: '#00ED8A',
    number: '03',
  },
]

export default function GTHLCaseStudyPage() {
  const hero = useInView(0.1)
  const story = useInView(0.1)
  const app = useInView(0.1)

  return (
    <main className="min-h-screen bg-white">
       <Nav />

      {/* BACK LINK */}
      <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '112px 24px 0' }}>
        <Link
          href="/app-lab"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#4E6270',
            textDecoration: 'none',
            letterSpacing: '0.5px',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M13 7H1M1 7L7 1M1 7L7 13" stroke="#4E6270" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to App Lab
        </Link>
      </div>

      {/* HERO */}
      <section style={{ padding: '48px 24px 80px', maxWidth: '1152px', margin: '0 auto', minHeight: '90vh', display: 'flex', flexDirection: 'column' as const, justifyContent: 'center' }}>
        <div
          ref={hero.ref}
          style={{
            opacity: hero.inView ? 1 : 0,
            transform: hero.inView ? 'translateY(0)' : 'translateY(32px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          {/* Tag */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(0,237,138,0.1)',
            border: '1px solid rgba(0,237,138,0.35)',
            borderRadius: '20px',
            padding: '6px 16px',
            marginBottom: '28px',
          }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#00ED8A' }} />
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#00ED8A', letterSpacing: '1.5px', textTransform: 'uppercase' as const }}>
              Live · GTHL Rules Assistant
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(40px, 6vw, 72px)',
            fontWeight: 700,
            color: '#1E2A33',
            lineHeight: 1.05,
            letterSpacing: '-1px',
            marginBottom: '24px',
          }}>
            The Information<br />
            <span style={{ color: '#00ED8A' }}>Barrier, Solved.</span>
          </h1>

          <p style={{ fontSize: '18px', color: '#4E6270', maxWidth: '560px', lineHeight: 1.7, marginBottom: '48px' }}>
            100+ pages of GTHL and Hockey Canada regulations, transformed into a rink-side AI companion that answers in seconds.
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' as const, marginBottom: '64px' }}>
            {[
              { value: '100+', label: 'Pages distilled' },
              { value: '< 2s', label: 'Average answer time' },
              { value: 'Free', label: 'No login required' },
            ].map(stat => (
              <div key={stat.label}>
                <div style={{ fontSize: '32px', fontWeight: 700, color: '#1E2A33', lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontSize: '12px', color: '#4E6270', marginTop: '6px', fontWeight: 500 }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* SCROLL INDICATOR — animated puck drop with text */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ position: 'relative' as const, width: '28px', height: '80px', flexShrink: 0 }}>
              {/* Track */}
              <div style={{
                position: 'absolute' as const,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '2px',
                height: '100%',
                background: '#E5E7EB',
                borderRadius: '1px',
              }} />
              {/* Animated puck */}
              <div style={{
                position: 'absolute' as const,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '16px',
                height: '6px',
                background: '#00ED8A',
                borderRadius: '3px',
                animation: 'puckDrop 2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
              }} />
            </div>
            {/* Text that fades in and out with the puck */}
            <div style={{ animation: 'textPulse 2s ease-in-out infinite' }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#1E2A33',
                marginBottom: '3px',
                letterSpacing: '-0.2px',
              }}>Scroll down</div>
              <div style={{
                fontSize: '11px',
                color: '#4E6270',
                letterSpacing: '1.2px',
                textTransform: 'uppercase' as const,
                fontWeight: 500,
              }}>The logic behind it</div>
            </div>
          </div>
        </div>
      </section>

      {/* HORIZONTAL DIVIDER */}
      <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ height: '1px', background: '#E5E7EB' }} />
      </div>

      {/* STORY SECTIONS */}
      <section style={{ padding: '80px 24px 80px', maxWidth: '1152px', margin: '0 auto' }}>
        <div ref={story.ref}>
          <p style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '2px',
            textTransform: 'uppercase' as const,
            color: '#4E6270',
            marginBottom: '64px',
          }}>The Logic Behind It</p>

          {/* Sections with vertical line */}
          <div style={{ position: 'relative' as const, paddingLeft: '0' }}>

            {/* Vertical line — 20px = center of 40px dot in 48px column */}
            <div style={{
              position: 'absolute' as const,
              left: '20px',
              top: '44px',
              height: 'calc(100% - 44px)',
              width: '2px',
              background: '#E5E7EB',
              borderRadius: '1px',
              zIndex: 0,
            }} />

            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0' }}>
              {sections.map((section, i) => (
                <div
                  key={section.number}
                  style={{
                    opacity: story.inView ? 1 : 0,
                    transform: story.inView ? 'translateY(0)' : 'translateY(24px)',
                    transition: `opacity 0.7s ease ${i * 0.25}s, transform 0.7s ease ${i * 0.25}s`,
                    display: 'grid',
                    gridTemplateColumns: '48px 1fr',
                    gap: '32px',
                    paddingBottom: i < sections.length - 1 ? '72px' : '0',
                    alignItems: 'start',
                  }}
                >
                  {/* Left — numbered dot centered on the line */}
                  <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '4px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: section.accent,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#fff',
                      flexShrink: 0,
                      zIndex: 1,
                      position: 'relative' as const,
                    }}>{section.number}</div>
                  </div>

                  {/* Right — content */}
                  <div style={{ paddingTop: '4px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '16px',
                    }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: section.accent,
                        letterSpacing: '1.5px',
                        textTransform: 'uppercase' as const,
                      }}>{section.label}</span>
                      <span style={{
                        fontSize: '11px',
                        color: '#D1D5DB',
                        fontWeight: 500,
                      }}>{section.number}</span>
                    </div>

                    <h3 style={{
                      fontSize: 'clamp(28px, 3.5vw, 42px)',
                      fontWeight: 700,
                      color: '#1E2A33',
                      marginBottom: '16px',
                      lineHeight: 1.1,
                      letterSpacing: '-0.5px',
                    }}>{section.headline}</h3>

                    <p style={{
                      fontSize: '17px',
                      color: '#4E6270',
                      lineHeight: 1.8,
                      maxWidth: '640px',
                    }}>{section.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HORIZONTAL DIVIDER */}
      <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ height: '1px', background: '#E5E7EB' }} />
      </div>

      {/* LIVE APP */}
      <section style={{ padding: '80px 24px 128px', maxWidth: '1152px', margin: '0 auto' }}>
        <div
          ref={app.ref}
          style={{
            opacity: app.inView ? 1 : 0,
            transform: app.inView ? 'translateY(0)' : 'translateY(32px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          <p style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '2px',
            textTransform: 'uppercase' as const,
            color: '#4E6270',
            marginBottom: '12px',
          }}>Try It Live</p>
          <h2 style={{
            fontSize: 'clamp(28px, 3vw, 40px)',
            fontWeight: 700,
            color: '#1E2A33',
            marginBottom: '40px',
            lineHeight: 1.2,
          }}>Ask the rulebook anything.</h2>

          <GTHLAssistant />
        </div>
      </section>

      <style>{`
        @keyframes puckDrop {
          0%   { top: 0px; opacity: 0; }
          10%  { opacity: 1; }
          75%  { top: calc(100% - 6px); opacity: 1; }
          90%  { top: calc(100% - 6px); opacity: 0; }
          100% { top: 0px; opacity: 0; }
        }
        @keyframes textPulse {
          0%, 100% { opacity: 0.5; transform: translateY(0px); }
          40%       { opacity: 1;   transform: translateY(3px); }
          75%       { opacity: 1;   transform: translateY(5px); }
          90%       { opacity: 0.5; transform: translateY(5px); }
        }
      `}</style>
    </main>
  )
}

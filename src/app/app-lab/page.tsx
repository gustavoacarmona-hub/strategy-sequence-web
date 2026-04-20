'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Nav from '../../components/Nav'

const apps = [
  {
    id: 'gthl-rules',
    status: 'live',
    tag: 'Live',
    title: 'GTHL Rules Assistant',
    description: '100+ pages of hockey regulations, distilled into a 2-second search.',
    cta: 'Curious about hockey rules? Ask here',
    href: '/app-lab/gthl-rules',
    accent: '#00ED8A',
    image: '/images/GTHLRules_Logo.jpg',
  },
  {
    id: 'loco-dad-stats',
    status: 'coming-soon',
    tag: 'Coming Soon',
    title: 'Loco Dad Stats',
    description: 'Community-driven data for the modern hockey parent.',
    cta: null,
    href: null,
    accent: '#FFB830',
    image: '/images/Locodadslogo.png',
  },
  {
    id: 'campus-pathmaker',
    status: 'coming-soon',
    tag: 'Coming Soon',
    title: 'Campus Pathmaker',
    description: 'Simplifying the university process for students and families navigating it for the first time.',
    cta: null,
    href: null,
    accent: '#4E6270',
    image: '/images/University_App_Logo.jpg',
  },
]

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

export default function AppLabPage() {
  const hero = useInView(0.1)
  const manifesto = useInView(0.1)
  const shelf = useInView(0.1)

  return (
    <main className="min-h-screen bg-white">
 <Nav />
      {/* HERO */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '96px 24px 80px',
        maxWidth: '1152px',
        margin: '0 auto',
      }}>
        <div
          ref={hero.ref}
          style={{
            opacity: hero.inView ? 1 : 0,
            transform: hero.inView ? 'translateY(0)' : 'translateY(32px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#f0fdf4',
            border: '1px solid #00ED8A',
            borderRadius: '20px',
            padding: '6px 16px',
            marginBottom: '32px',
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ED8A' }} />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#405163', letterSpacing: '1px', textTransform: 'uppercase' as const }}>
              App Lab
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(40px, 7vw, 80px)',
            fontWeight: 700,
            color: '#1E2A33',
            lineHeight: 1.05,
            letterSpacing: '-1px',
            marginBottom: '48px',
          }}>
            Where Strategy<br />
            Becomes a<br />
            <span style={{ color: '#00ED8A' }}>Simple Solution.</span>
          </h1>

          {/* Scroll indicator */}
          <div style={{
            display: 'flex',
            flexDirection: 'column' as const,
            alignItems: 'flex-start',
            gap: '8px',
          }}>
            <span style={{ fontSize: '12px', fontWeight: 500, color: '#4E6270', letterSpacing: '1px', textTransform: 'uppercase' as const }}>
              Scroll to explore
            </span>
            <div style={{
              width: '1px',
              height: '48px',
              background: 'linear-gradient(to bottom, #00ED8A, transparent)',
              animation: 'scrollPulse 2s ease-in-out infinite',
            }} />
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section style={{ padding: '0 24px 96px', maxWidth: '1152px', margin: '0 auto' }}>
        <div
          ref={manifesto.ref}
          style={{
            maxWidth: '680px',
            opacity: manifesto.inView ? 1 : 0,
            transform: manifesto.inView ? 'translateY(0)' : 'translateY(32px)',
            transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s',
          }}
        >
          <div style={{
            width: '40px',
            height: '3px',
            background: '#00ED8A',
            marginBottom: '28px',
            borderRadius: '2px',
          }} />
          <p style={{
            fontSize: '18px',
            color: '#405163',
            lineHeight: 1.8,
            marginBottom: '20px',
          }}>
            Most things are only complicated until someone explains them simply.
          </p>
          <p style={{
            fontSize: '16px',
            color: '#4E6270',
            lineHeight: 1.8,
            marginBottom: '20px',
          }}>
            My work in strategy is fueled by a deep curiosity for how things work, specifically within the worlds of Business, History, and Sports. I believe that community thrives when information is accessible, and my goal is to turn complex rules and processes into clear, usable insights.
          </p>
          <p style={{
            fontSize: '16px',
            color: '#4E6270',
            lineHeight: 1.8,
          }}>
            App Lab is my space for using AI to bridge the gap between static information and active solutions. I build these tools to ensure that the right answers are always easy to find for those who need them most.
          </p>
        </div>
      </section>

      {/* SHELF */}
      <section style={{ padding: '0 24px 128px', maxWidth: '1152px', margin: '0 auto' }}>
        <div
          ref={shelf.ref}
          style={{
            opacity: shelf.inView ? 1 : 0,
            transform: shelf.inView ? 'translateY(0)' : 'translateY(32px)',
            transition: 'opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s',
          }}
        >
          <p style={{
            fontSize: '16px',
            fontWeight: 600,
            letterSpacing: '2px',
            textTransform: 'uppercase' as const,
            color: '#4E6270',
            marginBottom: '40px',
          }}>The Lab — Active &amp; Upcoming</p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
          }}>
            {apps.map((app, i) => (
              <div
                key={app.id}
                style={{
                  opacity: shelf.inView ? 1 : 0,
                  transform: shelf.inView ? 'translateY(0)' : 'translateY(24px)',
                  transition: `opacity 0.6s ease ${0.4 + i * 0.15}s, transform 0.6s ease ${0.4 + i * 0.15}s`,
                }}
              >
                {app.href ? (
                  <Link href={app.href} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                    <AppCard app={app} />
                  </Link>
                ) : (
                  <AppCard app={app} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.4; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.1); }
        }
      `}</style>
    </main>
  )
}

function AppCard({ app }: { app: typeof apps[0] }) {
  const [hovered, setHovered] = useState(false)
  const isLive = app.status === 'live'

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered && isLive ? '#1E2A33' : '#F8F9FA',
        border: `1.5px solid ${hovered && isLive ? '#00ED8A' : '#E5E7EB'}`,
        borderRadius: '20px',
        overflow: 'hidden',
        cursor: isLive ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        height: '100%',
        display: 'flex',
        flexDirection: 'column' as const,
      }}
    >
      {/* Image */}
      <div style={{
        width: '100%',
        height: '280px',
        overflow: 'hidden',
        position: 'relative' as const,
        background: '#1E2A33',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Image
          src={app.image}
          alt={app.title}
          fill
          style={{
            objectFit: 'contain',
            objectPosition: 'center center',
            padding: '20px',
            transform: hovered && isLive ? 'scale(1.03)' : 'scale(1)',
            transition: 'transform 0.4s ease',
          }}
        />
      </div>

      {/* Content */}
      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' as const, justifyContent: 'space-between' }}>
        <div>
          {/* Tag */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: isLive ? 'rgba(0,237,138,0.12)' : 'rgba(78,98,112,0.1)',
            border: `1px solid ${isLive ? 'rgba(0,237,138,0.35)' : 'rgba(78,98,112,0.2)'}`,
            borderRadius: '20px',
            padding: '4px 12px',
            marginBottom: '16px',
          }}>
            {isLive && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00ED8A' }} />}
            <span style={{
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '1px',
              textTransform: 'uppercase' as const,
              color: isLive ? '#00ED8A' : '#4E6270',
            }}>{app.tag}</span>
          </div>

          <h3 style={{
            fontSize: '20px',
            fontWeight: 700,
            color: hovered && isLive ? '#F2F4F3' : '#1E2A33',
            lineHeight: 1.2,
            marginBottom: '10px',
            transition: 'color 0.3s ease',
          }}>{app.title}</h3>

          <p style={{
            fontSize: '14px',
            color: hovered && isLive ? 'rgba(242,244,243,0.7)' : '#4E6270',
            lineHeight: 1.6,
            transition: 'color 0.3s ease',
          }}>{app.description}</p>
        </div>

        {/* CTA */}
        {isLive && app.cta && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '20px',
            padding: '10px 16px',
            background: hovered ? '#00ED8A' : 'rgba(0,237,138,0.1)',
            border: '1px solid rgba(0,237,138,0.4)',
            borderRadius: '10px',
            transition: 'all 0.3s ease',
          }}>
            <span style={{
              fontSize: '13px',
              fontWeight: 600,
              color: hovered ? '#1E2A33' : '#00ED8A',
              transition: 'color 0.3s ease',
              flex: 1,
            }}>{app.cta}</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 7H13M13 7L7 1M13 7L7 13" stroke={hovered ? '#1E2A33' : '#00ED8A'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
      </div>
    </div>
  )
}

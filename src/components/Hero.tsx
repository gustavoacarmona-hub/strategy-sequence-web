'use client'

import { useState, useEffect, useRef } from 'react'

const rotatingPhrases = [
  'refreshing your brand',
  'launching your product',
  'building your story',
  'developing content',
]

function RotatingBlock({ currentIndex, visible }: { currentIndex: number; visible: boolean }) {
  return (
    <>
      <p className="text-[#405163]/40 text-xs font-bold tracking-[0.3em] uppercase mb-5">
        What we do
      </p>
      <p
        className="text-[#405163] font-medium leading-relaxed mb-7"
        style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)' }}
      >
        Ideas developed step by step, from strategy and design, to content
        and storytelling — so your brand can move forward with confidence,
        with fewer layers and less complexity.
      </p>
      <div className="flex items-center gap-4 border-l-4 border-[#1FFF9E] pl-5 mb-7 h-10 overflow-hidden">
        <p
          className={`text-[#405163] font-black italic transition-all duration-400 ${
            visible ? 'animate-fade-in-up' : 'animate-fade-out-up'
          }`}
          style={{ fontSize: 'clamp(1.1rem, 2vw, 1.45rem)' }}
        >
          {rotatingPhrases[currentIndex]}
        </p>
      </div>
      <div className="flex gap-2">
        {rotatingPhrases.map((_, i) => (
          <span
            key={i}
            className={`block rounded-full transition-all duration-300 ${
              i === currentIndex
                ? 'w-6 h-2 bg-[#1FFF9E]'
                : 'w-2 h-2 bg-[#405163]/20'
            }`}
          />
        ))}
      </div>
    </>
  )
}

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visible, setVisible] = useState(true)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const videoElRef = useRef<HTMLVideoElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY

      if (videoContainerRef.current && window.innerWidth >= 960) {
        videoContainerRef.current.style.transform = `translateY(${scrollY * 0.3}px)`
      }

      const video = videoElRef.current
      const section = sectionRef.current
      if (video && section && video.duration) {
        const sectionHeight = section.offsetHeight
        const progress = Math.min(Math.max((scrollY * 1.3) / sectionHeight, 0), 1)
        video.currentTime = progress * video.duration
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % rotatingPhrases.length)
        setVisible(true)
      }, 400)
    }, 1800)
    return () => clearInterval(interval)
  }, [])

  return (
    /*
      overflow-hidden on the section clips any parallax translateY that would
      otherwise cause the video to visually bleed into content below.

      flex-wrap: columns have basis-[480px]. Two columns need ~960px to sit
      side by side. Below that they wrap automatically — text never overlaps video.

      Stacked order (< 960px):  text (order-1) → video (order-2) → rotating (order-3)
      Side-by-side (≥ 960px):   video left | text + rotating right
    */
    <section ref={sectionRef} className="w-full bg-white overflow-hidden">
      <div className="flex flex-wrap min-[960px]:min-h-[85vh] min-[960px]:items-end">

        {/* ── LEFT: video ── */}
        <div
          ref={videoContainerRef}
          className="flex-1 basis-[480px] order-3 min-[960px]:order-none overflow-hidden flex items-end max-[959px]:flex-none max-[959px]:w-[75%] max-[959px]:mx-auto max-[959px]:aspect-[9/11]"
          style={{ willChange: 'transform' }}
        >
          <video
            ref={videoElRef}
            className="w-full h-auto block hero-video-mid"
            style={{ objectFit: 'contain', width: '81%', marginLeft: '43px' }}
            muted
            playsInline
            preload="auto"
          >
            <source src="/WebsiteVideoFinal.mp4" type="video/mp4" />
          </video>
        </div>

        {/* ── RIGHT: text block + rotating (rotating hidden when stacked) ── */}
        <div className="flex-1 basis-[480px] order-1 min-[960px]:order-none min-[960px]:self-start flex flex-col">
          <div className="flex flex-col justify-center px-8 pt-28 pb-10 min-[960px]:pt-36 min-[960px]:pb-16 min-[960px]:-ml-[50px]">
            <p
              className="text-[#1FFF9E] font-black uppercase tracking-[0.4em] mb-6 text-lg min-[960px]:text-2xl"
              style={{ WebkitTextStroke: '0.5px #00c97c' }}
            >
              Strategy Sequence
            </p>
            <h1
              className="font-black text-[#405163] leading-[1.05] mb-4"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.75rem)' }}
            >
              A clear path from where
              <br />
              you are to where you
              <br />
              want to be.
            </h1>
            <p
              className="text-[#405163]/65 font-medium leading-snug mb-8"
              style={{ fontSize: 'clamp(1rem, 1.8vw, 1.3rem)' }}
            >
              One experienced partner,
              <br className="max-[959px]:hidden" />
              {' '}from idea to execution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="mailto:strategysequence@gmail.com"
                className="inline-flex items-center justify-center bg-[#1FFF9E] text-[#405163] font-bold px-8 py-3.5 rounded-full text-sm hover:bg-[#00e88a] transition-colors duration-200 shadow-md"
              >
                Say Hello
              </a>
              <a
                href="#services"
                className="inline-flex items-center justify-center border-2 border-[#405163]/20 text-[#405163] font-semibold px-8 py-3.5 rounded-full text-sm hover:border-[#405163]/40 transition-colors duration-200"
              >
                See What We Do
              </a>
            </div>
          </div>

          {/* Rotating — side-by-side only (≥ 960px) */}
          <div className="max-[959px]:hidden flex flex-col justify-center px-8 py-16">
            <RotatingBlock currentIndex={currentIndex} visible={visible} />
          </div>
        </div>

        {/* ── STACKED-ONLY rotating — below video when < 960px ── */}
        <div className="min-[960px]:hidden order-2 w-full flex flex-col px-8 py-12 bg-[#f8f9fa]">
          <RotatingBlock currentIndex={currentIndex} visible={visible} />
        </div>

      </div>
    </section>
  )
}

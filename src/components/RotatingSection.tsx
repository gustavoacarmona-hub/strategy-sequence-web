'use client'

import { useState, useEffect } from 'react'

const rotatingPhrases = [
  'refreshing your brand',
  'launching your product',
  'building your story',
  'developing content',
]

export default function RotatingSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visible, setVisible] = useState(true)

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
    <section className="w-full bg-[#f8f9fa] py-0">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-stretch">

        {/* Left: video */}
        <div className="w-full lg:w-[45%] shrink-0">
          <video
            className="w-full h-full object-cover block"
            style={{ maxHeight: '620px' }}
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/WebsiteVideoFinal.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Right: rotating copy */}
        <div className="flex flex-col justify-center px-8 py-16 lg:py-20 lg:px-14">
          <p className="text-[#405163]/40 text-xs font-bold tracking-[0.3em] uppercase mb-6">
            What we do
          </p>

          <p
            className="text-[#405163] font-medium leading-relaxed mb-6"
            style={{ fontSize: 'clamp(1rem, 1.8vw, 1.25rem)' }}
          >
            Ideas developed step by step, from strategy and design, to content
            and storytelling, so your brand can move forward with confidence —
            with fewer layers and less complexity.
          </p>

          {/* Rotating phrase */}
          <div className="h-12 flex items-center overflow-hidden border-l-4 border-[#1FFF9E] pl-5 mb-8">
            <p
              className={`text-[#405163] font-black italic transition-all duration-400 ${
                visible ? 'animate-fade-in-up' : 'animate-fade-out-up'
              }`}
              style={{ fontSize: 'clamp(1.2rem, 2vw, 1.6rem)' }}
            >
              {rotatingPhrases[currentIndex]}
            </p>
          </div>

          {/* Indicator dots */}
          <div className="flex gap-2">
            {rotatingPhrases.map((_, i) => (
              <span
                key={i}
                className={`block w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex ? 'bg-[#1FFF9E] scale-125' : 'bg-[#405163]/20'
                }`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

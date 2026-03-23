'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'

const videos = [
  {
    id: 'G--Ho760sY4',
    title: 'The Question That Changes Everything',
    category: 'Intro',
    url: 'https://youtube.com/shorts/G--Ho760sY4',
  },
  {
    id: 'eC4s2JiFSVc',
    title: 'How Hoka Asked the Right Questions and Built a $1.8B Brand',
    category: 'Brand Strategy',
    url: 'https://youtu.be/eC4s2JiFSVc',
  },
  {
    id: '7ubbFFXQLyM',
    title: "Trader Joe's Secret Strategy: Less Is More and It's Working",
    category: 'Retail Strategy',
    url: 'https://youtu.be/7ubbFFXQLyM',
  },
  {
    id: 'ctW3CdrslYk',
    title: 'How to Set Goals That Actually Work (Life + Business)',
    category: 'Strategy',
    url: 'https://youtube.com/shorts/ctW3CdrslYk',
  },
]

export default function StrategySeries() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleCount, setVisibleCount] = useState(3)

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      setVisibleCount(w >= 1024 ? 3 : w >= 640 ? 2 : 1)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const maxIndex = Math.max(0, videos.length - visibleCount)

  // Clamp index when visible count changes (e.g. on resize)
  useEffect(() => {
    setCurrentIndex((i) => Math.min(i, maxIndex))
  }, [maxIndex])

  const cardWidthPct = 100 / visibleCount
  const translateX = -(currentIndex * cardWidthPct)

  const prev = () => setCurrentIndex((i) => Math.max(0, i - 1))
  const next = () => setCurrentIndex((i) => Math.min(maxIndex, i + 1))

  return (
    <section className="py-24 bg-[#405163]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#1FFF9E] text-xs font-bold tracking-[0.3em] uppercase mb-4">
            The Strategy Series
          </p>
          <h2
            className="font-black text-white leading-tight"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            Real stories. Right questions.
            <br />
            Remarkable results.
          </h2>
          <p className="text-white/50 text-base mt-4 max-w-lg mx-auto leading-relaxed">
            A video series exploring strategy through business, sports, history, and retail.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Arrow: left */}
          {maxIndex > 0 && (
            <button
              onClick={prev}
              disabled={currentIndex === 0}
              aria-label="Previous"
              className="absolute left-0 top-[40%] -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8L10 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}

          {/* Track */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(${translateX}%)` }}
            >
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="flex-none px-3"
                  style={{ width: `${cardWidthPct}%` }}
                >
                  <div
                    className="flex flex-col rounded-2xl overflow-hidden bg-[#32373c] w-full"
                    style={{ aspectRatio: '9/16' }}
                  >
                    {/* Thumbnail */}
                    <div className="relative flex-1 min-h-0">
                      <Image
                        src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                        alt={video.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    {/* Info */}
                    <div className="px-4 py-4 flex flex-col gap-3 bg-[#32373c]">
                      <span className="inline-block self-start text-[#1FFF9E] text-[10px] font-bold tracking-[0.2em] uppercase border border-[#1FFF9E]/30 rounded-full px-2.5 py-0.5">
                        {video.category}
                      </span>
                      <p className="text-white font-bold text-sm leading-snug line-clamp-3">
                        {video.title}
                      </p>
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-[#1FFF9E] text-[#405163] font-bold text-xs px-4 py-2 rounded-full hover:bg-[#00e88a] transition-colors duration-200"
                      >
                        Watch
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                          <path d="M3 8H13M13 8L8 3M13 8L8 13" stroke="#405163" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Arrow: right */}
          {maxIndex > 0 && (
            <button
              onClick={next}
              disabled={currentIndex === maxIndex}
              aria-label="Next"
              className="absolute right-0 top-[40%] -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 3L11 8L6 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>

        {/* Dots */}
        {maxIndex > 0 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'w-6 h-2 bg-[#1FFF9E]'
                    : 'w-2 h-2 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

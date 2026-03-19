'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'

const brands = [
  { name: 'BIC',           file: 'Bic Logo.svg' },
  { name: 'Canadian Tire', file: 'Canadian Tire Logo.svg' },
  { name: 'Costco',        file: 'Costco Logo.svg' },
  { name: 'Cuddy',         file: 'CuddyLogo.svg' },
  { name: 'Crispy',        file: 'Crispy Logo.svg' },
  { name: 'KitKat',        file: 'KitKat Logo.svg' },
  { name: 'Lilydale',      file: 'Lilydale Logo.svg' },
  { name: 'Loblaws',       file: 'Loblaws Logo.svg' },
  { name: 'Metro',         file: 'MetroLogo.svg' },
  { name: 'Nestlé',        file: 'NestleLogo.svg' },
  { name: 'PowerBar',      file: 'Powerbar logo.svg' },
  { name: 'Savoy',         file: 'Savoy Logo.svg' },
  { name: 'Sobeys',        file: 'SobeysLogo.svg' },
  { name: 'Walmart',       file: 'WalmartLogo.svg' },
]

const row1 = brands.slice(0, 7)
const row2 = brands.slice(7)

export default function LogoWall() {
  const row1Ref = useRef<HTMLDivElement>(null)
  const row2Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let lastScrollY = window.scrollY

    const onScroll = () => {
      const vw = window.innerWidth
      if (vw < 1024 || vw > 1673) return

      const currentScrollY = window.scrollY
      const scrollingDown = currentScrollY >= lastScrollY
      lastScrollY = currentScrollY

      if (row1Ref.current) {
        row1Ref.current.style.animationDirection = scrollingDown ? 'normal' : 'reverse'
      }
      if (row2Ref.current) {
        row2Ref.current.style.animationDirection = scrollingDown ? 'reverse' : 'normal'
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="py-20 bg-[#f8f9fa]">
      {/* Heading — all viewports */}
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-center text-[#405163] text-xs font-bold tracking-[0.3em] uppercase mb-12">
          Brands and Retailers I Have Worked With
        </p>
      </div>

      {/* Static grid — shown outside 1024–1673px */}
      <div className="logo-wall-grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-x-8 gap-y-10 max-w-6xl mx-auto px-6">
        {brands.map((brand) => (
          <div key={brand.name} className="flex items-center justify-center">
            <Image
              src={`/logos/${brand.file}`}
              alt={brand.name}
              width={120}
              height={48}
              className="w-full max-w-[120px] h-12 object-contain"
            />
          </div>
        ))}
      </div>

      {/* Animated marquee rows — shown only at 1024–1673px */}
      <div className="logo-wall-animated">
        {/* Row 1: scrolls left */}
        <div className="overflow-hidden mb-10">
          <div ref={row1Ref} className="logo-marquee-row logo-marquee-left">
            {[...row1, ...row1].map((brand, i) => (
              <div key={`r1-${i}`} className="flex items-center justify-center mx-10 shrink-0">
                <Image
                  src={`/logos/${brand.file}`}
                  alt={brand.name}
                  width={120}
                  height={48}
                  className="w-[120px] h-12 object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: scrolls right */}
        <div className="overflow-hidden">
          <div ref={row2Ref} className="logo-marquee-row logo-marquee-right">
            {[...row2, ...row2].map((brand, i) => (
              <div key={`r2-${i}`} className="flex items-center justify-center mx-10 shrink-0">
                <Image
                  src={`/logos/${brand.file}`}
                  alt={brand.name}
                  width={120}
                  height={48}
                  className="w-[120px] h-12 object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

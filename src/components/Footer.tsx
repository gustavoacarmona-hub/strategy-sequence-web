import Image from 'next/image'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#32373c] py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
          {/* Logo + tagline */}
          <div className="text-center md:text-left">
            <div className="flex justify-center md:justify-start mb-3">
              <Image
                src="/StatSeqLogo.svg"
                alt="Strategy Sequence"
                width={140}
                height={40}
                className="h-10 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-white/50 text-sm max-w-xs">
              A clear path from where you are to where you want to be.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col items-center md:items-end gap-4">
            <a
              href="mailto:strategysequence@gmail.com"
              className="flex items-center gap-2 text-white/80 hover:text-[#1FFF9E] transition-colors duration-200 text-sm"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M1 5L8 9L15 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              strategysequence@gmail.com
            </a>
            <a
              href="https://linkedin.com/in/carmonagus"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/80 hover:text-[#1FFF9E] transition-colors duration-200 text-sm"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M5 7V11M5 5V5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M8 11V8.5C8 7.67 8.67 7 9.5 7C10.33 7 11 7.67 11 8.5V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              LinkedIn
            </a>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 text-center">
          <p className="text-white/30 text-xs">
            &copy; {year} Strategy Sequence. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

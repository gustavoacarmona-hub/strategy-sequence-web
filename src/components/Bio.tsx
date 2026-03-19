export default function Bio() {
  return (
    <section className="pt-[200px] pb-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center bio-grid">
        {/* Left: label + headline */}
        <div>
          <p className="text-[#1FFF9E] text-xs font-bold tracking-[0.3em] uppercase mb-4"
             style={{ color: '#405163', opacity: 0.5 }}>
            About
          </p>
          <h2
            className="font-black leading-tight text-[#405163]"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
          >
            A unique mix of
            <br />
            <span className="text-[#1FFF9E]" style={{ WebkitTextStroke: '2px #405163' }}>
              experience
            </span>{' '}
            &amp;
            <br />
            craft.
          </h2>
        </div>

        {/* Right: bio copy */}
        <div className="space-y-5 text-[#405163]/80 text-lg leading-relaxed">
          <p>
            I started my career at Nestlé Venezuela in 2005, working in chocolate sales
            and marketing before relocating to Canada. Over the years I built deep
            expertise in consumer insights, brand positioning, and strategic planning —
            always with an eye on execution.
          </p>
          <p>
            Through close collaboration with creative agencies I developed a strong design
            sensibility, and hands-on copywriting and video skills that complement the
            strategic work. The result is a practice that can take a brand from brief to
            finished asset without losing the thread.
          </p>
          <p>
            With a unique mix of client-side experience and agency collaboration,
            I partner directly with founders, marketers, and teams who need both the
            strategic clarity and the creative execution to move fast and look great doing it.
          </p>
          <a
            href="https://linkedin.com/in/carmonagus"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#405163] font-bold hover:text-[#1FFF9E] transition-colors duration-200 mt-2"
          >
            Connect on LinkedIn
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 8H13M13 8L8 3M13 8L8 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}

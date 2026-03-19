const steps = [
  {
    letter: 'S',
    word: 'Start',
    description:
      'A real conversation — no lengthy forms. We talk about where you are, where you want to go, and what&apos;s in the way.',
  },
  {
    letter: 'T',
    word: 'Think',
    description:
      'I dig into your brand, audience, and competitive landscape to build a clear strategic foundation.',
  },
  {
    letter: 'E',
    word: 'Execute',
    description:
      'Strategy becomes creative. From direction to delivery, every asset is built to the brief.',
  },
  {
    letter: 'P',
    word: 'Perform',
    description:
      'We measure, learn, and optimize — making sure the work keeps working long after launch.',
  },
]

export default function Process() {
  return (
    <section className="py-24 bg-[#405163]">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-[#1FFF9E] text-xs font-bold tracking-[0.3em] uppercase mb-4">
            How it works
          </p>
          <h2
            className="font-black text-white leading-tight"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            The{' '}
            <span className="text-[#1FFF9E]">STEP</span>{' '}
            Framework
          </h2>
          <p className="text-white/60 text-lg mt-4 max-w-xl mx-auto">
            A simple, transparent four-step process — so you always know where we are.
          </p>
        </div>
      </div>

      {/* Video + Steps */}
      <div className="process-content">
        {/* Video */}
        <div className="process-video-outer">
          <video
            className="w-full h-auto block"
            autoPlay
            muted
            loop
            playsInline
            src="/How to process animation_Final.mp4"
          />
        </div>

        {/* STEP items */}
        <div className="process-steps-outer">
          <div className="process-steps-grid">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-5">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-[#1FFF9E] flex items-center justify-center">
                  <span className="text-[#405163] font-black text-xl">{step.letter}</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">{step.word}</h3>
                  <p
                    className="text-white/60 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: step.description }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-6xl mx-auto px-6 text-center mt-16">
        <a
          href="mailto:strategysequence@gmail.com"
          className="inline-flex items-center gap-2 bg-[#1FFF9E] text-[#405163] font-bold px-8 py-4 rounded-full text-base hover:bg-[#00e88a] transition-colors duration-200 shadow-lg shadow-black/20"
        >
          Start the Conversation
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 8H13M13 8L8 3M13 8L8 13" stroke="#405163" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </section>
  )
}

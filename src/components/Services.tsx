import Image from 'next/image'

const services = [
  {
    icon: '/Horse.svg',
    title: 'Brand Strategy',
    description:
      'Define your brand, understand your audience, and communicate your value clearly.',
    bullets: [
      'Brand positioning & messaging',
      'Audience definition & insights',
      'Storytelling frameworks',
      'Campaign development',
    ],
  },
  {
    icon: '/Creative Deve.svg',
    title: 'Creative Content',
    description:
      'Turn your ideas into visual content that feels modern, relevant, clear, and aligned.',
    bullets: [
      'Creative direction',
      'Copywriting & scripts',
      'Asset production',
      'Video editing',
    ],
  },
  {
    icon: '/Digital.svg',
    title: 'Digital Presence',
    description:
      'Design and build simple, clean, mobile-friendly websites — plus social media management.',
    bullets: [
      'Website design & build',
      'WordPress & Elementor',
      'Meta, Google, TikTok',
      'Social media management',
    ],
  },
]

export default function Services() {
  return (
    <section id="services" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[#405163]/50 text-xs font-bold tracking-[0.3em] uppercase mb-4">
            What we do
          </p>
          <h2
            className="font-black text-[#405163] leading-tight"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            Strategy + Craft,
            <br />
            under one roof.
          </h2>
          <p className="text-[#405163]/70 text-lg mt-4 max-w-xl mx-auto">
            No agency overhead. No handoffs. Just focused, experienced work.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <div
              key={i}
              className="group bg-[#f8f9fa] rounded-2xl p-8 hover:bg-[#405163] transition-colors duration-300 cursor-default"
            >
              <div className="mb-6">
                <Image
                  src={service.icon}
                  alt={service.title}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-contain"
                  style={{
                    filter:
                      'brightness(0) saturate(100%) invert(49%) sepia(100%) saturate(700%) hue-rotate(116deg)',
                  }}
                />
              </div>
              <h3 className="text-xl font-black text-[#405163] group-hover:text-white mb-3 transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-[#405163]/70 group-hover:text-white/70 text-sm leading-relaxed mb-6 transition-colors duration-300">
                {service.description}
              </p>
              <ul className="space-y-2">
                {service.bullets.map((bullet, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-[#405163]/60 group-hover:text-white/60 transition-colors duration-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1FFF9E] shrink-0" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

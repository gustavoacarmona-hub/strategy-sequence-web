import Image from 'next/image'

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
]

export default function StrategySeries() {
  return (
    <section className="py-24 px-6 bg-[#405163]">
      <div className="max-w-6xl mx-auto">
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

        {/* Cards */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center sm:items-stretch">
          {videos.map((video) => (
            <div
              key={video.id}
              className="w-full max-w-[280px] flex flex-col rounded-2xl overflow-hidden bg-[#32373c]"
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
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 8H13M13 8L8 3M13 8L8 13" stroke="#405163" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

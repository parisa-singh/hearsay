import { Link } from 'react-router-dom'

const FEATURES = [
  {
    icon: '🔍',
    title: 'Cross-platform aggregation',
    desc: 'Pulls reviews from 7+ platforms in a single search.',
  },
  {
    icon: '📍',
    title: 'Location-aware results',
    desc: 'Surfaces platforms popular where you actually are.',
  },
  {
    icon: '⚡',
    title: 'Divergence detection',
    desc: 'Flags when platforms strongly disagree — so you can ask why.',
  },
  {
    icon: '🌍',
    title: 'Regional platform suggestions',
    desc: 'Shows what people near you actually use, not just the global defaults.',
  },
  {
    icon: '⏱',
    title: 'Real-time data',
    desc: 'Reviews fetched live — nothing cached or stored on our end.',
  },
  {
    icon: '🔒',
    title: 'Privacy-first',
    desc: 'All API calls go through a Cloudflare Worker — no keys in your browser.',
  },
]

export default function AboutPage() {
  return (
    <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-16">
      <Link to="/" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-8 inline-block">
        ← Back
      </Link>
      <h1 className="text-3xl font-bold text-white mb-6">About Hearsay</h1>

      <div className="space-y-6 text-zinc-300 leading-relaxed">
        <p>
          Hearsay was built around a simple observation: the tool you use shapes the answer you get.
          When you look up a restaurant on Yelp, you get Yelp's user base, Yelp's algorithm, and
          Yelp's incentive structure. When you search Reddit, you get a different crowd with different
          expectations. When you check Google, you get a third data set entirely.
        </p>
        <p>
          None of them are wrong. All of them are partial. And most people only check one.
        </p>
        <p>
          Hearsay aggregates real reviews from multiple platforms in parallel and shows them
          side-by-side. It flags when platforms strongly disagree and signals when review patterns
          look suspicious — without synthesizing or summarizing the reviews for you.
        </p>

        <div className="border-l-2 border-zinc-700 pl-4 my-8">
          <p className="text-zinc-400 italic">
            "The truth is rarely pure and never simple."
          </p>
          <p className="text-zinc-600 text-sm mt-1">— Oscar Wilde</p>
        </div>

        {/* Features */}
        <h2 className="text-xl font-semibold text-white mt-8">Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {FEATURES.map(f => (
            <div key={f.title} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="text-xl mb-2">{f.icon}</div>
              <p className="text-sm font-medium text-zinc-200 mb-1">{f.title}</p>
              <p className="text-sm text-zinc-500">{f.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-semibold text-white mt-8">The Academic Angle</h2>
        <p>
          This project is grounded in research on information diversity and AI bias. The same dynamics
          that make search engines and review platforms unreliable as single sources apply to AI systems —
          each model reflects the data it was trained on, the preferences of its creators, and the
          optimization targets it was built around.
        </p>
        <p>
          Hearsay makes that source-dependence visible rather than hidden. When you can see that
          Reddit users rate something 2/5 while Google averages 4.8, you're equipped to ask better
          questions about why — and to form a more accurate judgment as a result.
        </p>

        <h2 className="text-xl font-semibold text-white mt-8">Technical Notes</h2>
        <ul className="space-y-2 text-zinc-400 list-disc list-inside">
          <li>Reviews are fetched in real time and not stored</li>
          <li>All API calls are proxied through Cloudflare Workers — no keys in your browser</li>
          <li>Built with Vite + React, hosted on GitHub Pages</li>
          <li>Open source: <a href="https://github.com/parisa-singh/hearsay" target="_blank" rel="noopener noreferrer" className="text-zinc-300 underline underline-offset-2 hover:text-white transition-colors">github.com/parisa-singh/hearsay</a></li>
        </ul>

        <h2 className="text-xl font-semibold text-white mt-8">About the Builder</h2>
        <p>
          Built by{' '}
          <a
            href="https://www.linkedin.com/in/parisa-singh/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-300 underline underline-offset-2 hover:text-white transition-colors"
          >
            Parisa Singh
          </a>
          . Interested in the intersection of information systems, AI transparency, and product design.
        </p>
      </div>
    </main>
  )
}

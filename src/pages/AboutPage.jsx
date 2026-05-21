import { Link } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      <Header />
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
            Hearsay aggregates reviews from 7 platforms in parallel — Google, Yelp, Reddit, YouTube,
            TripAdvisor, Facebook, and Trustpilot — and synthesizes them using Claude AI into a single,
            honest summary. It flags when platforms strongly disagree, surfaces recurring themes across
            all sources, and signals when review patterns look suspicious.
          </p>

          <div className="border-l-2 border-zinc-700 pl-4 my-8">
            <p className="text-zinc-400 italic">
              "The truth is rarely pure and never simple."
            </p>
            <p className="text-zinc-600 text-sm mt-1">— Oscar Wilde</p>
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
            <li>AI synthesis uses Claude by Anthropic (claude-sonnet-4-20250514)</li>
            <li>All API calls are proxied through Cloudflare Workers — no keys in your browser</li>
            <li>Built with Vite + React, hosted on GitHub Pages</li>
            <li>Open source: <a href="https://github.com/parisa-singh/hearsay" target="_blank" rel="noopener noreferrer" className="text-zinc-300 underline underline-offset-2 hover:text-white transition-colors">github.com/parisa-singh/hearsay</a></li>
          </ul>

          <h2 className="text-xl font-semibold text-white mt-8">About the Builder</h2>
          <p>
            Built by Parisa Singh, studying Computer Science and Business at UMass Amherst.
            Interested in the intersection of information systems, AI transparency, and product design.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}

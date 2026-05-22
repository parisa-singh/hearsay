export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 py-8 mt-16">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
        <p>
          Built by{' '}
          <a
            href="https://www.linkedin.com/in/parisa-singh/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            Parisa Singh
          </a>
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/parisa-singh/hearsay"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-300 transition-colors"
          >
            GitHub
          </a>
          <span>·</span>
          <span>Reviews sourced in real time</span>
        </div>
      </div>
    </footer>
  )
}

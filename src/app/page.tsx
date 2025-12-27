import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-slate-50">
      <main className="max-w-2xl w-full text-center space-y-8">
        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">
          Blog Editor Lab
        </h1>
        <p className="text-xl text-slate-600">
          A full-featured blog editor powered by Novel.sh and Tiptap.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link
            href="/blog/write"
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            Go to Editor
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-12 text-left">
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg mb-2">Slash Commands</h3>
            <p className="text-slate-500 text-sm">Type `/` to see a list of commands for headings, lists, and more.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg mb-2">Image Handling</h3>
            <p className="text-slate-500 text-sm">Paste image URLs or drop files directly. Resize images with drag handles.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg mb-2">YouTube Embed</h3>
            <p className="text-slate-500 text-sm">Paste a YouTube URL or use the slash command to embed videos.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg mb-2">Auto Save</h3>
            <p className="text-slate-500 text-sm">Real-time local backup and status indicators for peace of mind.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

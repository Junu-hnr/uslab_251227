# Blog Editor Lab

A high-performance blog editor built with Next.js, Tiptap, and Novel.sh.

## Features

- **AI-Powered Slug Generation**: Automatically generate SEO-friendly slugs using Google Gemini.
- **Rich Media Support**: 
  - Drag and drop or paste images.
  - Interactive image resizing.
  - Instant YouTube video embeds by pasting URLs.
- **Slash Commands**: Quick access to formatting tools via `/` menu.
- **Auto-Save**: Content is automatically saved locally or to a database.
- **Premium Design**: Modern UI with Tailwind CSS and Lucide icons.

## Deployment on Netlify

1. Connect this GitHub repository to Netlify.
2. Set the following environment variables if using AI features:
   - `GOOGLE_API_KEY`: Your Google Gemini API key.
3. Build Settings:
   - Build Command: `npm run build`
   - Publish directory: `.next`

## Getting Started

1. Clone the repository.
2. Install dependencies: `npm install`
3. Set up environment variables in `.env.local`.
4. Run development server: `npm run dev`

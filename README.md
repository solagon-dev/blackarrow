# BlackArrow Insurance Website

A professional, SEO-optimized Next.js website for BlackArrow Insurance featuring a distinctive design with precision-focused branding.

## Features

- **Modern Design**: Sophisticated black and gold color scheme with distinctive typography (Playfair Display + Inter)
- **SEO Optimized**: Complete metadata, semantic HTML, and optimized content structure
- **Responsive**: Fully responsive design that works beautifully on all devices
- **Performance**: Built with Next.js 14 App Router for optimal performance
- **Accessibility**: WCAG compliant with proper ARIA labels and semantic markup

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env.local
```

3. Add your Resend settings to `.env.local`:
```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL="BlackArrow Insurance <forms@blackarrow.co>"
```
All website form submissions are sent to `stone@blackarrowfg.com`. The `RESEND_FROM_EMAIL` value must use a sender on a domain verified in Resend.

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
blackarrow-insurance/
├── app/
│   ├── layout.tsx       # Root layout with SEO metadata
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles
├── components/
│   ├── Header.tsx       # Navigation header
│   ├── Hero.tsx         # Hero section
│   ├── Coverage.tsx     # Coverage options
│   ├── About.tsx        # About section
│   ├── Contact.tsx      # Contact form
│   └── Footer.tsx       # Footer
└── public/              # Static assets
```

## Design Philosophy

The website employs a **precision-focused aesthetic** that aligns with BlackArrow's brand identity:

- **Typography**: Playfair Display for elegant headings, Inter for clean body text
- **Color Palette**: Professional black tones with gold accents for trust and luxury
- **Motion**: Subtle animations for engagement without distraction
- **Layout**: Clean, asymmetric compositions with generous spacing

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React 18

## SEO Features

- Optimized meta tags
- Open Graph protocol
- Twitter Card support
- Semantic HTML structure
- Mobile-responsive design
- Fast page load times

## License

Copyright © 2024 BlackArrow Insurance. All rights reserved.

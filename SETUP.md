# BlackArrow Insurance - Setup Guide

## Quick Start

Follow these steps to get your BlackArrow Insurance website up and running:

### 1. Navigate to the project folder
```bash
cd ~/Downloads/blackarrow-insurance
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```

### 4. Open your browser
Navigate to [http://localhost:3000](http://localhost:3000)

## What's Included

### Pages & Sections
- **Hero Section**: Eye-catching introduction with animated elements
- **Coverage Section**: Four main insurance types (Auto, Home, Life, Business)
- **About Section**: Company information and credentials
- **Claims Section**: Step-by-step claims process
- **Contact Section**: Contact form with validation
- **Footer**: Links, newsletter signup, social media

### SEO Optimization
- Complete meta tags in `app/layout.tsx`
- Semantic HTML structure
- Optimized Open Graph and Twitter Card metadata
- robots.txt for search engine crawling
- Mobile-responsive design
- Fast loading times with Next.js optimization

### Design Features
- **Color Scheme**: Professional black and gold
- **Typography**: Playfair Display (headings) + Inter (body)
- **Animations**: Subtle fade-ins, slides, and hover effects
- **Responsive**: Works on mobile, tablet, and desktop
- **Accessibility**: ARIA labels and keyboard navigation

## Customization Guide

### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  'arrow-black': '#0A0A0A',    // Main dark color
  'arrow-gold': '#D4AF37',     // Accent color
  // ... add your colors
}
```

### Update Content
- **Company Info**: Edit components in `/components` folder
- **SEO Metadata**: Update `app/layout.tsx`
- **Contact Info**: Modify `components/Contact.tsx` and `components/Footer.tsx`

### Add New Pages
Create new files in the `app` directory:
```bash
app/
  about/
    page.tsx      # Creates /about route
  blog/
    page.tsx      # Creates /blog route
```

## Production Deployment

### Build for production
```bash
npm run build
```

### Test production build locally
```bash
npm start
```

### Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel will automatically deploy

### Environment Variables
Create `.env.local` for sensitive data:
```env
NEXT_PUBLIC_SITE_URL=https://yoursite.com
NEXT_PUBLIC_CONTACT_EMAIL=info@yoursite.com
```

## Project Structure

```
blackarrow-insurance/
├── app/
│   ├── layout.tsx          # Root layout with SEO
│   ├── page.tsx            # Homepage
│   └── globals.css         # Global styles
├── components/
│   ├── Header.tsx          # Navigation
│   ├── Hero.tsx            # Hero section
│   ├── Coverage.tsx        # Insurance products
│   ├── About.tsx           # About section
│   ├── Claims.tsx          # Claims process
│   ├── Contact.tsx         # Contact form
│   └── Footer.tsx          # Footer
├── public/
│   └── robots.txt          # SEO file
├── package.json            # Dependencies
├── tailwind.config.js      # Tailwind configuration
├── tsconfig.json           # TypeScript config
└── next.config.js          # Next.js config
```

## Features Checklist

✅ Modern, professional design
✅ Fully responsive
✅ SEO optimized
✅ Fast page loads
✅ Accessible (WCAG compliant)
✅ Type-safe with TypeScript
✅ Easy to customize
✅ Production-ready

## Next Steps

1. **Customize Content**: Update text, images, and contact information
2. **Add Logo**: Replace SVG logo in Header and Footer
3. **Connect Forms**: Integrate contact form with your backend/email service
4. **Add Images**: Add professional insurance-related images
5. **Set up Analytics**: Add Google Analytics or similar
6. **Configure Domain**: Point your domain to the hosting service

## Support

For Next.js documentation: [nextjs.org/docs](https://nextjs.org/docs)
For Tailwind CSS: [tailwindcss.com/docs](https://tailwindcss.com/docs)

## License

Copyright © 2024 BlackArrow Insurance. All rights reserved.

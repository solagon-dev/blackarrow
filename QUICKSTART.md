# 🚀 Quick Start Guide - BlackArrow Insurance Website

## ⚡ Get Running in 3 Steps

### Step 1: Navigate to Project
```bash
cd ~/Downloads/blackarrow-insurance
```

### Step 2: Install Dependencies
```bash
npm install
```
This will install all required packages (Next.js, React, Tailwind CSS, TypeScript, etc.)

### Step 3: Start Development Server
```bash
npm run dev
```

### Step 4: Open in Browser
Navigate to: **http://localhost:3000**

---

## ✅ What You'll See

Your BlackArrow Insurance website with:
- ✨ Professional black and gold design
- 📱 Fully responsive layout
- 🎯 All 7 sections: Header, Hero, Coverage, About, Claims, Contact, Footer
- 🚀 Fast loading times
- 🔍 SEO optimized

---

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Run production server |
| `npm run lint` | Check code quality |

---

## 🎨 First Customizations

### 1. Update Company Information
Edit `components/Contact.tsx`:
- Change phone number
- Update email address
- Modify office address

### 2. Customize Colors (Optional)
Edit `tailwind.config.js`:
```javascript
colors: {
  'arrow-gold': '#D4AF37',  // Change this!
}
```

### 3. Update SEO Metadata
Edit `app/layout.tsx`:
```typescript
title: 'Your Company Name | Your Tagline'
description: 'Your company description...'
```

---

## 🌐 Production Deployment

### Deploy to Vercel (Free & Easy)

1. **Create GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_URL
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Deploy"
   - Done! Your site is live 🎉

---

## 📂 File Structure Overview

```
blackarrow-insurance/
├── app/                    # Next.js pages
│   ├── layout.tsx         # SEO metadata here
│   ├── page.tsx           # Homepage
│   └── globals.css        # Styles
│
├── components/            # Reusable components
│   ├── Header.tsx        # Navigation
│   ├── Hero.tsx          # Hero section
│   ├── Coverage.tsx      # Insurance products
│   ├── About.tsx         # About section
│   ├── Claims.tsx        # Claims process
│   ├── Contact.tsx       # Contact form
│   └── Footer.tsx        # Footer
│
└── Configuration files    # Don't modify unless needed
```

---

## ❓ Troubleshooting

### Issue: `npm install` fails
**Solution**: Make sure you have Node.js 18+ installed
```bash
node --version  # Should be v18 or higher
```

### Issue: Port 3000 already in use
**Solution**: Use a different port
```bash
npm run dev -- -p 3001
```

### Issue: Changes not showing
**Solution**: Hard refresh your browser
- Mac: `Cmd + Shift + R`
- Windows: `Ctrl + Shift + R`

---

## 📚 Need More Help?

- **Full Setup Guide**: Read `SETUP.md`
- **SEO Details**: Check `SEO.md`
- **Project Overview**: See `PROJECT-OVERVIEW.md`

---

## 🎯 Your Next Actions

1. ✅ Run `npm install`
2. ✅ Run `npm run dev`
3. ✅ Open http://localhost:3000
4. ✅ Explore the website
5. ✅ Start customizing!

---

**🎉 Congratulations! Your professional insurance website is ready to go!**

Need to make changes? All components are in the `components/` folder.
Want to update SEO? Edit `app/layout.tsx`.
Ready to deploy? Push to GitHub and use Vercel.

Happy building! 🚀

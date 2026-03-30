# 🎯 HackerBuddy - Friendly Security Analyzer

A playful, educational web application that analyzes website security vulnerabilities from a "friendly hacker's" perspective. Learn about common security weaknesses in simple, non-scary terms!

## 🌟 Features

- **Website URL Analysis**: Enter any public website to scan for common security issues
- **Friendly Explanations**: Learn about vulnerabilities using the "hacker's perspective" format:
  - 🔍 What I Noticed
  - 😈 How I'd Attack This
  - 💥 What Could Happen
  - 🛠 How to Fix It

- **Severity Levels**: Issues are categorized as Low, Medium, or High risk
- **Educational Focus**: Perfect for learning security best practices without judgment
- **Dark Mode UI**: Modern, tech-forward design optimized for readability

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm

### Installation

```bash
# Clone and setup
git clone <your-repo>
cd my-project
pnpm install

# Create environment file (optional)
cp .env.example .env.local

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 What Gets Analyzed

The analyzer checks for:

1. **HTTPS/SSL Status** - Is the site using encrypted connections?
2. **Security Headers** - Is the site properly configured with:
   - X-Frame-Options
   - X-Content-Type-Options
   - Strict-Transport-Security (HSTS)
3. **Information Disclosure** - Is the server leaking version information?
4. **General Recommendations** - Security best practices

## 🛡️ Security Notes

- This analyzer performs **read-only operations** - no data is modified
- Only checks publicly available HTTP headers and basic site information
- Respects robots.txt and website blocking policies
- No payloads are sent; analysis is passive and non-intrusive
- Results are for educational purposes

## 🏗️ Project Structure

```
├── app/
│   ├── page.tsx              # Main page
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles & theme
│   └── api/
│       └── analyze/
│           └── route.ts      # Security analysis API
├── components/
│   ├── header.tsx            # App header
│   ├── hero.tsx              # Hero section
│   ├── analysis-form.tsx     # URL input form
│   ├── analysis-result.tsx   # Results display
│   ├── security-finding.tsx  # Individual finding card
│   ├── loading-state.tsx     # Loading spinner
│   └── ui/                   # shadcn/ui components
├── .env.example              # Environment variables template
└── package.json

```

## 🎨 Design System

- **Color Scheme**: Dark tech-forward aesthetic with vibrant accent colors
- **Typography**: Clean, readable fonts optimized for learning
- **Components**: Built with shadcn/ui for consistency and accessibility

## 🔧 Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Database**: None (stateless analysis)

## 📚 Learning Resources

If you find vulnerabilities in your own sites, here are good resources:

- [OWASP Top 10](https://owasp.org/www-project-top-ten/) - Common vulnerabilities
- [MDN Web Docs - Security](https://developer.mozilla.org/en-US/docs/Web/Security) - In-depth guides
- [Security Headers](https://securityheaders.com) - Check your headers
- [Mozilla Observatory](https://observatory.mozilla.org/) - Similar tool by Mozilla

## 💡 Tips for Using HackerBuddy

1. **Test your own sites** - Use this to learn about your own security posture
2. **Read the explanations** - Understanding the "why" is more important than the findings
3. **Share with teams** - Use this as a teaching tool for developers
4. **Remember: No fix is forever** - Security requires ongoing maintenance

## 🤝 Disclaimer

This tool is for **educational purposes only**. 

- Only analyze websites you own or have permission to test
- Results are based on basic header analysis and are not comprehensive
- Professional security audits require much deeper analysis
- Always report real vulnerabilities responsibly to site owners

## 🚀 Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Or deploy anywhere that supports Next.js!

## 📝 License

MIT License - Feel free to use for learning and teaching!

---

Built with ❤️ for curious developers who want to understand security better.

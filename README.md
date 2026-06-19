# EthioUni - Ethiopian University Review Platform

A comprehensive platform for rating and reviewing Ethiopian universities with AI-powered summaries, detailed analytics, and complaint management.

## 🚀 Features

- **University Reviews** - Rate and review Ethiopian universities
- **AI-Powered Summaries** - Intelligent summaries of university reviews
- **Rating System** - Multi-category rating system (academics, facilities, admin, etc.)
- **Complaint Management** - Report issues and track complaint status
- **Authentication** - NextAuth with OAuth support (Google, GitHub)
- **Responsive Design** - Mobile-friendly UI with Tailwind CSS
- **Maps Integration** - Leaflet maps for university locations
- **Image Management** - Cloudinary integration for image uploads

## 📋 Prerequisites

- Node.js 18+ (20+ recommended)
- npm or yarn or pnpm
- PostgreSQL database
- Environment variables configured

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/Getachew-Eyayu/EthioUni.git
cd EthioUni
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Setup environment variables

```bash
# Copy the example env file
cp .env.example .env.local

# Edit .env.local with your actual values
nano .env.local
```

### 4. Setup database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) Seed database
npm run db:seed
```

## 🏃 Running the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 📦 Available Scripts

```bash
# Development
npm run dev                 # Start dev server with hot reload
npm run lint                # Run ESLint

# Build & Production
npm run build              # Build for production
npm start                  # Start production server

# Database
npm run db:generate        # Generate Prisma client
npm run db:migrate         # Run migrations
npm run db:push            # Push schema to database
npm run db:seed            # Seed database with sample data
npm run db:reset           # Reset database (WARNING: deletes all data)
```

## 🏗️ Project Structure

```
EthioUni/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   └── page.tsx           # Home page
├── components/            # React components
├── lib/                   # Utility functions
├── prisma/               # Database schema
├── public/               # Static files
├── styles/               # Global styles
└── types/                # TypeScript type definitions
```

## 🔧 Configuration Files

- **next.config.js** - Next.js configuration
- **tailwind.config.ts** - Tailwind CSS configuration
- **tsconfig.json** - TypeScript configuration
- **postcss.config.js** - PostCSS configuration
- **prisma/schema.prisma** - Database schema

## 🗄️ Database Schema

The application uses PostgreSQL with Prisma ORM. Key models include:

- **User** - User accounts and authentication
- **University** - University information
- **Rating** - Multi-category ratings
- **Review** - User reviews
- **Complaint** - Complaint tracking
- **AiSummary** - AI-generated summaries

## 🔐 Environment Variables

See `.env.example` for a complete list of required environment variables:

- Database connection string
- NextAuth configuration
- OAuth provider credentials
- Third-party API keys (Cloudinary, OpenAI, Resend)

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

```bash
# Build
npm run build

# Start
npm start
```

### Deploy to other platforms

See [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying)

## 📚 Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4, PostCSS
- **Database**: PostgreSQL, Prisma ORM
- **Authentication**: NextAuth v5 Beta
- **UI Components**: Radix UI
- **Maps**: Leaflet & React-Leaflet
- **Image Management**: Cloudinary
- **Email**: Resend
- **AI**: OpenAI
- **Form Validation**: Zod
- **Date Handling**: date-fns

## 🐛 Troubleshooting

### Port 3000 already in use

```bash
# Use a different port
npm run dev -- -p 3001
```

### Database connection error

- Check `DATABASE_URL` in `.env.local`
- Ensure PostgreSQL is running
- Verify database credentials

### Build errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Rebuild
npm run build
```

### Prisma issues

```bash
# Regenerate Prisma client
npm run db:generate

# Verify schema
npx prisma validate
```

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [NextAuth.js](https://next-auth.js.org)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For issues and questions, please open a GitHub issue.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Database by [Prisma](https://www.prisma.io)

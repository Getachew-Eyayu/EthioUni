# 🎓 EthioUni Development Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your database URL and API keys
nano .env.local

# Push Prisma schema
npm run db:push
```

### 3. Start Development Server
```bash
npm run dev
```

Visit http://localhost:3000

## Project Structure

```
EthioUni/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and helpers
│   ├── auth.ts            # NextAuth setup
│   ├── prisma.ts          # Prisma client
│   ├── email-service.ts   # Email functionality
│   └── ai-service.ts      # AI features
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seeding
├── public/                # Static files
├── styles/                # Global styles
└── types/                 # TypeScript types
```

## Key Files

### Configuration
- `next.config.js` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS
- `tsconfig.json` - TypeScript settings
- `postcss.config.js` - PostCSS settings
- `.eslintrc.json` - ESLint configuration
- `.prettierrc.js` - Code formatting

### Environment Variables
Required environment variables (see `.env.example`):
- `DATABASE_URL` - PostgreSQL connection
- `NEXTAUTH_SECRET` - Auth secret
- `NEXTAUTH_URL` - Auth URL
- `CLOUDINARY_*` - Image upload
- `OPENAI_API_KEY` - AI features
- `RESEND_API_KEY` - Email service

## Development Commands

```bash
# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Type check
npm run type-check
```

## Database Commands

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed

# Reset database (⚠️ destructive)
npm run db:reset

# Open Prisma Studio
npm run db:studio
```

## Common Issues

### Port 3000 already in use
```bash
npm run dev -- -p 3001
```

### Database connection error
1. Check `DATABASE_URL` in `.env.local`
2. Ensure PostgreSQL is running
3. Verify database credentials

### Build errors
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

### Prisma issues
```bash
# Regenerate client
npm run db:generate

# Validate schema
npx prisma validate
```

## Git Workflow

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes
3. Commit: `git commit -m "feat: description"`
4. Push: `git push origin feature/your-feature`
5. Create Pull Request

## Performance Tips

1. Use Image Optimization - Always use `next/image`
2. Code Splitting - Dynamic imports for large components
3. Database Queries - Use Prisma's `select` to fetch only needed fields
4. Caching - Leverage Next.js caching strategies

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js](https://next-auth.js.org)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)

## Support

For issues and questions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include error messages and reproduction steps

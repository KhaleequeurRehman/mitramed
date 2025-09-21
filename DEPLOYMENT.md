# Deployment Guide

## Vercel Deployment

### Prerequisites
1. MongoDB Atlas database set up
2. Vercel account connected to GitHub

### Environment Variables
Set these in your Vercel project settings:

```
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/mitramed?retryWrites=true&w=majority
NEXT_PUBLIC_API_URL=https://your-app.vercel.app
```

### Deployment Steps
1. Push changes to GitHub
2. Vercel will automatically deploy
3. The build process will:
   - Install dependencies
   - Run `prisma generate` (via postinstall script)
   - Build the Next.js app

### Troubleshooting
- If Prisma errors occur, ensure `DATABASE_URL` is set correctly
- Check Vercel build logs for any Prisma generation errors
- Make sure MongoDB connection string is accessible from Vercel

### Local Development
```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

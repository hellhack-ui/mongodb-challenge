# NewsInsight AI - Backend Setup Guide

## Prerequisites

Before running the backend, make sure you have:

1. **Node.js** (version 18 or higher)
2. **MongoDB Atlas account** (or local MongoDB instance)
3. **OpenAI API key**
4. **News API key** (from newsapi.org)

## Quick Start

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Environment Setup

Create a `.env.local` file in the root directory:

\`\`\`env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/news_insights
OPENAI_API_KEY=sk-your-openai-api-key
NEWS_API_KEY=your-news-api-key
GOOGLE_NEWS_API_KEY=your-google-news-api-key
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### 3. Database Setup

Run the database setup script:

\`\`\`bash
node scripts/setup-database.js
\`\`\`

Seed with sample data:

\`\`\`bash
node scripts/seed-data.js
\`\`\`

### 4. Start Development Server

\`\`\`bash
npm run dev
\`\`\`

The application will be available at `http://localhost:3000`

## API Endpoints

### News API
- `GET /api/news` - Fetch news articles
- `POST /api/news/analyze` - Analyze news content

### Analytics API
- `GET /api/analytics/sentiment` - Get sentiment analytics
- `GET /api/analytics/topics` - Get topic clusters
- `GET /api/analytics/bias` - Get bias analysis

## Production Deployment

### 1. Build the Application

\`\`\`bash
npm run build
\`\`\`

### 2. Start Production Server

\`\`\`bash
npm start
\`\`\`

### 3. Environment Variables for Production

Make sure to set all environment variables in your production environment:

- `MONGODB_URI` - Production MongoDB connection string
- `OPENAI_API_KEY` - OpenAI API key
- `NEWS_API_KEY` - News API key
- `NODE_ENV=production`

## Monitoring and Logs

The application includes built-in logging for:
- API requests and responses
- Database operations
- AI analysis results
- Error tracking

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check your connection string
   - Ensure IP whitelist includes your server
   - Verify username/password

2. **OpenAI API Errors**
   - Check API key validity
   - Monitor rate limits
   - Verify billing status

3. **News API Rate Limits**
   - Free tier: 1000 requests/day
   - Consider upgrading for production

### Performance Optimization

1. **Database Indexes**
   - Text search index for articles
   - Compound indexes for common queries
   - Vector index for semantic search

2. **Caching**
   - Implement Redis for API response caching
   - Cache AI analysis results
   - Use CDN for static assets

3. **Rate Limiting**
   - Implement rate limiting for API endpoints
   - Queue background processing tasks
   - Monitor API usage

## Development Workflow

1. **Local Development**
   \`\`\`bash
   npm run dev
   \`\`\`

2. **Testing**
   \`\`\`bash
   npm run test
   \`\`\`

3. **Linting**
   \`\`\`bash
   npm run lint
   \`\`\`

4. **Building**
   \`\`\`bash
   npm run build
   \`\`\`

## API Documentation

### GET /api/news

Fetch news articles with optional filters.

**Query Parameters:**
- `query` - Search query
- `region` - Region filter (us, uk, eu, asia, global)
- `language` - Language code (en, es, fr, etc.)
- `limit` - Number of articles to return

**Response:**
\`\`\`json
[
  {
    "title": "Article Title",
    "description": "Article description",
    "url": "https://example.com/article",
    "publishedAt": "2023-06-15T09:30:00Z",
    "source": { "name": "Source Name" },
    "sentiment": 0.6,
    "categories": ["Technology", "AI"]
  }
]
\`\`\`

### POST /api/analyze

Analyze text content for sentiment, bias, and topics.

**Request Body:**
\`\`\`json
{
  "text": "Text to analyze",
  "analysisType": "sentiment" | "bias" | "topics"
}
\`\`\`

**Response:**
\`\`\`json
{
  "score": 0.6,
  "summary": "Analysis summary",
  "details": {}
}


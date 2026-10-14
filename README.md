# Sports Arena Afrika

Sports Arena Afrika is a **news-first sports publishing platform** for African and international sports coverage.

## Product focus
- Breaking sports news
- African football and Kenya sports coverage
- International football and major sports stories
- Transfers and analysis
- Women's sports
- Videos and podcasts
- Fan Arena discussions and opinion polls
- Editorial publishing workflow
- SEO-focused article publishing
- Push/news notifications

Live-score, fixtures, league-table, player-database, WebSocket match-centre and prediction infrastructure has been removed from the production application.

## Technology
- React + Vite + Tailwind CSS
- Spring Boot 4.0.8 + Java 21
- Spring Security + JWT in an HttpOnly cookie
- MySQL 8
- Redis 7
- Flyway migrations
- Cloudflare R2-compatible S3 media storage
- Nginx reverse proxy
- Docker Compose
- Cloudflare DNS/CDN/WAF/TLS
- GitHub Actions

Spring currently lists Boot 4.0.8 and 4.1.1 as stable lines; this project uses 4.0.8 to reduce the size of the migration from the original Boot 3.4 codebase.

## Security changes
- Public registration disabled
- Staff roles controlled server-side
- No hard-coded production JWT secret
- Short-lived JWT access cookie
- Secure/HttpOnly/SameSite cookie in production
- Environment-driven CORS
- Validation on article creation
- Protected editorial publishing endpoint
- MySQL and Redis are internal-only
- API replicas are exposed only on localhost ports 18081/18082
- Actuator health endpoint
- Production secrets supplied through environment variables

## Development

### Frontend
```bash
cd frontend
npm ci
npm run lint
npm run build
npm run dev
```

### Backend
```bash
cd backend
mvn clean verify
```

For local HTTP development, set:
```env
AUTH_COOKIE_SECURE=false
```

## Production
See `DEPLOYMENT.md` and `deploy/nginx/sportsarenaafrika.conf`.

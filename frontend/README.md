# Sports Arena Afrika Frontend

React/Vite frontend for the Sports Arena Afrika news-first publishing platform.

## Commands
```bash
npm ci
npm run lint
npm run build
npm run dev
```

Set the API URL when your backend uses a non-default address. Local Spring Boot uses port `8080`; Docker Compose publishes the API on `18081` and `18082`. Without this setting, the frontend tries those local ports automatically.
```env
VITE_API_URL=http://localhost:18081/api
```

For production, set `VITE_API_URL=https://api.sportsarenaafrika.com/api`.

The reader website does not expose an admin shortcut. The newsroom is available through `/admin` and requires authenticated staff credentials.

# Sports Arena Afrika — Production Deployment

## Architecture
- Cloudflare: DNS/CDN/WAF/TLS
- Nginx on VPS: public reverse proxy and static frontend serving
- Spring Boot API: two internal replicas
- MySQL 8: internal only
- Redis 7: internal only
- Flyway: database migrations
- Cloudflare R2: media and backup storage

## Environment
Copy `.env.example` to `.env` on the server and replace every placeholder with a strong secret. Never commit `.env`.

## Start
```bash
docker compose build
docker compose up -d mysql redis
docker compose up -d backend_1
docker compose up -d backend_2
docker compose ps
```

## Health
```bash
curl http://127.0.0.1:8080/actuator/health
```
The API containers are intentionally not published to the public host. Nginx should proxy `api.sportsarenaafrika.com` to the internal Docker network.

## First administrator
Set the `BOOTSTRAP_ADMIN_*` variables only for the first controlled startup. After confirming the administrator exists, remove the bootstrap password variables and restart the backend.

## Editorial workflow
New articles are created as `DRAFT`. Editors can approve/publish them through the protected CMS/API. Public registration is disabled.


## Host Nginx
After the frontend build, copy `frontend/dist` to `/var/www/sportsarenaafrika/frontend/dist` and install `deploy/nginx/sportsarenaafrika.conf` under `/etc/nginx/sites-available/`. The backend replicas are exposed only on `127.0.0.1:18081` and `127.0.0.1:18082`; MySQL and Redis have no host ports.

Before enabling HTTPS, install the Cloudflare Origin CA certificate and update the Nginx server blocks for TLS. Then use Cloudflare Full (strict).

# Deployment

## Local development

Terminal A — API:

```bash
cd backend && npm run seed && npm run start:dev
```

Terminal B — UI:

```bash
cd frontend && npm run dev
```

- UI: http://localhost:3000  
- API: http://localhost:4000/api  
- Swagger: http://localhost:4000/docs  

## Environment

**backend/.env**

```
PORT=4000
JWT_SECRET=change-me
CORS_ORIGIN=http://localhost:3000
```

**frontend/.env.local**

```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## Production notes

1. `npm run build` in both apps  
2. Serve Nest with `node dist/main` (ensure `src/data` JSON is available or copy to deploy path)  
3. Serve Next with `next start` or Vercel  
4. Put Nest behind HTTPS reverse proxy  
5. Rotate `JWT_SECRET`  
6. When ready, swap `JsonRepository` → Postgres repository  

## Health check

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"owner@garmentserp.com\",\"password\":\"Password@123\"}"
```

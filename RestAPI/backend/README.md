# Backend Setup

Run the JSON-server:

```
npx -p json-server json-server --watch db.json --port 3000 --routes routes.json
```

This provides REST API at http://localhost:3000/workouts (GET/POST/PUT/DELETE).

Note: Auth is mocked frontend-side with localStorage. ownerId checked client-side.


# Fix API Errors - Angular Fitness App

## Current Status
Backend: Express/MongoDB on port 3001
Issues: Wrong workout API URL, servers not running, missing proxy

## Steps
### 1. Create Angular Proxy Config
Create `proxy.conf.json` to proxy /api → localhost:3001

### 2. Fix WorkoutService Endpoint
Change `apiUrl = 'http://localhost:3000/workouts'` → `'http://localhost:3001/api/workouts'`

### 3. Backend Setup
```bash
cd server
npm install
npm start
```

### 4. Frontend Dev Server
```bash
ng serve --proxy-config proxy.conf.json
```

### 5. Test Flow
1. http://localhost:4200 → register new user
2. Login → dashboard/workouts
3. Create/read workouts

### 7. Fix Edit Button
- Added *ngIf="workout.id" to Edit/Delete buttons
- Added ID validation in deleteWorkout()
- workout-form handles both create/edit

## Progress
- [x] Step 1-2,6 ✅
- [x] Step 7: Edit button fixed ✅


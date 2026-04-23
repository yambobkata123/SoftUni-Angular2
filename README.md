# Fitness Tracker - Angular SPA (Exam Project)

## 1. Application Purpose
**Fitness Tracker** helps users discover, create, and manage personalized workout routines. Guests can browse public workouts while authenticated users have full CRUD capabilities for their own training programs.

## 2. User Roles

### Guest (Not Authenticated User)
- View Home page with app overview
- Browse full workouts catalog
- View individual workout details 
- Access Login/Register pages

### Authenticated User
- Personal dashboard with own workouts
- Create new workout routines
- Edit own workouts
- Delete own workouts
- Persist login across sessions

## 3. Public Features
- **Home page** - Welcome + app overview
- **Catalog page** - Complete list of all workouts
- **Workout details** - Full info for specific workout (`/workout/:id`)
- **Login page** - Authentication
- **Register page** - New user registration

## Authenticated User Features
- **Dashboard** - Personal workouts list
- **Create workout** - New routine (`/create-workout`)
- **Edit workout** - Modify existing (`/edit-workout/:id`)
- **Delete workout** - Remove from dashboard
- Full CRUD on personal workouts only

## 4. Main Application Flow
1. User lands on **Home** page
2. Navigate to **Catalog** → browse workouts
3. Click workout → **Details** page (`/workout/:id`)
4. **Login** or **Register** for full access
5. **Dashboard** shows personal workouts
6. **Create** new workout → appears in dashboard
7. **Edit** or **Delete** personal workouts
8. Guest can't CRUD, auth users stay logged in

## 5. Data Structure

### Workout Object
- `id` (string) - Unique identifier
- `name` (string) - Workout title
- `description` (string) - Detailed info
- `duration` (number) - Minutes
- `difficulty` ('easy'|'medium'|'hard') - Level
- `ownerId` (string) - User ID
- `createdAt` (string) - ISO date

### User Object
- `id` (string)
- `email` (string)
- `token` (string) - Auth token

## 6. Project Architecture
```
src/app/
├── components/     # All UI components
│   ├── catalog/    # Public catalog
│   ├── dashboard/  # Private area
│   ├── workout-form/ # Shared create/edit
│   └── shared/     # Header/nav
├── services/       # Auth + Workout API
├── models/         # TypeScript interfaces
├── guards/         # Route protection
├── pipes/          # Custom transforms
└── app.routes.ts   # 8+ routes w/ params
```

## 7. Technologies Used
- **Angular 18** - Framework
- **TypeScript** - No `any` usage
- **RxJS** - Observables + operators (switchMap, map, catchError)
- **JSON-server REST API** - Backend data
- **ReactiveForms** - Form validation
- **CSS** - Glassmorphism design
- **Router guards** - Auth protection

## 8. How to Run the Project
1. **Clone repository**
```bash
git clone [your-repo-url]
cd fitness-tracker
```

2. **Start Backend API** (Terminal 1)
```bash
cd backend
npx json-server --watch db.json --port 3000
```
API at `http://localhost:3000/workouts`

3. **Frontend development** (Terminal 2)
```bash
npm install
ng serve --open
```
App opens at `http://localhost:4200`

**Test accounts:** 
- Email: `test@test.com` Password: `123456`
- Register new user anytime
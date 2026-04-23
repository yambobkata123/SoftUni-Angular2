import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { CatalogComponent } from './components/catalog/catalog.component';
import { WorkoutDetailComponent } from './components/workout-detail/workout-detail.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { WorkoutFormComponent } from './components/workout-form/workout-form.component';
import { authGuard } from './guards/auth.guard';
import { noAuthGuard } from './guards/no-auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'catalog', component: CatalogComponent },
  { path: 'workout/:id', component: WorkoutDetailComponent },
  { path: 'login', component: LoginComponent, canActivate: [noAuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [noAuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'create-workout', component: WorkoutFormComponent, canActivate: [authGuard] },
  { path: 'edit-workout/:id', component: WorkoutFormComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'home' }
];

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Workout } from '../models/workout';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private apiUrl = 'http://localhost:3000/workouts';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private get headers(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    });
  }

  getAll(): Observable<Workout[]> {
    return this.http.get<Workout[]>(this.apiUrl, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  getById(id: string): Observable<Workout> {
    return this.http.get<Workout>(`${this.apiUrl}/${id}`, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  create(workout: Omit<Workout, 'id'>): Observable<Workout> {
    return this.http.post<Workout>(this.apiUrl, workout, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  update(id: string, workout: Partial<Workout>): Observable<Workout> {
    return this.http.patch<Workout>(`${this.apiUrl}/${id}`, workout, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API error:', error);
    return throwError(() => new Error(error.error?.error || 'Something went wrong'));
  }
}

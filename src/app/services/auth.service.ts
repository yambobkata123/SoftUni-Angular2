import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3001/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      const user = JSON.parse(userJson) as User;
      this.currentUserSubject.next(user);
    }
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((user) => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('token', user.token || '');
        this.currentUserSubject.next(user);
      }),
      catchError(this.handleError)
    );
  }

  register(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, { email, password }).pipe(
      tap((user) => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('token', user.token || '');
        this.currentUserSubject.next(user);
      }),
      catchError(this.handleError)
    );
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Auth error:', error);
    return throwError(() => new Error(error.error?.error || 'Auth failed'));
  }
}

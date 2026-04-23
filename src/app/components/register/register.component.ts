import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { catchError, finalize, of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
  loading = false;
  error = '';

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      this.error = '';
      const { email, password } = this.registerForm.value;
      this.authService.register(email!, password!).pipe(
        catchError((err) => {
          this.error = err.message || 'Register failed';
          return of(null);
        }),
        finalize(() => this.loading = false)
      ).subscribe((user) => {
        if (user) {
          this.router.navigate(['/dashboard']);
        }
      });
    }
  }
}

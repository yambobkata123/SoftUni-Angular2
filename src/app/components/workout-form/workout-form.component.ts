import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { WorkoutService } from '../../services/workout.service';
import { Workout } from '../../models/workout';
import { AuthService } from '../../services/auth.service';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-workout-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './workout-form.component.html',
  styleUrls: ['./workout-form.component.css']
})
export class WorkoutFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private workoutService = inject(WorkoutService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.maxLength(500)]],
    duration: [30, [Validators.required, Validators.min(5), Validators.max(240)]],
    difficulty: ['', Validators.required]
  });

  loading = false;
  error = '';
  isEditMode = false;
  workoutId = '';

  ngOnInit(): void {
    this.workoutId = this.route.snapshot.paramMap.get('id') || '';
    
    if (this.workoutId) {
      this.isEditMode = true;
      this.loadWorkout(this.workoutId);
    }
  }

  private loadWorkout(id: string): void {
    this.workoutService.getById(id).pipe(
      catchError(err => {
        console.error('Load error:', err);
        this.error = 'Workout not found or unauthorized. Redirecting...';
        setTimeout(() => this.router.navigate(['/dashboard'], { skipLocationChange: true }), 1500);
        return of(null);
      })
    ).subscribe(workout => {
      if (workout) {
        this.form.patchValue({
          name: workout.name,
          description: workout.description || '',
          duration: workout.duration || 30,
          difficulty: workout.difficulty || 'medium'
        });
      }
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.loading = true;
      this.error = '';

      const formValue = this.form.value as Partial<Workout>;

      if (this.isEditMode && this.workoutId) {
        // Edit
        this.workoutService.update(this.workoutId, formValue).pipe(
          finalize(() => this.loading = false)
        ).subscribe({
          next: () => {
            console.log('Update success');
            this.router.navigate(['/dashboard'], { skipLocationChange: true });
          },
          error: (err) => {
            console.error('Update error:', err);
            this.error = 'Update failed: ' + (err.message || 'Try again');
          }
        });
      } else {
        // Create
        const newWorkout: Omit<Workout, 'id'> = {
          name: formValue.name!,
          description: formValue.description || '',
          duration: formValue.duration!,
          difficulty: formValue.difficulty!,
          ownerId: this.authService.getCurrentUser()?.id || '',
          createdAt: new Date().toISOString()
        };
        
        this.workoutService.create(newWorkout).pipe(
          finalize(() => this.loading = false)
        ).subscribe({
          next: () => {
            console.log('Create success');
            this.router.navigate(['/dashboard'], { skipLocationChange: true });
          },
          error: (err) => {
            console.error('Create error:', err);
            this.error = 'Create failed: ' + (err.message || 'Try again');
          }
        });
      }
    }
  }

  cancel(): void {
    this.router.navigate(['/dashboard'], { skipLocationChange: true });
  }
}

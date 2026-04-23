import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WorkoutService } from '../../services/workout.service';
import { AuthService } from '../../services/auth.service';
import { Workout } from '../../models/workout';
import { DifficultyPipe } from '../../pipes/difficulty.pipe';
import { AsyncPipe } from '@angular/common';
import { map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, DifficultyPipe, AsyncPipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  trackByWorkout(index: number, workout: any): string {
    return workout.id || index.toString();
  }
  private workoutService = inject(WorkoutService);
  private authService = inject(AuthService);
  myWorkouts$!: Observable<Workout[]>;
  debugWorkouts: any[] = [];

  ngOnInit() {
    const userId = this.authService.getCurrentUser()?.id || '';
    this.myWorkouts$ = this.workoutService.getAll().pipe(
      tap(workouts => {
        this.debugWorkouts = workouts;
        console.log('Dashboard workouts:', workouts);
      }),
      map(workouts => workouts.filter(w => w.ownerId === userId))
    );
  }

  deleteWorkout(id: string | undefined) {
    console.log('Delete clicked, ID:', id);
    if (!id) {
      console.error('No ID for delete');
      return;
    }
    if (confirm('Delete workout?')) {
      // Optimistic remove - hide immediately, revert on error
      const currentWorkouts = this.debugWorkouts.filter(w => w.id !== id);
      const userId = this.authService.getCurrentUser()?.id || '';
      this.myWorkouts$ = of(currentWorkouts.filter(w => w.ownerId === userId));
      
      this.workoutService.delete(id).subscribe({
        next: () => console.log('Server delete confirmed'),
        error: (err) => {
          console.error('Delete failed:', err);
          // Revert on error
          const userId = this.authService.getCurrentUser()?.id || '';
          this.myWorkouts$ = this.workoutService.getAll().pipe(
            map(workouts => workouts.filter(w => w.ownerId === userId))
          );
        }
      });
    }
  }
}

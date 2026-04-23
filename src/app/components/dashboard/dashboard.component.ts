import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WorkoutService } from '../../services/workout.service';
import { AuthService } from '../../services/auth.service';
import { Workout } from '../../models/workout';
import { DifficultyPipe } from '../../pipes/difficulty.pipe';
import { AsyncPipe } from '@angular/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, DifficultyPipe, AsyncPipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private workoutService = inject(WorkoutService);
  private authService = inject(AuthService);
  myWorkouts$!: Observable<Workout[]>;

  ngOnInit() {
    const userId = this.authService.getCurrentUser()?.id || '';
    this.myWorkouts$ = this.workoutService.getAll().pipe(
      map(workouts => workouts.filter(w => w.ownerId === userId))
    );
  }

  deleteWorkout(id: string | undefined) {
    if (!id) {
      console.error('No ID for delete');
      return;
    }
    if (confirm('Are you sure you want to delete this workout?')) {
      this.workoutService.delete(id).subscribe({
        next: () => {
          // Reload myWorkouts$ to reflect deletion
          const userId = this.authService.getCurrentUser()?.id || '';
          this.myWorkouts$ = this.workoutService.getAll().pipe(
            map(workouts => workouts.filter(w => w.ownerId === userId))
          );
        },
        error: (err) => console.error('Delete error:', err)
      });
    }
  }
}

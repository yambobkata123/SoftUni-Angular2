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
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  private workoutService = inject(WorkoutService);
  private authService = inject(AuthService);
  myWorkouts$!: Observable<Workout[]>;
  debugWorkouts: Workout[] = [];

  trackByWorkout(index: number, workout: Workout): string {
    return workout.id || index.toString();
  }

  ngOnInit() {
    this.loadWorkouts();
  }

  private loadWorkouts() {
    const userId = this.authService.getCurrentUser()?.id || '';
    console.log('Loading workouts for userId:', userId);

    this.myWorkouts$ = this.workoutService.getAll().pipe(
      tap((workouts) => {
        this.debugWorkouts = workouts;
        console.log('All workouts:', workouts);
        console.log('Matched:', workouts.filter((w) => w.ownerId === userId));
      }),
      map((workouts) => workouts.filter((w) => w.ownerId === userId))
    );
  }

  deleteWorkout(id: string | undefined) {
    console.log('=== DELETE CLICKED ===', id);
  
    if (!id) {
      console.error('No ID for delete');
      return;
    }
  
    const userId = this.authService.getCurrentUser()?.id || '';
    const previousWorkouts = [...this.debugWorkouts];
  
    this.debugWorkouts = this.debugWorkouts.filter((w) => w.id !== id);
    this.myWorkouts$ = of(this.debugWorkouts.filter((w) => w.ownerId === userId));
  
    this.workoutService.delete(id).subscribe({
      next: () => {
        console.log('Server delete confirmed');
      },
      error: (err) => {
        console.error('Delete failed:', err);
        this.debugWorkouts = previousWorkouts;
        this.myWorkouts$ = of(this.debugWorkouts.filter((w) => w.ownerId === userId));
      },
    });
  }
}
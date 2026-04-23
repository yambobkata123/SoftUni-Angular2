import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { WorkoutService } from '../../services/workout.service';
import { Workout } from '../../models/workout';
import { DifficultyPipe } from '../../pipes/difficulty.pipe';
import { AsyncPipe } from '@angular/common';
import { switchMap, of } from 'rxjs';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-workout-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DifficultyPipe, AsyncPipe],
  templateUrl: './workout-detail.component.html',
  styleUrls: ['./workout-detail.component.css']
})
export class WorkoutDetailComponent {
  private route = inject(ActivatedRoute);
  private workoutService = inject(WorkoutService);

  workout$ = this.route.paramMap.pipe(
    switchMap(params => {
      const id = params.get('id');
      if (id) {
        return this.workoutService.getById(id);
      }
      return of(null as any);
    }),
    catchError(() => of(null as any))
  ) as Observable<Workout | null>;
}

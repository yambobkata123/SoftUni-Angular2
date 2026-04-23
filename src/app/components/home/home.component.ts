import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WorkoutService } from '../../services/workout.service';
import { Workout } from '../../models/workout';
import { DifficultyPipe } from '../../pipes/difficulty.pipe';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, DifficultyPipe, AsyncPipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  workoutService = inject(WorkoutService);
  latestWorkouts$ = this.workoutService.getAll();
}

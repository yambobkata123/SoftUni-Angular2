import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WorkoutService } from '../../services/workout.service';
import { Workout } from '../../models/workout';
import { DifficultyPipe } from '../../pipes/difficulty.pipe';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, Subject, timer } from 'rxjs';
import { scan, takeUntil, takeWhile } from 'rxjs/operators';

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

  destroy$ = new Subject<void>();

  totalWorkouts$ = new BehaviorSubject<number>(0);

  activeUsers$ = new BehaviorSubject<number>(0);

  ngOnInit(): void {
    this.animateCounter(16, this.totalWorkouts$);
    this.animateCounter(5267, this.activeUsers$);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private animateCounter(target: number, subject: BehaviorSubject<number>): void {
    timer(0, 30).pipe(
      scan((acc, _) => {
        const increment = Math.ceil(target / 80);
        return Math.min(acc + increment, target);
      }, 0),
      takeWhile(val => val < target),
      takeUntil(this.destroy$)
    ).subscribe(subject);
  }
}

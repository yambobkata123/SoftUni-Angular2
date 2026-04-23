import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WorkoutService } from '../../services/workout.service';
import { Workout } from '../../models/workout';
import { DifficultyPipe } from '../../pipes/difficulty.pipe';
import { AsyncPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, switchMap, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterLink, DifficultyPipe, AsyncPipe, ReactiveFormsModule],
templateUrl: './catalog.component.html',
styleUrls: ['./catalog.component.css']
})
export class CatalogComponent {
  workoutService = inject(WorkoutService);
  searchCtrl = new FormControl('');

  allWorkouts$ = this.workoutService.getAll();
  
  filteredWorkouts$ = this.searchCtrl.valueChanges.pipe(
    startWith(''),
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(search => this.allWorkouts$.pipe(
      map(workouts => workouts.filter(w => 
        w.name.toLowerCase().includes(search?.toLowerCase() || '') ||
        w.description.toLowerCase().includes(search?.toLowerCase() || '')
      ))
    ))
  ) as Observable<Workout[]>;
}

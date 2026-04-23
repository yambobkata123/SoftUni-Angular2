import { Pipe, PipeTransform } from '@angular/core';
import { Workout } from '../models/workout';

@Pipe({
  name: 'difficulty'
})
export class DifficultyPipe implements PipeTransform {
  transform(value: Workout['difficulty']): string {
    const labels: Record<Workout['difficulty'], string> = {
      easy: '🟢 Easy',
      medium: '🟡 Medium',
      hard: '🔴 Hard'
    };
    return labels[value] || value;
  }
}

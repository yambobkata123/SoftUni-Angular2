export interface Workout {
  id: string;
  name: string;
  description: string;
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ownerId: string;
  createdAt: string;
}

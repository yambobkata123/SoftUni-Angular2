import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/shared/header/header.component';
import { AuthService } from './services/auth.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  template: `
    <app-header></app-header>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    main { min-height: calc(100vh - 60px); }
  `]
})
export class App implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Ensure auth is loaded
  }
}

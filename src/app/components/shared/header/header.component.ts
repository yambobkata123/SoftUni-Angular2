import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  isLoggedIn = false;
  userEmail = '';
  private subscription?: Subscription;

  ngOnInit() {
    this.subscription = this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.userEmail = user?.email || '';
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  logout() {
    this.authService.logout();
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="not-found">
      <div class="not-found-content">
        <h1>404</h1>
        <p class="title">Page Not Found</p>
        <p class="subtitle">The page you're looking for doesn't exist or has been moved.</p>
        <div class="actions">
          <a routerLink="/" class="btn-home">Go Home</a>
          <a routerLink="/catalog" class="btn-catalog">Browse Workouts</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .not-found {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      font-family: 'Segoe UI', Tahoma, Geneva, sans-serif;
      padding: 2rem;
    }
    
    .not-found-content {
      text-align: center;
      max-width: 600px;
      background: rgba(255,255,255,0.1);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      padding: 4rem 3rem;
      border: 1px solid rgba(255,255,255,0.2);
      box-shadow: 0 25px 60px rgba(0,0,0,0.3);
    }
    
    .not-found h1 {
      font-size: clamp(6rem, 20vw, 12rem);
      font-weight: 900;
      background: linear-gradient(135deg, #ffffff, #f0f9ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 1rem;
      letter-spacing: -0.05em;
      animation: glitch 2s infinite;
    }
    
    @keyframes glitch {
      0%, 100% { transform: translate(0); }
      20% { transform: translate(-2px, 2px); }
      40% { transform: translate(-2px, -2px); }
      60% { transform: translate(2px, 2px); }
      80% { transform: translate(2px, -2px); }
    }
    
    .title {
      font-size: clamp(2rem, 5vw, 3.5rem);
      font-weight: 800;
      color: rgba(255,255,255,0.95);
      margin-bottom: 1rem;
      text-shadow: 0 4px 20px rgba(0,0,0,0.5);
    }
    
    .subtitle {
      font-size: 1.3rem;
      color: rgba(255,255,255,0.8);
      margin-bottom: 3rem;
      line-height: 1.6;
    }
    
    .actions {
      display: flex;
      gap: 1.5rem;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .btn-home, .btn-catalog {
      padding: 1.2rem 3rem;
      border-radius: 16px;
      font-weight: 700;
      font-size: 1.1rem;
      text-decoration: none;
      transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      box-shadow: 0 15px 40px rgba(0,0,0,0.3);
      border: 2px solid rgba(255,255,255,0.3);
      backdrop-filter: blur(20px);
    }
    
    .btn-home {
      background: rgba(16,185,129,0.2);
      color: #10b981;
    }
    
    .btn-catalog {
      background: rgba(59,130,246,0.2);
      color: #3b82f6;
    }
    
    .btn-home:hover, .btn-catalog:hover {
      transform: translateY(-8px) scale(1.05);
      box-shadow: 0 30px 70px rgba(0,0,0,0.5);
      border-color: rgba(255,255,255,0.5);
    }
    
    @media (max-width: 768px) {
      .actions {
        flex-direction: column;
        align-items: center;
      }
      
      .not-found-content {
        padding: 3rem 2rem;
        margin: 1rem;
      }
    }
  `]
})
export class NotFoundComponent { }


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CookieConsentService } from '../../../services/cookie-consent.service';

@Component({
  selector: 'app-cookie-consent',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.css'],
})
export class CookieConsentComponent implements OnInit {
  showBanner = false;

  constructor(private cookieConsentService: CookieConsentService) {}

  ngOnInit(): void {
    this.cookieConsentService.consent$.subscribe((consent) => {
      this.showBanner = consent === null;
    });
  }

  acceptCookies(): void {
    this.cookieConsentService.acceptCookies();
  }

  declineCookies(): void {
    this.cookieConsentService.declineCookies();
  }
}


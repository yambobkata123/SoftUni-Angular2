import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CookieConsent {
  accepted: boolean;
  timestamp: number;
}

@Injectable({
  providedIn: 'root',
})
export class CookieConsentService {
  private readonly STORAGE_KEY = 'cookieConsent';
  private consentSubject = new BehaviorSubject<CookieConsent | null>(this.loadConsent());
  public consent$ = this.consentSubject.asObservable();

  constructor() {}

  private loadConsent(): CookieConsent | null {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored) as CookieConsent;
      } catch {
        return null;
      }
    }
    return null;
  }

  hasConsented(): boolean {
    return this.consentSubject.value !== null;
  }

  isAccepted(): boolean {
    return this.consentSubject.value?.accepted === true;
  }

  acceptCookies(): void {
    const consent: CookieConsent = { accepted: true, timestamp: Date.now() };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(consent));
    this.consentSubject.next(consent);
  }

  declineCookies(): void {
    const consent: CookieConsent = { accepted: false, timestamp: Date.now() };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(consent));
    this.consentSubject.next(consent);
  }

  resetConsent(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.consentSubject.next(null);
  }

  getConsent(): Observable<CookieConsent | null> {
    return this.consent$;
  }
}


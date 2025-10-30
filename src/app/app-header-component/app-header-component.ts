import {Component, inject, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs';

@Component({
  selector: 'app-header-component',
  standalone: false,
  templateUrl: './app-header-component.html',
  styleUrl: './app-header-component.css',
})
export class AppHeaderComponent {
  private router: Router = inject(Router);
  isHistoryPage: boolean = false;

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isHistoryPage = event.urlAfterRedirects.includes('history');
    });
  }

  goToHistory() {
    const isHistory = this.router.url.includes('/history');
    this.router.navigate([isHistory ? '/' : '/history']);
  }

  get title() {
    return this.isHistoryPage ? 'History' : 'Calculator';
  }

  get buttonLabel() {
    return this.isHistoryPage ? '←' : '🕓';
  }
}

import {Component, inject} from '@angular/core';
import {CalculatorService} from '../services/calculator-service';
import {Observable} from 'rxjs';
import {Router, RouterLink} from '@angular/router';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-history-component',
  templateUrl: './history-component.html',
  styleUrl: './history-component.css',
  imports: [
    AsyncPipe
  ]
})
export class HistoryComponent {
  private router = inject(Router);
  history$: Observable<string[][]>;

  constructor(private calculatorService: CalculatorService) {
    this.history$ = this.calculatorService.history;
  }

  loadHistoryItem(index: number) {
    this.calculatorService.loadFromHistory(index);
    this.router.navigate(['/']);
  }
}

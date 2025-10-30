import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {AsyncPipe, NgClass} from '@angular/common';
import {CalculatorService} from '../services/calculator-service';
import {Button, Operation} from '../types';
import {Observable, Subscription} from 'rxjs';
import {calculatorButtons, keyboardMap} from '../utils';


@Component({
  selector: 'app-calculator-component',
  templateUrl: './calculator-component.html',
  styleUrl: './calculator-component.css',
  imports: [
    NgClass,
    AsyncPipe,
  ]
})
export class CalculatorComponent implements AfterViewInit  {
  public buttons: Button[][] = calculatorButtons;
  @ViewChild('currentInput') currentInputEl!: ElementRef<HTMLDivElement>;

  currentInput$: Observable<string>;
  lastOperation$: Observable<string>;
  activeKey: string | number | Operation | null = null;
  private currentInputSubscription!: Subscription;


  constructor(private calculatorService: CalculatorService) {
    this.currentInput$ = this.calculatorService.currentInput$;
    this.lastOperation$ = this.calculatorService.lastOperation$;
  }

  onButtonClick(button: Button) {
    this.flashButton(button.value);
    this.calculatorService.handleInput(button.value);
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const input = keyboardMap[event.key];
    if (input) {
      event.preventDefault();
      this.flashButton(input)
      this.calculatorService.handleInput(input);
    }
  }


  flashButton(value: string | number | Operation) {
    this.activeKey = value;
    setTimeout(() => this.activeKey = null, 150);
  }


  ngAfterViewInit() {
    this.currentInputSubscription = this.currentInput$.subscribe(() => {
      const el = this.currentInputEl.nativeElement;
      setTimeout(()=>{
        el.scrollLeft = el.scrollWidth;
      },10)
    });
  }

  ngOnDestroy() {
    this.currentInputSubscription.unsubscribe();
  }
}

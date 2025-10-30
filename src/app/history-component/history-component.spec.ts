import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryComponent } from './history-component';
import {BehaviorSubject} from 'rxjs';
import {By} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {CalculatorService} from '../services/calculator-service';

describe('HistoryComponent', () => {
  let component: HistoryComponent;
  let fixture: ComponentFixture<HistoryComponent>;
  let historySubject: BehaviorSubject<string[][]>;
  let serviceStub: any;
  let routerStub: any;
  beforeEach(async () => {
    historySubject = new BehaviorSubject<string[][]>([]);
    serviceStub = {
      history: historySubject.asObservable(),
      loadFromHistory: jasmine.createSpy('loadFromHistory')
    };
    routerStub = { navigate: jasmine.createSpy('navigate') };

    await TestBed.configureTestingModule({
      imports: [HistoryComponent],
      providers: [
        { provide: CalculatorService, useValue: serviceStub },
        { provide: Router, useValue: routerStub }
      ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(HistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display empty message if no history', () => {
    const emptyEl = fixture.debugElement.query(By.css('.empty')).nativeElement;
    expect(emptyEl.textContent).toContain('No history yet');
  });

  it('should render history items when history exists', () => {
    const data = [['1','+','2'], ['3','*','4']];
    historySubject.next(data);
    fixture.detectChanges();

    const items = fixture.debugElement.queryAll(By.css('.history-item'));
    expect(items.length).toBe(2);
    expect(items[0].nativeElement.textContent).toBe('1+2');
    expect(items[1].nativeElement.textContent).toBe('3*4');
  });

  it('should load history item and navigate home on click', () => {
    const data = [['1','+','2']];
    historySubject.next(data);
    fixture.detectChanges();

    const itemEl = fixture.debugElement.query(By.css('.history-item')).nativeElement;
    itemEl.click();

    expect(serviceStub.loadFromHistory).toHaveBeenCalledWith(0);
    expect(routerStub.navigate).toHaveBeenCalledWith(['/']);
  });
});

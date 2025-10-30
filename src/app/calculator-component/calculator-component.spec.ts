import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CalculatorComponent } from './calculator-component';
import { By } from '@angular/platform-browser';
import { CalculatorService } from '../services/calculator-service';
import { BehaviorSubject } from 'rxjs';

class CalculatorServiceStub {
  currentInput$ = new BehaviorSubject('0');
  lastOperation$ = new BehaviorSubject('');
  handleInput = jasmine.createSpy('handleInput');
}

describe('CalculatorComponent', () => {
  let component: CalculatorComponent;
  let fixture: ComponentFixture<CalculatorComponent>;
  let serviceStub: CalculatorServiceStub;

  beforeEach(async () => {
    serviceStub = new CalculatorServiceStub();

    await TestBed.configureTestingModule({
      imports: [CalculatorComponent],
      providers: [
        { provide: CalculatorService, useValue: serviceStub }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all calculator buttons', () => {
    const btnEls = fixture.debugElement.queryAll(By.css('.button'));
    expect(btnEls.length).toBeGreaterThan(0);
  });

  it('should display current input and last operation', () => {
    const currentEl = fixture.debugElement.query(By.css('.current-input')).nativeElement;
    const lastEl = fixture.debugElement.query(By.css('.last-operation')).nativeElement;

    expect(currentEl.textContent).toBe('0');
    expect(lastEl.textContent).toBe('');
  });

  it('should call handleInput when button clicked', () => {
    const firstButton = component.buttons[0][0];
    const btnEl = fixture.debugElement.query(By.css(`#${firstButton.value}`)).nativeElement;
    btnEl.click();
    expect(serviceStub.handleInput).toHaveBeenCalledWith(firstButton.value);
  });

  it('should flash active button', (done) => {
    const firstButton = component.buttons[0][0];
    component.flashButton(firstButton.value);
    expect(component.activeKey).toBe(firstButton.value);
    setTimeout(() => {
      expect(component.activeKey).toBeNull();
      done();
    }, 200);
  });

  it('should scroll currentInput element on update', fakeAsync(() => {
    const currentInputEl = fixture.debugElement.query(By.css('.current-input')).nativeElement;
    let scrollLeft = 0;
    Object.defineProperty(currentInputEl, 'scrollLeft', {
      get: () => scrollLeft,
      set: (val) => { scrollLeft = val; },
      configurable: true
    });
    Object.defineProperty(currentInputEl, 'scrollWidth', { value: 100, configurable: true });
    serviceStub.currentInput$.next('123456789');

    tick(20);
    fixture.detectChanges();

    expect(currentInputEl.scrollLeft).toBe(100);
  }));
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppHeaderComponent } from './app-header-component';
import { By } from '@angular/platform-browser';
import {ActivatedRoute, provideRouter, Router} from '@angular/router';
import {Component} from '@angular/core';


@Component({
  selector: 'app-mock',
  template: ``,
  standalone: true
})
class AppMockComponent {}


describe('AppHeaderComponent', () => {
  let component: AppHeaderComponent;
  let fixture: ComponentFixture<AppHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppHeaderComponent],

      imports: [AppMockComponent],

      providers: [
        { provide: ActivatedRoute, useValue: {} },
        provideRouter([
          { path: '', component: AppMockComponent },
          { path: 'history', component: AppMockComponent }
        ]),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display "Calculator" by default', () => {
    const titleEl = fixture.debugElement.query(By.css('.title')).nativeElement;
    expect(titleEl.textContent).toBe('Calculator');

    const buttonEl = fixture.debugElement.query(By.css('.history-btn')).nativeElement;
    expect(buttonEl.textContent?.trim()).toBe('🕓');

    expect(fixture.debugElement.query(By.css('.header')).classes['reverse']).toBeFalsy();
  });

  it('should navigate to /history when history button clicked', async () => {
    const router = TestBed.inject(Router);
    await router.navigate(['/']);
    fixture.detectChanges();

    const buttonEl = fixture.debugElement.query(By.css('.history-btn')).nativeElement;
    buttonEl.click();
    await fixture.whenStable();

    expect(router.url).toContain('/history');
    fixture.detectChanges();
    const titleEl = fixture.debugElement.query(By.css('.title')).nativeElement;
    expect(titleEl.textContent).toBe('History');
    expect(buttonEl.textContent?.trim()).toBe('←');
  });

  it('should navigate back to / when back button clicked', async () => {
    const router = TestBed.inject(Router);
    await router.navigate(['/history']);
    fixture.detectChanges();

    const buttonEl = fixture.debugElement.query(By.css('.history-btn')).nativeElement;
    buttonEl.click();
    await fixture.whenStable();

    expect(router.url).toBe('/');
  });

});

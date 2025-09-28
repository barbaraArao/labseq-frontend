import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LoaderComponent } from './loader.component';

describe('LoaderComponent', () => {
  let component: LoaderComponent;
  let fixture: ComponentFixture<LoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply medium size by default', () => {
    const spinner = fixture.debugElement.query(By.css('svg'));
    const classes = spinner.nativeElement.getAttribute('class');
    expect(classes).toContain('w-6');
    expect(classes).toContain('h-6');
  });

  it('should apply small size when size="sm"', () => {
    component.size = 'sm';
    fixture.detectChanges();

    const spinner = fixture.debugElement.query(By.css('svg'));
    const classes = spinner.nativeElement.getAttribute('class');
    expect(classes).toContain('w-4');
    expect(classes).toContain('h-4');
  });

  it('should apply large size when size="lg"', () => {
    component.size = 'lg';
    fixture.detectChanges();

    const spinner = fixture.debugElement.query(By.css('svg'));
    const classes = spinner.nativeElement.getAttribute('class');
    expect(classes).toContain('w-10');
    expect(classes).toContain('h-10');
  });

  it('should apply default color (text-blue-600)', () => {
    const spinner = fixture.debugElement.query(By.css('svg'));
    const classes = spinner.nativeElement.getAttribute('class');
    expect(classes).toContain('text-blue-600');
  });

  it('should apply custom color when color is changed', () => {
    component.color = 'text-red-500';
    fixture.detectChanges();

    const spinner = fixture.debugElement.query(By.css('svg'));
    const classes = spinner.nativeElement.getAttribute('class');
    expect(classes).toContain('text-red-500');
  });
});

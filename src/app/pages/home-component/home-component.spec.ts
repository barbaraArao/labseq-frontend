import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HomeComponent } from './home-component';
import { LabseqService } from '../../core/services/labseq.service';
import { of, throwError } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let labseqServiceSpy: jasmine.SpyObj<LabseqService>;

  beforeEach(async () => {
    labseqServiceSpy = jasmine.createSpyObj('LabseqService', ['calculate', 'calculateByApi']);

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [{ provide: LabseqService, useValue: labseqServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call labseqService.calculate and set result when successful', fakeAsync(() => {
    labseqServiceSpy.calculate.and.returnValue(of({ value: '123', tooBig: false }));

    component.form.patchValue({ seqIdx: 5 });
    component.calculate();

    tick();

    expect(labseqServiceSpy.calculate).toHaveBeenCalledWith(5);
    expect(component.result()).toBe('123');
    expect(component.error()).toBeNull();
    expect(component.loading()).toBeFalse();
    expect(component.performanceTime()).not.toBeNull();
  }));

  it('should call calculateByApi when tooBig = true', fakeAsync(() => {
    labseqServiceSpy.calculate.and.returnValue(of({ value: 'ignored', tooBig: true }));
    labseqServiceSpy.calculateByApi.and.returnValue(of({ value: '999', digits: 25454 }));

    component.form.patchValue({ seqIdx: 2_000_000 });
    component.calculate();

    tick();

    expect(labseqServiceSpy.calculate).toHaveBeenCalledWith(2_000_000);
    expect(labseqServiceSpy.calculateByApi).toHaveBeenCalledWith(2_000_000);
    expect(component.result()).toBe('999');
    expect(component.error()).toBeNull();
  }));

  it('should handle errors from labseqService', fakeAsync(() => {
    labseqServiceSpy.calculate.and.returnValue(throwError(() => 'Erro simulado'));

    component.form.patchValue({ seqIdx: 10 });
    component.calculate();

    tick();

    expect(component.result()).toBeNull();
    expect(component.error()).toBe('Erro simulado');
    expect(component.loading()).toBeFalse();
  }));

  it('should handle errors from calculateByApi when tooBig = true', fakeAsync(() => {
    labseqServiceSpy.calculate.and.returnValue(of({ value: 'ignored', tooBig: true }));
    labseqServiceSpy.calculateByApi.and.returnValue(throwError(() => 'Erro na API'));

    component.form.patchValue({ seqIdx: 2_000_000 });
    component.calculate();

    tick();

    expect(component.result()).toBeNull();
    expect(component.error()).toBe('Erro na API');
    expect(component.loading()).toBeFalse();
  }));

  it('should clear form and reset state when clear is called', () => {
    component.result.set('999');
    component.error.set('err');
    component.performanceTime.set(5);
    component.loading.set(true);

    component.clear();

    expect(component.form.get('seqIdx')?.value).toBeNull();
    expect(component.result()).toBeNull();
    expect(component.error()).toBeNull();
    expect(component.performanceTime()).toBeNull();
    expect(component.loading()).toBeFalse();
  });
});

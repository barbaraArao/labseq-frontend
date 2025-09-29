import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LabseqService } from '../../core/services/labseq.service';
import { catchError, of, Subscription, switchMap } from 'rxjs';
import { ButtonComponent } from '../../shared/components/button-component/button-component';
import { InputComponent } from '../../shared/components/input-component/input-component';
import { BigNumberPipe } from '../../shared/pipes/big-number.pipe';
import { LoaderComponent } from '../../shared/components/loader-component/loader.component';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-home-component',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    InputComponent,
    BigNumberPipe,
    LoaderComponent,
    DecimalPipe,
  ],
  templateUrl: './home-component.html',
})
export class HomeComponent {
  public form: FormGroup;

  result = signal<string | null>(null);
  error = signal<string | null>(null);
  loading = signal(false);
  loadingBackend = signal(false);
  performanceTime = signal<number | null>(null);

  private subscription?: Subscription;

  constructor(private fb: FormBuilder, private labseqService: LabseqService) {
    this.form = this.fb.group({
      seqIdx: [
        null,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(2_000_000),
          Validators.pattern(/^\d+$/),
        ],
      ],
    });
  }

  calculate(): void {
    this.resetState(true);

    const n = parseInt(this.form.get('seqIdx')?.value);
    const start = performance.now();

    this.subscription = this.labseqService
      .calculate(n)
      .pipe(
        switchMap(({ value, tooBig }) => {
          if (tooBig) {
            this.loadingBackend.set(true);
            return this.labseqService.calculateByApi(n).pipe(
              switchMap((res) => of({ value: res.value, tooBig: false })),
              catchError((err) => {
                this.error.set(err?.message ?? 'Failed to fetch from API');
                this.loading.set(false);
                return of({ value: null, tooBig: false });
              })
            );
          }
          return of({ value, tooBig: false });
        })
      )
      .subscribe({
        next: ({ value }) => {
          this.result.set(value ?? '');
        },
        error: (err) => {
          this.error.set(err);
          this.loading.set(false);
          this.loadingBackend.set(false);
        },
        complete: () => {
          const end = performance.now();
          this.performanceTime.set((end - start) / 1000);
          this.loading.set(false);
          this.loadingBackend.set(false);
        },
      });
  }

  clear(): void {
    this.form.reset();
    this.resetState();
  }

  private resetState(startingCalc = false): void {
    this.result.set(null);
    this.error.set(null);
    this.performanceTime.set(null);
    this.loadingBackend.set(false);
    this.loading.set(startingCalc);
    this.subscription?.unsubscribe();
  }
}

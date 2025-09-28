import { TestBed } from '@angular/core/testing';
import { LabseqService } from './labseq.service';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { LabSeqResultInterface } from '../models/labseq-result.interface';
import { provideHttpClient } from '@angular/common/http';

describe('LabseqService', () => {
  let service: LabseqService;
  let mockWorker: any;
  let httpMock: HttpTestingController;

beforeEach(() => {
  mockWorker = {
    postMessage: jasmine.createSpy('postMessage'),
    terminate: jasmine.createSpy('terminate'),
    onmessage: null as ((this: Worker, ev: MessageEvent) => any) | null,
    onerror: null as ((this: Worker, ev: ErrorEvent) => any) | null,
  };

  spyOn(window as any, 'Worker').and.returnValue(mockWorker);

  TestBed.configureTestingModule({
    providers: [
      LabseqService,
      provideHttpClient(),
      provideHttpClientTesting(),
    ],
  });

  service = TestBed.inject(LabseqService);
  httpMock = TestBed.inject(HttpTestingController);
});


  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('calculate (worker)', () => {
    it('should return a value when worker responds successfully', (done) => {
      const n = 10;

      service.calculate(n).subscribe({
        next: (data) => {
          expect(data).toEqual({ value: '42', tooBig: false });
          expect(mockWorker.postMessage).toHaveBeenCalledWith(n);
          done();
        },
      });

      mockWorker.onmessage!({ data: { value: '42', tooBig: false } } as MessageEvent);
    });

    it('should error when worker sends error', (done) => {
      const n = 5;

      service.calculate(n).subscribe({
        next: () => fail('Should not call next'),
        error: (err) => {
          expect(err).toBe('Something went wrong');
          done();
        },
      });

      mockWorker.onmessage!({ data: { error: 'Something went wrong' } } as MessageEvent);
    });

    it('should error when worker.onerror is triggered', (done) => {
      const n = 5;

      service.calculate(n).subscribe({
        error: (err) => {
          expect(err).toBe('Boom');
          done();
        },
      });

      mockWorker.onerror!({ message: 'Boom' } as unknown as ErrorEvent);
    });

    it('should terminate worker on unsubscribe', () => {
      const n = 123;

      const subscription = service.calculate(n).subscribe();
      subscription.unsubscribe();

      expect(mockWorker.terminate).toHaveBeenCalled();
    });
  });

  describe('calculateByApi (http)', () => {
    it('should call API and return LabSeqResultInterface', () => {
      const n = 15;
      const mockResponse: LabSeqResultInterface = { value: '98765', digits: 5 };

      service.calculateByApi(n).subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/calc/${n}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle API error', (done) => {
      const n = 20;

      service.calculateByApi(n).subscribe({
        next: () => fail('Should not emit success'),
        error: (err) => {
          expect(err.status).toBe(500);
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/calc/${n}`);
      req.flush('Internal Server Error', { status: 500, statusText: 'Server Error' });
    });
  });
});

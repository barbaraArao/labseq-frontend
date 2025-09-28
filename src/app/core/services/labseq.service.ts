import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { LabSeqResultInterface } from '../models/labseq-result.interface';


@Injectable({
  providedIn: 'root',
})
export class LabseqService {
  constructor(private http: HttpClient) {}

calculateByApi(n: number) {
  return this.http.get<LabSeqResultInterface>(`${environment.apiUrl}/calc/${n}`);
}

  calculate(n: number): Observable<{
    value?: string;
    tooBig: boolean;
    error?: unknown;
  }> {
    return new Observable((observer) => {
      const worker = new Worker(new URL('../workers/labseq.worker', import.meta.url), {
        type: 'module',
      });

      worker.postMessage(n);

      worker.onmessage = ({ data }) => {
        if (data.error) {
          observer.error(data.error);
        } else {
          observer.next(data);
          observer.complete();
        }
        worker.terminate();
      };

      worker.onerror = (err) => {
        observer.error(err.message ?? err);
        worker.terminate();
      };

      return () => worker.terminate();
    });
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { isMatch } from 'matcher';
import { Observable, Subject } from 'rxjs';
import { ProfilerResponse } from '../types/profiler-response';
import { NgxMiniprofilerOverlayServiceConfig } from './ngx-miniprofiler-overlay-config.service';

@Injectable()
export class NgxMiniprofilerOverlayService {

  private profilerResponses = new Subject<ProfilerResponse>();
  profilerResponses$ = this.profilerResponses.asObservable();

  cached = new Set();

  constructor(private http: HttpClient, private config: NgxMiniprofilerOverlayServiceConfig) { }

  handleIncomingIds(ids: string[]): void {
    for (const id of ids) {
      if (!this.cached.has(id)) {
        this.cached.add(id);

        this.http.get<ProfilerResponse>(`${this.config.api}/results?id=${id}`).subscribe(result => {
          if (isMatch(result.Name, this.config.matcher)) {
            this.profilerResponses.next(result);
          }
        });
      }
    }
  }

  getProfilerResponses(): Observable<ProfilerResponse> {
    return this.profilerResponses$;
  }
}

import { Injectable } from '@angular/core';

@Injectable()
export class NgxMiniprofilerOverlayServiceConfig {
  api = '/mini-profiler-resources';
  matcher = ['*'];
  thresholds = {
    good: (ms: number) => { return false; },
    okay: (ms: number) => { return false; },
    bad: (ms: number) => { return false; }
  };
}

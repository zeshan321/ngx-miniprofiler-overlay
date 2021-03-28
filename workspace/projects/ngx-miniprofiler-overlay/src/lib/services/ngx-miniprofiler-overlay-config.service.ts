import { Injectable } from '@angular/core';

@Injectable()
export class NgxMiniprofilerOverlayServiceConfig {
  api = '/mini-profiler-resources';
  matcher = ['*'];
  thresholds = {
    good: (ms: number) => false,
    okay: (ms: number) => false,
    bad: (ms: number) => false
  };
  overlayTrigger = (event: KeyboardEvent) => {
    return event.key === 'Escape';
  }
}

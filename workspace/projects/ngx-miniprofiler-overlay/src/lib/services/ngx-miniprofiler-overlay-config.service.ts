import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NgxMiniprofilerOverlayServiceConfig {
  isVisible = false;
  api = '/mini-profiler-resources';
  matcher = ['*'];
  thresholds = {
    good: (ms: number) => false,
    okay: (ms: number) => false,
    bad: (ms: number) => false
  };
  enableDuplicateDetection = true;
  duplicateDetectionExclude = ['Open', 'OpenAsync', 'Close', 'CloseAsync'];
  overlayTrigger = (event: KeyboardEvent) => {
    return event.key === 'Escape';
  }
}

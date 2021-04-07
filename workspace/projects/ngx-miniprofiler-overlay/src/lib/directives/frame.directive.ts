import { ChangeDetectorRef, Directive, ElementRef, OnInit } from '@angular/core';
import { NgxMiniprofilerOverlayServiceConfig } from '../services/ngx-miniprofiler-overlay-config.service';

@Directive({ selector: '[frame]' })
export class FrameDirective implements OnInit {
  constructor(
    private elementRef: ElementRef,
    private config: NgxMiniprofilerOverlayServiceConfig,
    private changeDetector: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.elementRef.nativeElement.onload = () => {
      this.elementRef.nativeElement.contentWindow.document.addEventListener('keyup', (event: KeyboardEvent) => {
        if (this.config.overlayTrigger(event)) {
          this.config.isVisible = !this.config.isVisible;
          this.changeDetector.detectChanges();
        }
      });
    };
  }
}

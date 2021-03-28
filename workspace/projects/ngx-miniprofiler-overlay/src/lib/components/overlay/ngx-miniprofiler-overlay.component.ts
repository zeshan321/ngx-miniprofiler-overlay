import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnDestroy, OnInit, SecurityContext } from '@angular/core';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { NgxMiniprofilerOverlayService } from '../../services/ngx-miniprofiler-overlay.service';
import { ProfilerResponse } from '../../types/profiler-response';
import { FormControl } from '@angular/forms';
import { NgxMiniprofilerOverlayServiceConfig } from '../../services/ngx-miniprofiler-overlay-config.service';

@Component({
  selector: 'ngx-miniprofiler-overlay',
  templateUrl: 'ngx-miniprofiler-overlay.component.html',
  styleUrls: ['ngx-miniprofiler-overlay.scss']
})
export class NgxMiniprofilerOverlayComponent implements OnInit, OnDestroy {
  isVisible = false;
  search = new FormControl('');
  data: ProfilerResponse[] = [];
  responsesSubscription: Subscription | undefined;
  searchSubscription: Subscription | undefined;

  constructor(private service: NgxMiniprofilerOverlayService, private sanitizer: DomSanitizer, private config: NgxMiniprofilerOverlayServiceConfig) { }

  @HostListener('document:keyup.escape', ['$event'])
  onOverlayTriggered(): void {
    this.isVisible = !this.isVisible;
  }

  ngOnInit(): void {
    this.subscribeLookups();
  }

  onExpand(item: ProfilerResponse): void {
    item.IsLoaded = true;
    item.IsOpen = !item.IsOpen
  }

  trackById(index: number, item: ProfilerResponse): string {
    return item.Id;
  }

  private subscribeLookups(): void {
    this.responsesSubscription = this.service.getProfilerResponses()
      .pipe(map(item => {
        item.Url = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.config.api}/results?id=${item.Id}`);
        item.Colour = this.handleThresholds(item);
        return item;
      })).subscribe((result) => {
        this.addAndSort(result);
      });

    this.searchSubscription = this.search.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged())
      .subscribe((value: string) => {
        if (value?.trim().length > 0) {
          for (const item of this.data) {
            item.HasValue = JSON.stringify(item).toLowerCase().includes(value.toLowerCase());
          }

          return;
        }

        for (const item of this.data) {
          item.HasValue = false;
        }
      });
  }

  private addAndSort(val: ProfilerResponse): void {
    this.data.push(val);

    let i = this.data.length - 1;
    const item = this.data[i];

    while (i > 0 && item.Started > this.data[i - 1].Started) {
      this.data[i] = this.data[i - 1];
      i -= 1;
    }

    this.data[i] = item;
  }

  private handleThresholds(val: ProfilerResponse): string {
    if (this.config.thresholds?.good(val.DurationMilliseconds)) {
      return 'profiler-good';
    } else if (this.config.thresholds?.okay(val.DurationMilliseconds)) {
      return 'profiler-okay';
    } else if (this.config.thresholds?.bad(val.DurationMilliseconds)) {
      return 'profiler-bad';
    } else {
      return '';
    }
  }

  ngOnDestroy(): void {
    this.responsesSubscription?.unsubscribe();
    this.searchSubscription?.unsubscribe();
  }
}

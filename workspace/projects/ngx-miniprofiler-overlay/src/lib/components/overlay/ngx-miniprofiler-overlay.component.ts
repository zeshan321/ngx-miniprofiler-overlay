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
  search = new FormControl('');
  data: ProfilerResponse[] = [];
  colspan = 7;
  responsesSubscription: Subscription | undefined;
  searchSubscription: Subscription | undefined;

  constructor(
    private service: NgxMiniprofilerOverlayService,
    private sanitizer: DomSanitizer,
    private config: NgxMiniprofilerOverlayServiceConfig) { }

  @HostListener('document:keyup', ['$event'])
  onOverlayTriggered(event: KeyboardEvent): void {
    if (this.config.overlayTrigger(event)) {
      this.config.isVisible = !this.config.isVisible;
    }
  }

  ngOnInit(): void {
    if (!this.config.enableDuplicateDetection) {
      this.colspan--;
    }

    this.subscribeLookups();
  }

  onExpand(item: ProfilerResponse): void {
    item.IsLoaded = true;
    item.IsOpen = !item.IsOpen;
  }

  trackById(_: number, item: ProfilerResponse): string {
    return item.Id;
  }

  openNewTab(item: ProfilerResponse): void {
    item.IsOpen = !item.IsOpen;
    window.open(item.Url, '_blank');
  }

  private subscribeLookups(): void {
    this.responsesSubscription = this.service.getProfilerResponses()
      .pipe(map(item => {
        item.Url = `${this.config.api}/results?id=${item.Id}`;
        item.SafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(item.Url);
        item.Colour = this.handleThresholds(item.DurationMilliseconds);
        item.NumberOfSimilar = this.data.filter(c => c.Name === item.Name).length;
        this.gatherData(item);
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

  private handleThresholds(ms: number): string {
    if (this.config.thresholds?.good(ms)) {
      return 'profiler-good';
    } else if (this.config.thresholds?.okay(ms)) {
      return 'profiler-okay';
    } else if (this.config.thresholds?.bad(ms)) {
      return 'profiler-bad';
    } else {
      return '';
    }
  }

  private gatherData(item: ProfilerResponse): void {
    let duplicates = 0;
    let totalDuration = 0;

    const queries = new Set();
    JSON.stringify(item, (_, nestedValue) => {
      if (nestedValue) {
        const query = nestedValue.CommandString;
        const type = nestedValue.ExecuteType;
        const duration = nestedValue.DurationMilliseconds;

        if (query && !this.config.duplicateDetectionExclude.includes(type)) {
          totalDuration += duration;

          if (!queries.has(query)) {
            queries.add(query);
          } else {
            duplicates++;
          }
        }
      }

      return nestedValue;
    });

    if (this.config.enableDuplicateDetection) {
      item.Duplicates = duplicates;
    }

    const queriesCount = duplicates + queries.size;
    item.SqlCount = queriesCount;
    item.SqlDurationMilliseconds = Math.round(totalDuration * 10) / 10;
    item.SqlColour = this.handleThresholds(totalDuration);
  }

  ngOnDestroy(): void {
    this.responsesSubscription?.unsubscribe();
    this.searchSubscription?.unsubscribe();
  }
}

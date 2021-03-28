import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { NgxMiniprofilerOverlayInterceptor, NgxMiniprofilerOverlayModule, NgxMiniprofilerOverlayServiceConfig } from 'ngx-miniprofiler-overlay';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    CommonModule,
    FormsModule,
    NgxMiniprofilerOverlayModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'counter', component: CounterComponent },
      { path: 'fetch-data', component: FetchDataComponent },
    ]),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: NgxMiniprofilerOverlayInterceptor, multi: true },
    {
      provide: NgxMiniprofilerOverlayServiceConfig, useValue: {
        api: 'https://localhost:5001/mini-profiler-resources',
        overlayTrigger: (event: KeyboardEvent) => {
          return event.key === 'Escape';
        },
        matcher: ['*'],
        thresholds: {
          good: (ms: number) => { return ms < 1000; },
          okay: (ms: number) => { return ms < 3000; },
          bad: (ms: number) => { return ms > 3000; }
        }
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

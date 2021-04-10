# ngx-miniprofiler-overlay [![NPM version](https://img.shields.io/npm/v/ngx-miniprofiler-overlay.svg?style=flat)](https://www.npmjs.com/package/ngx-miniprofiler-overlay)
[MiniProfiler](https://miniprofiler.com/) overlay for Angular with high customizability.


## Demo
![ngx-miniprofiler-overlay demo](https://i.imgur.com/o0tVFrI.png)

## Setup
### Angular
Include the `ngx-miniprofiler-overlay` component in your entry component or where you want to render the results.
```javascript
<ngx-miniprofiler-overlay></ngx-miniprofiler-overlay>
```
Add the `NgxMiniprofilerOverlayModule` to your module imports and add the `HTTP_INTERCEPTORS` provider, `NgxMiniprofilerOverlayInterceptor` in your providers.
```javascript
@NgModule({
  imports: [
    NgxMiniprofilerOverlayModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: NgxMiniprofilerOverlayInterceptor, multi: true }
  ]
})
```

### .NET
Install [MiniProfiler](https://miniprofiler.com/) NuGet packages. For more information checkout [MiniProfiler](https://miniprofiler.com/)

The demo project uses (built with .NET Core and EntityFramework):
- MiniProfiler.AspNetCore.Mvc
- MiniProfiler.EntityFrameworkCore

Add MiniProfiler to your `ConfigureServices` in `Startup.cs`. Only add `AddEntityFramework()` if you'd like to see a breakdown of EntityFramework transactions.
```c#
services.AddMiniProfiler(options =>
{
    options.ColorScheme = StackExchange.Profiling.ColorScheme.Dark;
    options.EnableDebugMode = true;
}).AddEntityFramework();
```

Add MiniProfiler to your `Configure` in `Startup.cs`
```c#
app.UseMiniProfiler();
```

### Use
By default the `ngx-miniprofiler-overlay` overlay can be triggered by hitting escape on the component where it is registered and will hit the default endpoint `/mini-profiler-resources`.

## Configuration
To override the default configuration add `NgxMiniprofilerOverlayServiceConfig` to your providers.
```javascript
@NgModule({
  imports: [
    NgxMiniprofilerOverlayModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: NgxMiniprofilerOverlayInterceptor, multi: true },
    {
      provide: NgxMiniprofilerOverlayServiceConfig, useValue: {
        // Allows you to change the endpoint `ngx-miniprofiler-overlay` hits
        api: '/mini-profiler-resources',
        // Allows you to override the key that triggers the overlay
        overlayTrigger: (event: KeyboardEvent) => {
          return event.key === 'Escape';
        },
        // Allows you to include/exclude profiling information showing up on the UI
        // For example, the matcher below will include everything but endpoints ending with .js, .map and .css
        // Note: this will still fire requests to gather nessesscary information to stop requests to specific endpoints, update Miniprofiler options in backend
        matcher: ['*', '!*.js', '!*.map', '!*.css'],
        // Allows you to colour code duration times. If you `return false`, colour coding will be disabled
        thresholds: {
          good: (ms: number) => { return ms < 1000; },
          okay: (ms: number) => { return ms < 3000; },
          bad: (ms: number) => { return ms > 3000; }
        },
        // If enabled, duplicate SQL queries detection will be enabled
        enableDuplicateDetection: true,
        // Used to exclude 'queries' found duplicate detection
        duplicateDetectionExclude: ['Open', 'OpenAsync', 'Close', 'CloseAsync']
      }
    }
  ]
})
```

## Security
Since MiniProfiler displays SQL queries (if you have it enabled), it is recommended to have MiniProfiler and `ngx-miniprofiler-overlay` disabled in production.
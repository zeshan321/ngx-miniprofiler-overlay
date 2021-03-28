# ngx-miniprofiler-overlay [![NPM version](https://img.shields.io/npm/v/ngx-miniprofiler-overlay.svg?style=flat)](https://www.npmjs.com/package/ngx-miniprofiler-overlay)
[MiniProfiler](https://miniprofiler.com/) overlay for Angular with high customizability.


## Demo
![ngx-miniprofiler-overlay demo](https://i.imgur.com/9j7ZvhP.png)

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
Add MiniProfiler to your `ConfigureServices` in `Startup.cs`
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
        // Allows you to include/exclude profilering on spesific endpoints. Refer to the `matcher` package for more info
        matcher: ['*'],
        // Allows you to colour code duration times. If your `return false`, colour coding will be disabled
        thresholds: {
          good: (ms: number) => { return ms < 1000; },
          okay: (ms: number) => { return ms < 3000; },
          bad: (ms: number) => { return ms > 3000; }
        }
      }
    }
  ]
})
```
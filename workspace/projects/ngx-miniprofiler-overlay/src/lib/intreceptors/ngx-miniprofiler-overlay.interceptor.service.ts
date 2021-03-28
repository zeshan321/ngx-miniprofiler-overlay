import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpResponse, HttpRequest, HttpHandler, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NgxMiniprofilerOverlayService } from '../services/ngx-miniprofiler-overlay.service';
import { isMatch } from 'matcher';

@Injectable()
export class NgxMiniprofilerOverlayInterceptor implements HttpInterceptor {
  key = 'x-miniprofiler-ids';

  constructor(private service: NgxMiniprofilerOverlayService) { }

  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(httpRequest).pipe(tap((event) => {
      if (event.type === HttpEventType.Response || event instanceof HttpResponse) {
        const headers = event.headers.getAll(this.key);

        if (headers) {
          for (const header of headers) {
            const parsedHeader = JSON.parse(header) as string[];
            if (parsedHeader.length > 0) {
              this.service.handleIncomingIds(parsedHeader);
            }
          }
        }
      }
    }));
  }
}

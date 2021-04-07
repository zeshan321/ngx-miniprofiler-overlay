import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMiniprofilerOverlayComponent } from './components/overlay/ngx-miniprofiler-overlay.component';
import { FrameDirective } from './directives/frame.directive';
import { NgxMiniprofilerOverlayInterceptor } from './intreceptors/ngx-miniprofiler-overlay.interceptor.service';
import { NgxMiniprofilerOverlayServiceConfig } from './services/ngx-miniprofiler-overlay-config.service';
import { NgxMiniprofilerOverlayService } from './services/ngx-miniprofiler-overlay.service';

@NgModule({
  declarations: [
    NgxMiniprofilerOverlayComponent,
    FrameDirective
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    NgxMiniprofilerOverlayInterceptor,
    NgxMiniprofilerOverlayService,
    NgxMiniprofilerOverlayServiceConfig
  ],
  exports: [
    NgxMiniprofilerOverlayComponent
  ]
})
export class NgxMiniprofilerOverlayModule { }

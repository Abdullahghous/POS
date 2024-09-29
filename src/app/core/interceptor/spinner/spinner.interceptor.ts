import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { catchError, finalize, Observable, throwError } from 'rxjs';
import { SpinnerService } from '../../core.index';
import { LoadingService } from '../../service/allApi/loadingService';


@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {
  constructor(private spinner: SpinnerService,
    private loadingService: LoadingService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    //debugger
    this.loadingService.show();
    //debugger
    return next.handle(request).pipe(
      finalize(() => {
        this.loadingService.hide();
      }),
      catchError((error) => {
        if (error) {
          this.loadingService.hide();
        }
        return throwError(error);
      })
    );
  }
}

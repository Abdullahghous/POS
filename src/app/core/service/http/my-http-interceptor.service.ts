import { HttpRequest, HttpEvent, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { HttpService } from './http.service';

export function MyHttpInterceptorService(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  // console.log('%c Request intercepted: ', 'background: yellow; color: green', req);

  const apiService = inject(HttpService);
  const token = localStorage.getItem('accessToken');
  const reqWithHeader = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${token}`),
  });

  return next(reqWithHeader).pipe(
    catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return handle401Error(req, next, apiService);
      } else {
        return throwError(error);
      }
    })
  );
}

let isRefreshing = false;
const refreshTokenSubject: BehaviorSubject<unknown> = new BehaviorSubject<unknown>(null);
function handle401Error(req: HttpRequest<unknown>, next: HttpHandlerFn, apiService: HttpService) {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return apiService.renewToken().pipe(
      switchMap((obj:any) => {
        isRefreshing = false;
        localStorage.setItem('accessToken', obj.accessToken);
        refreshTokenSubject.next(obj.accessToken);
        req = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${obj.accessToken}`)
        });
        return next(req);
      }),
      catchError((err) => {
        isRefreshing = false;
        return throwError(err);
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter(token => token != null),
      take(1),
      switchMap(token => {
        req = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
        return next(req);
      })
    );
  }
}

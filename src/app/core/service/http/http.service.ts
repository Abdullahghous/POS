import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { lastValueFrom, Observable, Subject } from 'rxjs'
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Injectable()
export class HttpService {
    // currentLanguage = new BehaviorSubject<string>('en');
    // currentLanguage$ = this.currentLanguage.asObservable();
  
    // langData: any = null;
    // currentLang: string =  localStorage.getItem('lang') || 'en';

    // private apiUrl = 'http://45.8.148.212:8025/';
    // private apiUrl = 'http://45.8.148.212:8040/';
    // private apiUrl = 'http://localhost:8025/';
    private apiUrl = 'http://192.168.0.104:8025/';
  
    constructor(private http: HttpClient) {
    //   this.getLang();
    }
  
    // setLang(lang: string) {
    //   localStorage.setItem('lang', lang);
    //   this.currentLang = lang;
    //   this.currentLanguage.next(this.currentLang);
    //   this.getLang();
    // }

    // async getLang() {
    //   try {
    //   this.langData =  await (await this.getLocalFileLang()).json();
    //   } catch (error) {
    //   console.error('getLocalFileLang :: ', error);
    // }
    // }

    // getLocalFileLang() {
    //   const lang = localStorage.getItem('lang');
    //   let URL = '';
    //   if (lang) URL = `assets/lang/${lang}.json`;
    //   else URL = `assets/lang/en.json`;
    //   return fetch(URL);
    // }
  
    get<T>(endpoint: string, params?: HttpParams): Promise<T> {
      return lastValueFrom(this.http.get<T>(`${this.apiUrl}${endpoint}`, { params }));
    }
    // public get<T>( thisapiUrl: string , params?: unknown): Observable<T> {
    //   let headers = new HttpHeaders();
    //   const queryParams = this.prepareParams(params);
    //   headers = this.setHeaders(headers);
  
    //   return this.httpClient.get<T>(`${url}${queryParams}`, { headers });
    // }
    getObservable<T>(endpoint: string, params?: HttpParams): Observable<T> {
      return this.http.get<T>(`${this.apiUrl}${endpoint}`, { params });
    }
  
    post<T>(endpoint: string, body: any, options?: object): Observable<T> {
      return this.http.post<T>(`${this.apiUrl}${endpoint}`, body, options);
    }
    
    patch<T>(endpoint: string, body: any, options?: object): Observable<T> {
      return this.http.patch<T>(`${this.apiUrl}${endpoint}`, body, options);
    }
  
    put<T>(endpoint: string, body: any, options?: object): Observable<T> {
      return this.http.put<T>(`${this.apiUrl}${endpoint}`, body, options);
    }
  
    delete<T>(endpoint: string, options?: object): Observable<T> {
      return this.http.delete<T>(`${this.apiUrl}${endpoint}`, options);
    }
  
    // downloadFile(filePath: string): Observable<Blob> {
    //   const url = `${this.fileApiUrl}${filePath}`;
    //   return this.http.get(url, { responseType: 'blob' });
    // }
  
    // saveFile(blob: Blob, fileName: string): void {
    //   const link = document.createElement('a');
    //   link.href = window.URL.createObjectURL(blob);
    //   link.download = fileName;
    //   link.click();
    //   window.URL.revokeObjectURL(link.href);
    // }
  
    renewToken(): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}accessToken`, { refreshToken: localStorage.getItem('refreshToken') });
    }
  
}
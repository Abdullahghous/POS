import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs'
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Injectable()
export class HttpService {

    private baseUrl: string;
    private authToken: string | undefined | null;

    constructor(private http: HttpClient, private router: Router) {
        this.baseUrl = `${environment.PROTOCOL}://${environment.baseURL}/`;
    }

    private getHeaders(): HttpHeaders {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        this.authToken = sessionStorage.getItem("access_token");

        if (this.authToken) {
            // HttpHeaders are immutable, set() method returns new instance of HttpHeaders
            headers = headers.set('Authorization', `Bearer ${this.authToken}`);
        }

        return headers;
    }

    public onError(error: any): Promise<any> {
        if (error.status === 401 || error.status === 403) {
            this.router.navigate(['/login']);
        }
        return Promise.reject(error);
    }

    /**
     * Executes GET request for specified url.
     * @param url Url to execute.
     */
    get(url: string): Observable<any> {
        return this.http.get(`${this.baseUrl}${url}`, {
            headers: this.getHeaders()
        })
    }

    /**
     * Executes POST request with specified url and data
     * @param url Request Url.
     * @param data Post data.
     */
    post(url: string, data: any): Observable<any> {
        return this.http.post(`${this.baseUrl}${url}`, data, {
            headers: this.getHeaders()
        })
    }
}
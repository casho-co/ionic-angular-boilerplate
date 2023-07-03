import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';
import { Token } from '@angular/compiler';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly AUTH_TOKEN = 'AUTH_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';

  constructor(
    private _http: HttpClient,
    private _storageService: StorageService
  ) {}

  getToken(data: any): Observable<boolean> {
    return this._http
      .post<any>(`${environment.baseUrl}api/ashura/token/`, data)
      .pipe(
        tap((tokens) => this.storeTokens(tokens)),
        map((res) => {
          return true;
        }),
        catchError((error) => {
          return of(false);
        })
      );
  }

  refreshToken() {
    return this._http
      .post<any>(`${environment.baseUrl}api/ashura/token/refresh/`, {
        refresh: this.getRefreshToken(),
      })
      .pipe(
        tap((tokens) => {
          this.storeTokens(tokens);
        }),
        catchError((error) => {
          return of(false);
        })
      );
  }

  getAuthToken() {
    return this._storageService.getToken(this.AUTH_TOKEN);
  }

  private getRefreshToken() {
    return this._storageService.getToken(this.REFRESH_TOKEN);
  }

  private storeTokens(tokens: any) {
    this._storageService.setToken(this.AUTH_TOKEN, tokens.access);
    this._storageService.setToken(this.REFRESH_TOKEN, tokens.refresh);
  }

  private removeTokens() {
    this._storageService.removeToken(this.AUTH_TOKEN);
    this._storageService.removeToken(this.REFRESH_TOKEN);
  }
}

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
  private loggedUser?: string;

  constructor(
    private _http: HttpClient,
    private _router: Router,
    private _storageService: StorageService
  ) {}

  login(data: any): Observable<boolean> {
    return this._http.post<any>(`${environment.baseUrl}`, data).pipe(
      tap((tokens) => this.loginUser(data, tokens)),
      map((res) => {
        return res;
      }),
      catchError((error) => {
        alert(error.error);
        return of(false);
      })
    );
  }

  logout() {
    this.loggedUser = undefined;
    this.logoutUser();
  }

  isLoggedIn() {
    return !!this.getAuthToken();
  }

  refreshToken() {
    return this._http
      .post<any>(`${environment.baseUrl}`, {
        refreshToken: this.getRefreshToken(),
      })
      .pipe(
        tap((tokens) => {
          this.storeTokens(tokens);
        }),
        catchError((error) => {
          this.logoutUser();
          return of(false);
        })
      );
  }

  private loginUser(username?: string, tokens?: Token) {
    this.loggedUser = username;
    this.storeTokens(tokens);
  }

  private logoutUser() {
    this.loggedUser = undefined;
    this.removeTokens();
    this._router.navigate(['/']);
  }

  getAuthToken() {
    return this._storageService.getToken(this.AUTH_TOKEN);
  }

  private getRefreshToken() {
    return this._storageService.getToken(this.REFRESH_TOKEN);
  }

  private storeTokens(tokens: any) {
    this._storageService.setToken(this.AUTH_TOKEN, tokens.authToken);
    this._storageService.setToken(this.REFRESH_TOKEN, tokens.refreshToken);
  }

  private removeTokens() {
    this._storageService.removeToken(this.AUTH_TOKEN);
    this._storageService.removeToken(this.REFRESH_TOKEN);
  }
}

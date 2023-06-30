import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from './core/services/auth.service';
import { StorageService } from './core/services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'angular-boilerplate';
  loginForm!: FormGroup;
  isLoggedIn: boolean = false;
  username?: string;

  constructor(
    private _formBuilder: FormBuilder,
    private _http: HttpClient,
    private _authService: AuthService,
    private _storageService: StorageService
  ) {}

  ngOnInit() {
    this.username = this._authService.getLoggedInUsername();
    this.isLoggedIn = this._storageService.isAuthenticated();
    this.loginForm = this._formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    const loginDto = {
      username: this.loginForm.get('username')?.value,
      password: this.loginForm.get('password')?.value,
    };
    this._authService.login(loginDto).subscribe((x) => {
      console.log(x);
    });
  }
  signUp() {
    const body = {
      username: this.loginForm.get('username')?.value,
      password: this.loginForm.get('password')?.value,
    };
    this._http
      .post(`${environment.baseUrl}api/ashura/createuser/`, body)
      .subscribe((x) => {
        console.log(x);
      });
  }

  test() {
    this._http
      .post(`${environment.baseUrl}api/ashura/test/`, {})
      .subscribe((x) => {
        console.log(x);
      });
  }

  logout() {
    this._authService.logout();
  }
}

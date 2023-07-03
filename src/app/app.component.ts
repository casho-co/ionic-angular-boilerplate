import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
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

  constructor(
    private _http: HttpClient,
    private _authService: AuthService,
    private _storageService: StorageService
  ) {}

  ngOnInit() {}
  test() {
    this._http
      .post(`${environment.baseUrl}api/ashura/test/`, {})
      .subscribe((x) => {
        console.log(x);
      });
  }
}

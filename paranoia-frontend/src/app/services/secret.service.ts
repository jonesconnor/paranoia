import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface HelloWorldResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class SecretService {
  private apiUrl = 'http://localhost:8000/';

  constructor(private http: HttpClient) { }

  hello_world(): Observable<HelloWorldResponse> {
    return this.http.get<HelloWorldResponse>(this.apiUrl);
  }
}

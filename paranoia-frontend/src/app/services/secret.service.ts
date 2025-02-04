import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface HelloWorldResponse {
  message: string;
}

interface GetSecretResponse {
  secret: string;
}

interface ErrorResponse {
  detail: string;
}

interface GenerateUuidResponse {
  message: string;
  uuid: string;
}

@Injectable({
  providedIn: 'root'
})
export class SecretService {
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  hello_world(): Observable<HelloWorldResponse> {
    return this.http.get<HelloWorldResponse>(`${this.apiUrl}/`);
  }

  get_secret(uuid: string): Observable<GetSecretResponse> {
    return this.http.get<GetSecretResponse>(`${this.apiUrl}/getsecret/${uuid}`);
  }

  generate_uuid(secret: string): Observable<GenerateUuidResponse> {
    return this.http.post<GenerateUuidResponse>(`${this.apiUrl}/generateuuid`, { secret });
  }
}

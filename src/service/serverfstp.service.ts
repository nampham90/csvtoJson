import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccFstp } from 'src/model/accfstp'

@Injectable({
  providedIn: 'root'
})
export class ServerfstpService {
  url = 'http://localhost:4500/';
  key = "ServerFstp"
  constructor(
    private httpClient: HttpClient
  ) { }
  // dang nhap server fstp
  loginFstp(param: AccFstp): Observable<any> {
    return this.httpClient.post(`${this.url}loginfstp`,param);
  }

  // download file 
  downloadFile(data: any): Observable<any> {
    return this.httpClient.post(`${this.url}downloadfile`,data);
  }

  // download file sql downloadfilesql
  downloadFileSql(data: any): Observable<any> {
    return this.httpClient.post(`${this.url}downloadfilesql`,data);
  }

  getSessionStorage(): string | null {
    return sessionStorage.getItem(this.key);
  }

  setSessionStorage(value: string): void {
    sessionStorage.setItem(this.key, value);
  }

  clearSessionStorage(): void {
    sessionStorage.clear();
  }

  getAccountFstp(): AccFstp{
    let json = JSON.parse(this.getSessionStorage()!);
    let acc: AccFstp = {
        ip: json.ip,
        port: json.port,
        account: json.account,
        password: json.password
    }
    return acc;
}
}

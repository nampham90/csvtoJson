import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tsm180EntityModel } from 'src/model/tsm180';

@Injectable({
  providedIn: 'root'
})
export class Tsm180Service {

  constructor(
    private httpClient: HttpClient
  ) { }

  ListPosts(listData:any): Observable<any> {
    return this.httpClient.post('http://localhost:4500/listdata',listData);
  }
}

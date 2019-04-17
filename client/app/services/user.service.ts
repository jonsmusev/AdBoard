import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import {HttpParams, HttpClient} from "@angular/common/http";

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {

  private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
  private options = new RequestOptions({ headers: this.headers });
  private params = new HttpParams();

  constructor(
    private http: Http,
    private httpClient: HttpClient
  ) { }

  register(user): Observable<any> {
    return this.http.post('/api/user', JSON.stringify(user), this.options);
  }

  login(credentials): Observable<any> {
    return this.http.post('/api/login', JSON.stringify(credentials), this.options);
  }

  getUsers(): Observable<any> {
    return this.http.get('/api/users').map(res => res.json());
  }

  countUsers(): Observable<any> {
    return this.http.get('/api/users/count').map(res => res.json());
  }

  addUser(user): Observable<any> {
    return this.http.post('/api/user', JSON.stringify(user), this.options);
  }

  getUser(user): Observable<any> {
    return this.http.get(`/api/user/${user._id}`).map(res => res.json());
  }

  editUser(user): Observable<any> {
    return this.http.put(`/api/user/${user._id}`, JSON.stringify(user), this.options);
  }

  deleteUser(user): Observable<any> {
    return this.http.delete(`/api/user/${user._id}`, this.options);
  }

  // chat services
  sendMessage(messageContent): Observable<any> {
    return this.http.post('/api/im', JSON.stringify(messageContent), this.options);
  }

  getMessages(dialog): Observable<any> {
    return this.http.get(`/api/im2/${dialog}`).map(res => res.json());
  }

  newConversationStart(userId1, userId2) : Observable<any>{
    this.params = this.params.set("userId1", userId1);
    this.params = this.params.set("userId2", userId2);
    return this.httpClient.get(`/api/im/new`, {params:this.params});
  }

  getConversations(userId): Observable<any> {
    this.params = this.params.set("userId", userId);
    return this.httpClient.get(`/api/im2`, {params:this.params});
  }

}

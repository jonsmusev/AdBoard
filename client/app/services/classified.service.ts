import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class ClassifiedService {

  private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }


  getClassifieds(): Observable<any> {
    return this.http.get('/api/classifieds').map(res => res.json());
  }
/*
  countClassifieds(): Observable<any> {
    return this.http.get('/api/classifieds/count').map(res => res.json());
  }
*/
  addClassified(classified): Observable<any> {
    return this.http.post('/api/classified', JSON.stringify(classified), this.options);
  }
/*
  getClassified(classified): Observable<any> {
    return this.http.get(`/api/classified/${classified._id}`).map(res => res.json());
  }
*/
  editClassified(classified): Observable<any> {
    return this.http.put(`/api/classified/${classified._id}`, JSON.stringify(classified), this.options);
  }

  deleteClassified(classified): Observable<any> {
    return this.http.delete(`/api/classified/${classified._id}`, this.options);
  }

  searchClassifieds(search): Observable<any> {
    console.log(search);
    return this.http.get(`/api/classifieds/${search.searchRequest}`).map(res => res.json());
  }


 filterClassifieds(filter): Observable<any> {
 console.log(filter+ "фильтр");
 return this.http.get(`/api/classifieds/filter/${filter.hh}`).map(res => res.json());
 }

}

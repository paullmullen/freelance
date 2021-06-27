import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class QuotationsService {
  constructor(private http: HttpClient) {}

  getQuotation() {
    return this.http
      .get('https://quotes.rest/qod?category=inspire&language=en')
  }
}

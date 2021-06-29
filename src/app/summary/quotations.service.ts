import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class QuotationsService {
  constructor(private http: HttpClient) {}

  selectedQuotation: string;

  getQuotation() {
    try {
      this.selectedQuotation = localStorage.getItem('selectedQuotation');
      if (this.selectedQuotation === null) {
        this.selectedQuotation = 'inspire';
        localStorage.setItem('selectedQuotation', 'inspire');
      }
    } catch {
      this.selectedQuotation = 'inspire';
      localStorage.setItem('selectedQuotation', 'inspire');
    }
    return this.http
      .get('https://quotes.rest/qod?category=' + this.selectedQuotation + '&language=en')
  }

  getCategories() {
    return this.http
       .get('https://quotes.rest/qod/categories?')
  }
}


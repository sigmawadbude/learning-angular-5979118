import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { Product } from './product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsUrl = 'http://localhost:3000/products';

  http = inject(HttpClient);

  getProducts(): Observable<Product[]> {
    return this.http
      .get<Product[]>(this.productsUrl)
      .pipe(catchError(this.handleError));
  }

  getProduct(id: string): Observable<Product> {
    if (id === '0') {
      return of(this.initializeProduct());
    }
    const url = `${this.productsUrl}/${id}`;
    return this.http.get<Product>(url).pipe(catchError(this.handleError));
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    return throwError(() => errorMessage);
  }

  private initializeProduct(): Product {
    // Return an initialized object
    return {
      id: '',
      productName: '',
      productCode: '',
      tags: [''],
      releaseDate: '',
      price: 0,
      description: '',
      starRating: 0,
      imageUrl: '',
    };
  }
}

import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of, catchError, map } from 'rxjs';
import { Product, ProductResolved } from '../products/product';
import { ProductService } from '../products/product.service';

@Injectable({
  providedIn: 'root'
})
export class ProductResolver implements Resolve<ProductResolved> {
  constructor(private productService: ProductService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ProductResolved> {
    const id = route.paramMap.get('id');
    const isValidObjectId = id?.match(/^[a-f\d]{24}$/i);
    if (!id || !isValidObjectId) {
      this.router.navigate(['/products']);
      return of({product: null, message: 'Invalid Product Id'});
    }

    return this.productService.getProduct(id).pipe(
      map(product => ({product})),
      catchError(error => {
        console.error('Retrieval error:', error);
        this.router.navigate(['/products']);
        return of({product: null, message: 'Error retrieving product'});
      })
    );
  }
}

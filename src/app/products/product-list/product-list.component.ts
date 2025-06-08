import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { StarComponent } from '../../shared/star.component';
import { Product } from '../product';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../product.service';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';

@Component({
  imports: [StarComponent, FormsModule, RouterLink, CurrencyPipe, NgIf, NgFor],
  templateUrl: './product-list.component.html',
  styles: [
    `
      thead {
        color: #337ab7;
      }
    `,
  ],
})
export class ProductListComponent implements OnInit, OnDestroy {
  pageTitle = 'Product List';
  private _listFilter = '';
  showImage = false;
  imageWidth = 50;
  imageMargin = 2;
  errorMessage = '';
  sub = new Subscription();

  products: Product[] = [];
  filteredProducts: Product[] = [];

  productService = inject(ProductService);
  router = inject(Router);

  get listFilter() {
    return this._listFilter;
  }

  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredProducts = this.performFilter(value);
  }

  ngOnInit(): void {
    this.sub = this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = this.products;
      },
      error: (err) => (this.errorMessage = err),
    });
  }

  performFilter(filterBy: string) {
    filterBy = filterBy.toLocaleLowerCase().trim();
    return this.products.filter((p) =>
      p.productName.toLocaleLowerCase().includes(filterBy)
    );
  }

  toggleImage() {
    this.showImage = !this.showImage;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}

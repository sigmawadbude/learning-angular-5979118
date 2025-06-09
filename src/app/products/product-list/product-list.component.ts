import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { StarComponent } from '../../shared/star.component';
import { Product } from '../product';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../product.service';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CurrencyPipe } from '@angular/common';

@Component({
  imports: [StarComponent, FormsModule, RouterLink, CurrencyPipe],
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
  showImage = false;
  imageWidth = 50;
  imageMargin = 2;
  errorMessage = '';
  sub = new Subscription();

  productService = inject(ProductService);
  router = inject(Router);

  listFilter = signal<string>('');
  products = signal<Product[]>([]);
  filteredProducts = computed(() => {
    const filterBy = this.listFilter().toLocaleLowerCase().trim();
    return this.products().filter((p) =>
      p.productName.toLocaleLowerCase().includes(filterBy)
    );
  });

  ngOnInit(): void {
    this.sub = this.productService.getProducts().subscribe({
      next: (products) => this.products.set(products),
      error: (err) => (this.errorMessage = err),
    });
  }

  toggleImage() {
    this.showImage = !this.showImage;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}

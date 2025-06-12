import {
  Component,
  computed,
  inject,
  input,
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
  selector: 'app-product-list',
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
  showImage = signal(false);
  imageWidth = 50;
  imageMargin = 2;
  errorMessage = signal('');
  sub = new Subscription();

  productService = inject(ProductService);
  router = inject(Router);

  listFilter = input('', {
    transform: (value: string) => value.toLocaleLowerCase(),
  });
  products = signal<Product[]>([]);
  filteredProducts = computed(() =>
    this.products().filter((p) =>
      p.productName.toLocaleLowerCase().includes(this.listFilter())
    )
  );

  ngOnInit(): void {
    this.sub = this.productService.getProducts().subscribe({
      next: (products) => this.products.set(products),
      error: (err) => (this.errorMessage.set(err)),
    });
  }

  toggleImage() {
    this.showImage.set(!this.showImage());
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}

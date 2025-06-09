import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { StarComponent } from '../../shared/star.component';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, StarComponent, CurrencyPipe],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent {
  readonly errorMessage = signal('');
  readonly product = signal<Product | undefined>(undefined);

  readonly pageTitle = computed(() =>
    this.product()
      ? `Product Detail: ${this.product()?.productName}`
      : 'Product Detail'
  );

  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly productService = inject(ProductService);

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id');
    const isValidObjectId = param?.match(/^[a-f\d]{24}$/i);

    if (param && isValidObjectId) {
      this.getProduct(param);
    } else {
      this.errorMessage.set('Invalid product ID.');
    }
  }

  getProduct(id: string): void {
    this.errorMessage.set('');
    this.productService.getProduct(id).subscribe({
      next: (product) => this.product.set(product),
      error: (err: unknown) => {
        const message = err instanceof Error ? err.message : 'Unknown error';
        this.errorMessage.set(message);
      },
    });
  }

  onBack(): void {
    this.router.navigate(['/products']);
  }
}

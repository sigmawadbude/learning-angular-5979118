import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product, ProductResolved } from '../product';
import { ProductService } from '../product.service';
import { StarComponent } from '../../shared/star.component';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, StarComponent, CurrencyPipe],
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent implements OnInit {
  readonly errorMessage = signal('');
  readonly route = inject(ActivatedRoute);
  readonly product = signal<Product | null>(null);

  readonly pageTitle = computed(() =>
    this.product()
      ? `Product Detail: ${this.product()?.productName}`
      : 'Product Detail'
  );

  readonly router = inject(Router);
  readonly productService = inject(ProductService);

  showImage = signal(
    this.route.snapshot.queryParamMap.get('showImage') === 'true'
  );

  ngOnInit(): void {
    const resolvedData = this.route.snapshot.data[
      'resolvedData'
    ] as ProductResolved;
    this.product.set(resolvedData.product);
    this.errorMessage.set(resolvedData.error ?? '');
  }

  onBack(): void {
    this.router.navigate(['/products'], { queryParamsHandling: 'preserve' });
  }
}

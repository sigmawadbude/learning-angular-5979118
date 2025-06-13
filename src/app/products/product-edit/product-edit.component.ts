import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  signal,
  ViewChildren,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormControlName,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Product } from '../product';
import { debounceTime, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { GenericValidator } from '../../shared/generic-validator';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../product.service';
import { NumberValidators } from '../../shared/number.validator';
import { CommonModule } from '@angular/common';
import { APP_CONSTANTS } from '../../shared/constants';

@Component({
  selector: 'app-product-edit',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './product-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductEditComponent {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];
  pageTitle = signal('Product Edit');
  errorMessage = signal('');
  productForm!: FormGroup;

  product = signal<Product | null>(null);
  displayMessage = signal<{ [key: string]: string }>({});

  private sub!: Subscription;
  private validationSub!: Subscription;
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  readonly vm = computed(() => ({
    pageTitle: this.pageTitle(),
    errorMessage: this.errorMessage(),
    product: this.product(),
    displayMessage: this.displayMessage(),
  }));

  get tags(): FormArray {
    return this.productForm.get('tags') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {
    this.validationMessages = APP_CONSTANTS.PRODUCT_EDIT_ERR;

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      productName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      productCode: ['', Validators.required],
      starRating: ['', NumberValidators.range(1, 5)],
      tags: this.fb.array([]),
      description: '',
    });

    this.sub = this.route.paramMap.subscribe((params) => {
      const id = params.get('id') ?? '';
      this.getProduct(id);
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.validationSub?.unsubscribe();
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements.map(
      (formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur')
    );

    this.validationSub = merge(this.productForm.valueChanges, ...controlBlurs)
      .pipe(debounceTime(800))
      .subscribe(() => {
        this.displayMessage.set(
          this.genericValidator.processMessages(this.productForm)
        );
      });
  }

  addTag(): void {
    this.tags.push(new FormControl());
  }

  deleteTag(index: number): void {
    this.tags.removeAt(index);
    this.tags.markAsDirty();
  }

  getProduct(id: string): void {
    this.productService.getProduct(id).subscribe({
      next: (product: Product) => this.displayProduct(product),
      error: (err) => this.errorMessage.set(err),
    });
  }

  displayProduct(product: Product): void {
    if (this.productForm) this.productForm.reset();
    this.product.set(product);

    this.pageTitle.set(
      product.id === '0'
        ? 'Add Product'
        : `Edit Product: ${product.productName}`
    );

    this.productForm.patchValue({
      productName: product.productName,
      productCode: product.productCode,
      starRating: product.starRating,
      description: product.description,
    });
    this.productForm.setControl('tags', this.fb.array(product.tags || []));
  }

  deleteProduct(): void {
    if (this.product()?.id === '0') {
      this.onSaveComplete();
    } else if (
      this.product()?.id &&
      confirm(`Really delete the product: ${this.product()?.productName}?`)
    ) {
      this.productService.deleteProduct(this.product()!.id).subscribe({
        next: () => this.onSaveComplete(),
        error: (err) => this.errorMessage.set(err),
      });
    }
  }

  saveProduct(): void {
    if (this.productForm.valid) {
      if (this.productForm.dirty) {
        const p = { ...this.product(), ...this.productForm.value };

        const action = p.id
          ? this.productService.updateProduct(p)
          : this.productService.createProduct(p);
        action.subscribe({
          next: () => this.onSaveComplete(),
          error: (err) => this.errorMessage.set(err),
        });
      } else {
        this.onSaveComplete();
      }
    } else {
      this.errorMessage.set('Please correct the validation errors.');
    }
  }

  onSaveComplete(): void {
    this.productForm.reset();
    this.router.navigate(['/products']);
  }
}

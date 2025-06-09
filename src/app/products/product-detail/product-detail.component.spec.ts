import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProductDetailComponent } from './product-detail.component';
import { ProductService } from '../product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;
  let mockProductService: jasmine.SpyObj<ProductService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  const mockProduct = {
    id: '507f1f77bcf86cd799439011',
    productName: 'Test Product',
    productCode: 'TP-001',
    description: 'Description',
    releaseDate: '2023-01-01',
    price: 99.99,
    starRating: 4.5,
    tags: ['test'],
    imageUrl: 'test.jpg',
  };

  beforeEach(async () => {
    mockProductService = jasmine.createSpyObj('ProductService', ['getProduct']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue(mockProduct.id),
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [ProductDetailComponent],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
  });

  it('should fetch product on init when id is valid', fakeAsync(() => {
    mockProductService.getProduct.and.returnValue(of(mockProduct));
    
    component.ngOnInit();

    tick(); // simulate async passage of time
    
    expect(component.product()).toEqual(mockProduct);
    expect(component.errorMessage()).toBe('');
    expect(component.pageTitle()).toContain(mockProduct.productName);
  }));

  it('should set errorMessage for invalid id on init', () => {
    mockActivatedRoute.snapshot.paramMap.get.and.returnValue('invalid-id');

    component.ngOnInit();

    expect(component.errorMessage()).toBe('Invalid product ID.');
    expect(component.product()).toBeUndefined();
  });

  it('should set errorMessage and clear loading on getProduct error', fakeAsync(() => {
    const error = new Error('Failed to load product');
    mockProductService.getProduct.and.returnValue(throwError(() => error));

    component.getProduct(mockProduct.id);

    tick();

    expect(component.errorMessage()).toBe(error.message);
    expect(component.product()).toBeUndefined();
  }));

  it('should navigate back on onBack', () => {
    component.onBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/products']);
  });
});

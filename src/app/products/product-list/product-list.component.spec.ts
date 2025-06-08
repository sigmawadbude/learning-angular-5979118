import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListComponent } from './product-list.component';
import { ProductService } from '../product.service';
import { provideHttpClient } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { Product } from '../product';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let mockProductService: any;
  let mockRouter: any;

  const mockProducts: Product[] = [
    {
      id: '1',
      productName: 'Product A',
      productCode: '',
      tags: [''],
      releaseDate: '',
      price: 0,
      description: '',
      starRating: 0,
      imageUrl: '',
    },
    {
      id: '2',
      productName: 'Product B',
      productCode: '',
      tags: [''],
      releaseDate: '',
      price: 0,
      description: '',
      starRating: 0,
      imageUrl: '',
    },
  ];

  beforeEach(() => {
    mockProductService = {
      getProducts: jasmine
        .createSpy('getProducts')
        .and.returnValue(of(mockProducts)),
    };

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shoud update shoImage when toggleImage clicked', () => {
    const button = fixture.debugElement.query(By.css('.toggle-image'));

    if (button) {
      button.triggerEventHandler('click', null); // Simulate a click event
    }

    expect(component.showImage).toBe(false);
  })

  it('should toggle showImage when toggleImage is called', () => {
    component.showImage = false;
    component.toggleImage();
    expect(component.showImage).toBeTrue();
    component.toggleImage();
    expect(component.showImage).toBeFalse();
  });

  it('should load products and set filteredProducts on init', () => {
    component.ngOnInit();
    expect(component.products.length).toBe(2);
    expect(component.filteredProducts.length).toBe(2);
  });

  it('should handle error in getProducts', () => {
    mockProductService.getProducts.and.returnValue(throwError(() => 'Server error'));
    component.ngOnInit();
    expect(component.errorMessage).toBe('Server error');
  });

  it('should filter products by name when listFilter is set', () => {
    component.products = mockProducts;
    component.listFilter = 'product a';

    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].productName).toBe('Product A');
  });

  it('should unsubscribe on destroy', () => {
    const unsubscribeSpy = spyOn(component['sub'], 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('should return the current list filter value via the getter', () => {
  // Arrange
  component.listFilter = 'test-filter';

  // Act
  const result = component.listFilter;

  // Assert
  expect(result).toBe('test-filter');
});

});

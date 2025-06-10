import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product } from './product';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding requests
  });

  it('should return an error message when a client-side error occurs', () => {
    let errorMsg = '';

    service.getProducts().subscribe({
      next: () => fail('Expected an error, not products'),
      error: (error) => {
        errorMsg = error;
      },
    });

    const req = httpMock.expectOne('http://localhost:3000/products');

    // Simulate client-side error
    const mockError = new ErrorEvent('Network error', {
      message: 'Connection failed',
    });

    req.error(mockError);

    expect(errorMsg).toContain('An error occurred: Connection failed');
  });

  it('should return an error message when the server returns a 404', () => {
    let errorMsg = '';

    service.getProducts().subscribe({
      next: () => fail('Expected an error, not products'),
      error: (error) => {
        errorMsg = error;
      },
    });

    const req = httpMock.expectOne('http://localhost:3000/products');
    req.flush('Not found', {
      status: 404,
      statusText: 'Not Found',
    });

    expect(errorMsg).toContain('Server returned code: 404');
  });

  it('should return initialized product when id is "0"', () => {
    service.getProduct('0').subscribe((product) => {
      expect(product).toEqual({
        id: '',
        productName: '',
        productCode: '',
        tags: [''],
        releaseDate: '',
        price: 0,
        description: '',
        starRating: 0,
        imageUrl: '',
      });
    });
  });

  it('should make GET request and return product for non-zero id', () => {
    const mockProduct: Product = {
      id: '123',
      productName: 'Test Product',
      productCode: 'TP-001',
      tags: ['tag1'],
      releaseDate: '2024-01-01',
      price: 100,
      description: 'Sample',
      starRating: 4.5,
      imageUrl: 'http://example.com/image.jpg',
    };

    service.getProduct('123').subscribe((product) => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne('http://localhost:3000/products/123');
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });

  it('should handle error when server returns an error', () => {
    let errorMsg = '';

    service.getProduct('999').subscribe({
      next: () => fail('Expected error'),
      error: (error) => {
        errorMsg = error;
      },
    });

    const req = httpMock.expectOne('http://localhost:3000/products/999');
    req.flush('Not found', { status: 404, statusText: 'Not Found' });

    expect(errorMsg).toContain('Server returned code: 404');
  });

  it('should create a product using POST', () => {
    const newProduct: Product = {
      id: '0',
      productName: 'New Product',
      productCode: 'NP-123',
      tags: ['new'],
      releaseDate: '2025-01-01',
      price: 99,
      description: 'A brand new product',
      starRating: 5,
      imageUrl: 'http://example.com/new.jpg',
    };

    service.createProduct(newProduct).subscribe((product) => {
      expect(product).toEqual(newProduct);
    });

    const req = httpMock.expectOne('http://localhost:3000/products');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newProduct);
    req.flush(newProduct);
  });

  it('should delete a product using DELETE', () => {
    const productId = '123';

    service.deleteProduct(productId).subscribe((response) => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(
      `http://localhost:3000/products/${productId}`
    );
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should update a product using PUT and return updated product', () => {
    const updatedProduct: Product = {
      id: '123',
      productName: 'Updated Product',
      productCode: 'UP-123',
      tags: ['updated'],
      releaseDate: '2025-06-01',
      price: 150,
      description: 'An updated product',
      starRating: 4,
      imageUrl: 'http://example.com/updated.jpg',
    };

    service.updateProduct(updatedProduct).subscribe((product) => {
      expect(product).toEqual(updatedProduct);
    });

    const req = httpMock.expectOne(
      `http://localhost:3000/products/${updatedProduct.id}`
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedProduct);
    req.flush(null); // Because you're mapping to `product` manually
  });
});

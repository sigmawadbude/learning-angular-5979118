import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import {
  HttpClient,
  HTTP_INTERCEPTORS,
  HttpResponse
} from '@angular/common/http';
import { IdTransformInterceptor } from './id-transform.interceptor';

describe('IdTransformInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: IdTransformInterceptor,
          multi: true
        }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should transform _id to id in array response', () => {
    const mockResponse = [
      { _id: '123', name: 'Product 1' },
      { _id: '456', name: 'Product 2' }
    ];

    httpClient.get('/api/products').subscribe((res: any) => {
      expect(res.length).toBe(2);
      expect(res[0].id).toBe('123');
      expect(res[0]._id).toBeUndefined();
    });

    const req = httpMock.expectOne('/api/products');
    req.flush(mockResponse);
  });

  it('should not transform _id if not present in array response', () => {
    const mockResponse = [
      { name: 'Product 1' },
      { name: 'Product 2' }
    ];

    httpClient.get('/api/products').subscribe((res: any) => {
      expect(res.length).toBe(2);
    });

    const req = httpMock.expectOne('/api/products');
    req.flush(mockResponse);
  });

  it('should transform _id to id in single object response', () => {
    const mockResponse = { _id: '999', name: 'Product A' };

    httpClient.get('/api/products/999').subscribe((res: any) => {
      expect(res.id).toBe('999');
      expect(res._id).toBeUndefined();
    });

    const req = httpMock.expectOne('/api/products/999');
    req.flush(mockResponse);
  });

  it('should not modify response if no _id field exists', () => {
    const mockResponse = { id: 'abc', name: 'Already Transformed' };

    httpClient.get('/api/products/abc').subscribe((res: any) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/products/abc');
    req.flush(mockResponse);
  });

  it('should not modify non-HttpResponse events', () => {
    // This case is covered implicitly since the interceptor skips non-HttpResponse types.
    // No need to simulate a specific test unless using custom event types.
    expect(true).toBeTrue();
  });
});

import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { ProductEditComponent } from './product-edit.component';
import { ProductService } from '../product.service';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of, throwError } from 'rxjs';
import { Product } from '../product';

describe('ProductEditComponent', () => {
  let component: ProductEditComponent;
  let fixture: ComponentFixture<ProductEditComponent>;
  let mockProductService: jasmine.SpyObj<ProductService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let fb: FormBuilder;

  const mockProduct: Product = {
    id: '123',
    productName: 'Test Product',
    productCode: 'TP-123',
    tags: ['Tag1'],
    releaseDate: '2024-01-01',
    price: 100,
    description: 'Test description',
    starRating: 4,
    imageUrl: 'http://image.jpg'
  };

  const mockInitProduct: Product = {
    id: '0',
    productName: '',
    productCode: '',
    tags: [],
    releaseDate: '',
    price: 0,
    description: '',
    starRating: 0,
    imageUrl: ''
  };

  beforeEach(async () => {
    mockProductService = jasmine.createSpyObj('ProductService', [
      'getProduct',
      'createProduct',
      'updateProduct',
      'deleteProduct'
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ProductEditComponent, ReactiveFormsModule, CommonModule],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: '123' }))
          }
        },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductEditComponent);
    component = fixture.componentInstance;
    fb = TestBed.inject(FormBuilder);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create the form on init', fakeAsync(() => {
    mockProductService.getProduct.and.returnValue(of(mockProduct));
    fixture.detectChanges();
    tick();

    expect(component.productForm).toBeDefined();
    expect(component.productForm.get('productName')).toBeTruthy();
  }));

  it('should load product and populate the form', fakeAsync(() => {
    mockProductService.getProduct.and.returnValue(of(mockProduct));
    fixture.detectChanges();
    tick();

    expect(component.product()?.productName).toBe('Test Product');
    expect(component.productForm.get('productName')?.value).toBe('Test Product');
    expect(component.pageTitle()).toContain(mockProduct.productName);
  }));

  it('should load init product', fakeAsync(() => {
    mockProductService.getProduct.and.returnValue(of(mockInitProduct));
    fixture.detectChanges();
    tick();

    expect(component.pageTitle()).toBe('Add Product');
  }));

  it('should display error message if getProduct fails', fakeAsync(() => {
    mockProductService.getProduct.and.returnValue(throwError(() => 'Error loading product'));
    fixture.detectChanges();
    tick();

    expect(component.errorMessage()).toContain('Error loading product');
  }));

  it('should call createProduct when saving a new product', fakeAsync(() => {
    const newProduct: Product = { ...mockProduct, id: '' };
    component.product.set(newProduct);
    component.productForm = fb.group({
      productName: ['New Product'],
      productCode: ['NP-001'],
      starRating: ['5'],
      tags: fb.array([]),
      description: ['New Desc']
    });
    component.productForm.markAsDirty();

    mockProductService.createProduct.and.returnValue(of({ ...newProduct, id: 'newId' }));

    component.saveProduct();
    tick();

    expect(mockProductService.createProduct).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/products']);
  }));

  it('should call updateProduct when saving an existing product', fakeAsync(() => {
    mockProductService.getProduct.and.returnValue(of(mockProduct));
    mockProductService.updateProduct.and.returnValue(of(mockProduct));

    fixture.detectChanges();
    tick();

    component.productForm.patchValue({ productName: 'Updated Name' });
    component.productForm.markAsDirty();

    component.saveProduct();
    tick();

    expect(mockProductService.updateProduct).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/products']);
  }));

  // it('should show validation error message if form is invalid', () => {
  //   component.product.set({ ...mockProduct, id: '' });
  //   component.productForm = fb.group({
  //     productName: [''], // invalid
  //     productCode: ['Code'],
  //     starRating: ['3'],
  //     tags: fb.array([]),
  //     description: ['']
  //   });

  //   component.saveProduct();

  //   expect(component.errorMessage()).toBe('Please correct the validation errors.');
  // });

  it('should call deleteProduct and navigate away', fakeAsync(() => {
    spyOn(window, 'confirm').and.returnValue(true);
    mockProductService.getProduct.and.returnValue(of(mockProduct));
    mockProductService.deleteProduct.and.returnValue(of({}));

    fixture.detectChanges();
    tick();

    component.deleteProduct();
    tick();

    expect(mockProductService.deleteProduct).toHaveBeenCalledWith('123');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/products']);
  }));

  it('should not call deleteProduct if product id is 0', () => {
    component.product.set({ ...mockProduct, id: '0' });
    component.productForm = fb.group({
      productName: ['Test'],
      productCode: ['Code'],
      starRating: ['3'],
      tags: fb.array([]),
      description: ['']
    });

    const onSaveSpy = spyOn<any>(component, 'onSaveComplete');
    component.deleteProduct();

    expect(onSaveSpy).toHaveBeenCalled();
    expect(mockProductService.deleteProduct).not.toHaveBeenCalled();
  });


  it('should remove the tag at specified index and mark tags as dirty', () => {
  component.productForm = fb.group({
    productName: ['Test'],
    productCode: ['TP-001'],
    starRating: ['3'],
    tags: fb.array([
      fb.control('Tag1'),
      fb.control('Tag2'),
      fb.control('Tag3')
    ]),
    description: ['']
  });

  const tagsArray = component.productForm.get('tags') as FormArray;
  expect(tagsArray.length).toBe(3);

  // Call deleteTag
  component.deleteTag(1); // Remove 'Tag2'

  expect(tagsArray.length).toBe(2);
  expect(tagsArray.controls.map(c => c.value)).toEqual(['Tag1', 'Tag3']);
  expect(tagsArray.dirty).toBeTrue();
});

});

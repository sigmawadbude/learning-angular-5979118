import { Component, signal } from '@angular/core';
import { ProductListComponent } from './product-list/product-list.component';
import { FormsModule } from '@angular/forms';
import { ProductFilterComponent } from './product-filter/product-filter.component';

@Component({
  imports: [ProductListComponent, ProductFilterComponent, FormsModule],
  template: `<div class="card">
    <div class="card-header">
      {{ pageTitle }}
    </div>
    <div class="card-body">
      <app-product-filter [(filter)]="listFilter"/>
      <app-product-list [listFilter]="listFilter" />
    </div>
  </div>`,
})
export class ProductShellComponent {
  pageTitle = 'Product List';
  listFilter = "";
}

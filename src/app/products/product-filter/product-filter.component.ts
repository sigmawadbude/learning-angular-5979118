import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-filter',
  imports: [FormsModule],
  template: `<div class="row">
      <div class="col-md-2">Filter by:</div>
      <div class="col-md-4">
        <input
          type="text"
          class="form-control"
          name="filter"
          placeholder="Search products..."
          [(ngModel)]="filter"
        />
      </div>
    </div>
    @if(filter()) {
    <div class="row">
      <div class="col-md-6">
        <h4>Filtered by: {{ filter() }}</h4>
      </div>
    </div>
    }`,
})
export class ProductFilterComponent {
  // Use Angular signal to store input value
  filter = model('');
}

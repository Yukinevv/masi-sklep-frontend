import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.css']
})
export class ProductFilterComponent {
  filter: string = '';

  @Output() filterByNameChange = new EventEmitter<string>();
  @Output() sortChange = new EventEmitter<string>();
  @Output() filterByCategoryChange = new EventEmitter<string>();

  onFilterByNameChange() {
    this.filterByNameChange.emit(this.filter);
  }

  sort(direction: string) {
    this.sortChange.emit(direction);
  }

  onFilterByCategoryChange(category: string) {
    this.filterByCategoryChange.emit(category);
  }
}

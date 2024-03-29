import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.css']
})
export class ProductFilterComponent {
  filter: string = '';

  @Output() filterChange = new EventEmitter<string>();
  @Output() sortChange = new EventEmitter<string>();

  onFilterChange() {
    this.filterChange.emit(this.filter);
  }

  sort(direction: string) {
    this.sortChange.emit(direction);
  }
}

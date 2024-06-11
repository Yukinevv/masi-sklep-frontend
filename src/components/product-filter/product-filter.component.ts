import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.css']
})
export class ProductFilterComponent {
  /**
   * The filter string used for filtering products by name.
   * @type {string}
   */
  filter: string = '';

  /**
   * Event emitted when the filter by name changes.
   * @type {EventEmitter<string>}
   */
  @Output() filterByNameChange = new EventEmitter<string>();

  /**
   * Event emitted when the sort direction changes.
   * @type {EventEmitter<string>}
   */
  @Output() sortChange = new EventEmitter<string>();

  /**
   * Emits the filterByNameChange event with the current filter value.
   */
  onFilterByNameChange(): void {
    this.filterByNameChange.emit(this.filter);
  }

  /**
   * Emits the sortChange event with the specified sort direction.
   *
   * @param {string} direction - The direction to sort the products ('asc' or 'desc').
   */
  sort(direction: string): void {
    this.sortChange.emit(direction);
  }
}

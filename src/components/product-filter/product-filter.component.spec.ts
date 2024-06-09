import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductFilterComponent } from './product-filter.component';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ProductFilterComponent', () => {
    let component: ProductFilterComponent;
    let fixture: ComponentFixture<ProductFilterComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ProductFilterComponent],
            imports: [
                FormsModule,
                MatButtonModule,
                NoopAnimationsModule
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProductFilterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should emit filterByNameChange event when filter input changes', () => {
        spyOn(component.filterByNameChange, 'emit');

        const input = fixture.debugElement.query(By.css('.filter-input')).nativeElement;
        input.value = 'Test Filter';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(component.filterByNameChange.emit).toHaveBeenCalledWith('Test Filter');
    });

    it('should emit sortChange event with "asc" when sort ascending button is clicked', () => {
        spyOn(component.sortChange, 'emit');

        const sortAscButton = fixture.debugElement.query(By.css('.sort-buttons button:nth-child(1)')).nativeElement;
        sortAscButton.click();
        fixture.detectChanges();

        expect(component.sortChange.emit).toHaveBeenCalledWith('asc');
    });

    it('should emit sortChange event with "desc" when sort descending button is clicked', () => {
        spyOn(component.sortChange, 'emit');

        const sortDescButton = fixture.debugElement.query(By.css('.sort-buttons button:nth-child(2)')).nativeElement;
        sortDescButton.click();
        fixture.detectChanges();

        expect(component.sortChange.emit).toHaveBeenCalledWith('desc');
    });
});

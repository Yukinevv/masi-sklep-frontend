import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrdersComponent } from './orders.component';
import { OrderService } from '../../services/order.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Order } from '../../modules/Order';

describe('OrdersComponent', () => {
    let component: OrdersComponent;
    let fixture: ComponentFixture<OrdersComponent>;
    let orderServiceMock: any;

    beforeEach(async () => {
        orderServiceMock = {
            listOrders: jasmine.createSpy('listOrders').and.returnValue(of([]))
        };

        await TestBed.configureTestingModule({
            declarations: [OrdersComponent],
            imports: [
                MatCardModule,
                MatButtonModule,
                NoopAnimationsModule
            ],
            providers: [
                { provide: OrderService, useValue: orderServiceMock }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(OrdersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should fetch orders on init', () => {
        const orders: Order[] = [
            { orderId: 1, date: '2023-06-01', products: [{ productId: 1, name: 'Product 1', description: 'Desc 1', quantity: 1, price: 100 }] },
            { orderId: 2, date: '2023-06-02', products: [{ productId: 2, name: 'Product 2', description: 'Desc 2', quantity: 2, price: 200 }] }
        ];
        orderServiceMock.listOrders.and.returnValue(of(orders));

        component.ngOnInit();
        fixture.detectChanges();

        expect(component.orders.length).toBe(2);
        expect(component.orders).toEqual(orders);
    });

    it('should handle error when fetching orders', () => {
        const consoleSpy = spyOn(console, 'error');
        orderServiceMock.listOrders.and.returnValue(throwError('Error fetching orders'));

        component.ngOnInit();
        fixture.detectChanges();

        expect(component.orders.length).toBe(0);
        expect(consoleSpy).toHaveBeenCalledWith('Error fetching orders:', 'Error fetching orders');
    });

    it('should sort orders by date ascending', () => {
        component.orders = [
            { orderId: 2, date: '2023-06-02', products: [{ productId: 2, name: 'Product 2', description: 'Desc 2', quantity: 2, price: 200 }] },
            { orderId: 1, date: '2023-06-01', products: [{ productId: 1, name: 'Product 1', description: 'Desc 1', quantity: 1, price: 100 }] }
        ];

        component.sortOrders('asc');
        fixture.detectChanges();

        expect(component.orders[0].orderId).toBe(1);
        expect(component.orders[1].orderId).toBe(2);
    });

    it('should sort orders by date descending', () => {
        component.orders = [
            { orderId: 1, date: '2023-06-01', products: [{ productId: 1, name: 'Product 1', description: 'Desc 1', quantity: 1, price: 100 }] },
            { orderId: 2, date: '2023-06-02', products: [{ productId: 2, name: 'Product 2', description: 'Desc 2', quantity: 2, price: 200 }] }
        ];

        component.sortOrders('desc');
        fixture.detectChanges();

        expect(component.orders[0].orderId).toBe(2);
        expect(component.orders[1].orderId).toBe(1);
    });

    it('should display no orders message when there are no orders', () => {
        component.orders = [];
        fixture.detectChanges();

        const noOrdersMessage = fixture.debugElement.query(By.css('.no-orders-message'));
        expect(noOrdersMessage).toBeTruthy();
        expect(noOrdersMessage.nativeElement.textContent).toContain('Brak zamówień.');
    });

    it('should display orders when there are orders', () => {
        component.orders = [
            { orderId: 1, date: '2023-06-01', products: [{ productId: 1, name: 'Product 1', description: 'Desc 1', quantity: 1, price: 100 }] }
        ];
        fixture.detectChanges();

        const orderCards = fixture.debugElement.queryAll(By.css('.order-card'));
        expect(orderCards.length).toBe(1);
        expect(orderCards[0].nativeElement.textContent).toContain('Zamówienie 1 z dnia 2023-06-01');
    });
});

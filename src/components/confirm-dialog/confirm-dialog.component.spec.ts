import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ConfirmDialogComponent', () => {
    let component: ConfirmDialogComponent;
    let fixture: ComponentFixture<ConfirmDialogComponent>;
    let dialogRefMock: any;

    beforeEach(async () => {
        dialogRefMock = jasmine.createSpyObj('MatDialogRef', ['close']);

        await TestBed.configureTestingModule({
            declarations: [ConfirmDialogComponent],
            imports: [NoopAnimationsModule], // Dodano do obsługi animacji w testach
            providers: [
                { provide: MatDialogRef, useValue: dialogRefMock }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfirmDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should close dialog with true when onConfirm is called', () => {
        component.onConfirm();
        expect(dialogRefMock.close).toHaveBeenCalledWith(true);
    });

    it('should close dialog with false when onDismiss is called', () => {
        component.onDismiss();
        expect(dialogRefMock.close).toHaveBeenCalledWith(false);
    });

    it('should call onConfirm when confirm button is clicked', () => {
        spyOn(component, 'onConfirm');
        const button = fixture.debugElement.query(By.css('.confirm-button')); // Zakładamy, że przycisk ma klasę 'confirm-button'
        button.nativeElement.click();
        expect(component.onConfirm).toHaveBeenCalled();
    });

    it('should call onDismiss when dismiss button is clicked', () => {
        spyOn(component, 'onDismiss');
        const button = fixture.debugElement.query(By.css('.cancel-button')); // Zakładamy, że przycisk ma klasę 'cancel-button'
        button.nativeElement.click();
        expect(component.onDismiss).toHaveBeenCalled();
    });
});

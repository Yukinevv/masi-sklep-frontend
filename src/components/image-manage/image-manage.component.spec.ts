import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ImageManageComponent } from './image-manage.component';
import { By } from '@angular/platform-browser';

describe('ImageManageComponent', () => {
    let component: ImageManageComponent;
    let fixture: ComponentFixture<ImageManageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ImageManageComponent],
            imports: [FormsModule] // Dodane
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ImageManageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should convert file to base64 and emit event', (done) => {
        const base64Stub = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA';
        const file = new Blob(['file content'], { type: 'image/png' }) as File;
        const input = fixture.debugElement.query(By.css('.file-input')).nativeElement;

        spyOn(component.base64Event, 'emit');
        spyOn(component as any, 'convertImageToBase64').and.returnValue(Promise.resolve(base64Stub));

        input.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));

        component.onFileSelected({ target: { files: [file] } });

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(component.base64String).toBe(base64Stub);
            expect(component.base64Event.emit).toHaveBeenCalledWith(base64Stub);
            done();
        });
    });
});

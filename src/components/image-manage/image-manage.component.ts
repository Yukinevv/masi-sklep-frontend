import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-image-manage',
  templateUrl: './image-manage.component.html',
  styleUrl: './image-manage.component.css'
})
export class ImageManageComponent {
  @Output() base64Event = new EventEmitter<string>();
  base64String: string = ''

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.convertImageToBase64(file).then(base64 => {
        this.base64Event.emit(base64);
        this.base64String = base64;
      });
    }
  }

  private convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
}

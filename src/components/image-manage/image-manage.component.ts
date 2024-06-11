import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-image-manage',
  templateUrl: './image-manage.component.html',
  styleUrls: ['./image-manage.component.css']
})
export class ImageManageComponent {
  /**
   * Event emitted when an image is converted to a base64 string.
   * @type {EventEmitter<string>}
   */
  @Output() base64Event = new EventEmitter<string>();

  /**
   * Holds the base64 string representation of the selected image.
   * @type {string}
   */
  base64String: string = '';

  /**
   * Handles the file input change event.
   * Converts the selected file to a base64 string and emits the base64Event.
   *
   * @param {Event} event - The file input change event.
   */
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.convertImageToBase64(file).then(base64 => {
        this.base64Event.emit(base64);
        this.base64String = base64;
      });
    }
  }

  /**
   * Converts an image file to a base64 string.
   *
   * @param {File} file - The image file to convert.
   * @returns {Promise<string>} A promise that resolves with the base64 string of the image.
   */
  private convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
}

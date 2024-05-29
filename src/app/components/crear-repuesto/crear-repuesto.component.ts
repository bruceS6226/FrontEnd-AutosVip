import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-crear-repuesto',
  templateUrl: './crear-repuesto.component.html',
  styleUrls: ['./crear-repuesto.component.css']
})
export class CrearRepuestoComponent {
  imageUploadForm: FormGroup = this.fb.group({
    images: this.fb.array([this.createImageGroup()])
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.imageUploadForm = this.fb.group({
      images: this.fb.array([this.createImageGroup()])
    });
  }

  createImageGroup(): FormGroup {
    return this.fb.group({
      file: null,
      previewUrl: ''
    });
  }

  get images(): FormArray {
    return this.imageUploadForm.get('images') as FormArray;
  }

  addImage(): void {
    if (this.images.length < 5) {
      this.images.push(this.createImageGroup());
    }
  }

  removeImage(index: number): void {
    if (this.images.length > 1) {
      this.images.removeAt(index);
    }
  }

  onFileChange(event: Event, index: number): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.images.at(index).get('previewUrl')!.setValue(e.target.result);
      };
      reader.readAsDataURL(file);
      this.images.at(index).get('file')!.setValue(file);
    }
  }

  onSubmit(): void {
    console.log(this.imageUploadForm.value);
  }

  allImagesSelected(): boolean {
    return this.images.controls.every(control => control.get('file')!.value !== null);
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BooksService } from 'src/app/services/books.service';
import { IBook } from 'src/app/models/book.model';
import { FileUpload } from 'src/app/models/fileUpload.model';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.sass']
})
export class BookFormComponent implements OnInit {

  bookForm: FormGroup;
  currentFileUpload?: FileUpload;
  percentage = 0;
  fileIsUploading = false;
  fileUploaded = false;
  fileUrl: string;

  constructor(private booksService: BooksService, 
              private router: Router,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      synopsis: ''
    });
  }

  onSaveBook() {
    const title = this.bookForm.get('title').value;
    const author = this.bookForm.get('author').value;
    const synopsis = this.bookForm.get('synopsis').value;
    const newBook: IBook = {
      title: title,
      author: author,
      synopsis: synopsis,
    };
    
    if(this.fileUrl && this.fileUrl !== '') {
      newBook.urlPicture = this.fileUrl;
    }
    this.booksService.createNewBook(newBook);
    this.router.navigate(['/books']);
  }

  onUpload(file: File): void {
      if (file) {         
        this.currentFileUpload = new FileUpload(file);
        this.booksService.pushFileToStorage(this.currentFileUpload).subscribe(
          (downloadURL) => {
            this.fileIsUploading = true;
            if(downloadURL.state == 'success') {
              downloadURL.ref.getDownloadURL().then((url)=> {
                this.fileUrl = url;
              })
            }
          },
          error => {
            throw new Error;
          },
          () => {
            this.fileIsUploading = false;
            this.fileUploaded = true;
          }
        );
      }
  }

  detectFiles(event): void {
    this.onUpload(event.target.files[0]);
  }
}

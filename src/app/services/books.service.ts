import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { DataSnapshot } from '@angular/fire/database/interfaces';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable, Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { IBook } from 'src/app/models/book.model';
import { FileUpload } from 'src/app/models/fileUpload.model';

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  private books: IBook[] = [];
  booksSubject = new Subject<IBook[]>();
  dbpath = '/books';
  private basePath = '/uploads';

  constructor(private db: AngularFireDatabase, private firestorage: AngularFireStorage) { 
    this.getBooks();
  }

  emitBooks() {
    this.booksSubject.next(this.books);
  }

  saveBooks() {
    this.db.database.ref(this.dbpath).set(this.books);
  }

  getBooks() {
    this.db.database.ref(this.dbpath).on('value', (data: DataSnapshot) => {
      this.books = data.val() ? data.val() : [];
      this.emitBooks();
    });
  }

  getSingleBook(id: number) {
    return new Promise( (resolve, reject) => {
      this.db.database.ref(this.dbpath + '/'+ id).once('value').then(
        (data: DataSnapshot) => {
          resolve(data.val());
        },
        (error) => {
          reject(error);
        }
      );
    }); 
  }

  /** Add book on local array and save it in db, emit book to update observerarray  **/ 
  createNewBook(book: IBook) {
    this.books.push(book);
    this.saveBooks();
    this.emitBooks();
  }

  /** Remove a book from Db and from file storage **/ 
  removeBook(book: IBook) {
    if(book.urlPicture) {
      this.firestorage.storage.refFromURL(`${book.urlPicture}`).delete().then(
        () => {
          // console.log('delete !!!!');
        },
        (error) => {
          throw new Error;
        }
      );
    }

    const bookIndex = this.books.findIndex( (bookEl) => {
      if(bookEl == book) {
        return true;
      }
    });
    this.books.splice(bookIndex, 1);
    this.saveBooks();
    this.emitBooks();
  }


  pushFileToStorage(fileUpload: FileUpload) {
    const randomId = Math.random().toString(36).substring(2);
    const filePath = `${this.basePath}/${randomId + fileUpload.file.name}`;
    const storageRef = this.firestorage.ref(filePath);
    const uploadTask = this.firestorage.upload(filePath, fileUpload.file);

   return uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          fileUpload.url = downloadURL;
          fileUpload.name = fileUpload.file.name;
          // this.saveFileData(fileUpload);
        });
      })
    );
  }

  /** if saving file himself in database but here already save in saveBooks() function **/
  // private saveFileData(fileUpload: FileUpload): void {
  //   this.db.list(this.basePath).push(fileUpload);
  // }

  /** Get Image to display in single book view **/ 
  getImage(imgName): Observable<any> {
    return this.firestorage.refFromURL(imgName).getDownloadURL();
  }
}


import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IBook } from 'src/app/models/book.model';
import { BooksService } from '../services/books.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.sass']
})
export class BookListComponent implements OnInit, OnDestroy {

  books: IBook[];
  booksSubscribption: Subscription; 

  constructor(private bookService: BooksService, private router: Router ) { }

  ngOnInit(): void {
    this.booksSubscribption = this.bookService.booksSubject.subscribe(
      (books) => {
        this.books = books;
      }
    );
    this.bookService.emitBooks();
  }

  onNewBook() {
    this.router.navigate(['/books','new']);
  }

  onDeleteBook(book: IBook) {
    this.bookService.removeBook(book);
  }

  onViewBook(id: number) {
    this.router.navigate(['/books', 'view', id]);
  }

  ngOnDestroy() {
    this.booksSubscribption.unsubscribe();
  }

}

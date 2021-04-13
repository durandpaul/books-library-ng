import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BooksService } from 'src/app/services/books.service';
import { IBook } from 'src/app/models/book.model';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-single-book',
  templateUrl: './single-book.component.html',
  styleUrls: ['./single-book.component.sass']
})
export class SingleBookComponent implements OnInit {

  book: IBook; 
  picture: any;
  constructor(private booksService: BooksService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.booksService.getSingleBook(+id).then(
      (book: IBook) => {
        this.book = book;
        if(this.book.urlPicture) {
          console.log(this.book.urlPicture);
          this.picture = this.booksService.getImage(this.book.urlPicture);
        }
      }
    );
  }

  onBack() {
    this.router.navigate(['/books']);
  }

}

import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {

  isAuth: boolean;

  constructor(private authService: AuthService, private fireAuth: AngularFireAuth) { }

  ngOnInit(): void {
    this.fireAuth.onAuthStateChanged(
      (user) => {
        if(user) {
          console.log('onAuthStateChanged', true);
          this.isAuth = true;
        } else {
          console.log('onAuthStateChanged', false);
          this.isAuth = false;
        }
      }
    )
  }

  onSignOut() {
    console.log('onSignOut');
    this.authService.signOutUser();
  }

}

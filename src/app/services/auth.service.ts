import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private fireAuth: AngularFireAuth) { }

  createNewUser(user) {
    return this.fireAuth.createUserWithEmailAndPassword(user.email, user.password).then(
      (user) => {
        console.log('user created');
      },
      (error) => {
        throw new error;
      }
    );
  }

  signInUser(user) {
    return this.fireAuth.signInWithEmailAndPassword(user.email, user.password).then(
      (user) => {
        console.log('user connected');
      },
      (error) => {
        throw new error;
      }
    )
  }

  signOutUser() {
    this.fireAuth.signOut();
  }
}

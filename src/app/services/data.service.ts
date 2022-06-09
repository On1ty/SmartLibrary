import { Injectable } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private firestore: Firestore
  ) { }

  getBooks() {
    const booksRef = collection(this.firestore, 'books');
    return collectionData(booksRef);
  }

  getUsers() {
    const usersRef = collection(this.firestore, 'users');
    return collectionData(usersRef);
  }
}

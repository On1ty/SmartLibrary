import { Injectable } from '@angular/core';
import { collection, collectionData, doc, docData, Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private firestore: Firestore
  ) { }

  testConnection() {
    const testConnectionRef = collection(this.firestore, 'test_connection');
    return collectionData(testConnectionRef);
  }

  getBooks() {
    const booksRef = collection(this.firestore, 'books');
    return collectionData(booksRef, { idField: 'id' });
  }

  getUsers() {
    const usersRef = collection(this.firestore, 'users');
    return collectionData(usersRef);
  }

  // getBooksById(id) {
  //   const booksDocRef = doc(this.firestore, `books/${id}`);
  //   return docData(booksDocRef, { idField: 'id' });
  // }
}

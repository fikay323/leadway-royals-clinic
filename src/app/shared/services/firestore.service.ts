import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class FirestoreService {
  private destroy$ = new Subject<void>();
  private subscriptions: Subscription[] = [];

  constructor(private afs: AngularFirestore) {}

  listenToCollection<T>(path: string, queryFn?: any): Observable<T[]> {
    const collection = this.afs.collection<T>(path, queryFn);
    const observable = collection.valueChanges().pipe(takeUntil(this.destroy$));
    const subscription = observable.subscribe(); // Subscribe immediately
    this.subscriptions.push(subscription); // Store the subscription
    return observable;
  }

  listenToDocument<T>(path: string): Observable<T | undefined> {
      const document = this.afs.doc<T>(path);
      const observable = document.valueChanges().pipe(takeUntil(this.destroy$));
      const subscription = observable.subscribe();// Subscribe immediately
      this.subscriptions.push(subscription);// Store the subscription
      return observable;
  }

  stopAllListeners() {
    this.destroy$.next(); // Signal completion to all takeUntil pipes
    this.destroy$.complete(); // Complete the subject
    this.subscriptions.forEach(sub => sub.unsubscribe()); // Unsubscribe from stored subscriptions
    this.subscriptions = []; // Clear the subscription array
    this.destroy$ = new Subject<void>(); // Create a new subject for future listeners
  }
}
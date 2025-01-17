import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';
import { from, Observable, Subject, takeUntil } from 'rxjs';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class RecordMaanagementService {
  private destroy$ = new Subject<void>();
  doctors$: Observable<any[]>

  constructor(
    private firestoreService: FirestoreService
  ) { }

  getDoctorsAndTheirSchedule() {
    this.doctors$ = this.firestoreService.listenToCollection('doctors').pipe(takeUntil(this.destroy$))
  }
}

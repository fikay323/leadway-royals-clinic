import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecordMaanagementService {
  doctors$: Observable<any[]>

  constructor(
    private afs: AngularFirestore,
    private authService: AuthService
  ) { }

  getDoctorsAndTheirSchedule() {
    this.doctors$ = this.afs.collection('doctors').valueChanges()
  }
}

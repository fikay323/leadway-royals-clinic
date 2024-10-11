import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  readonly BREAK_POINT = 1024;
  private _isMobile$ = new BehaviorSubject<boolean>(window.innerWidth <= this.BREAK_POINT);
  isMobile$ = this._isMobile$.asObservable();

  constructor() { }
}

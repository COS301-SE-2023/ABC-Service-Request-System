import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class NavbarService {
  private collapsedSubject = new BehaviorSubject<boolean>(false);
  collapsed$ = this.collapsedSubject.asObservable();

  setCollapsedState(collapsed: boolean): void {
    this.collapsedSubject.next(collapsed);
  }

  getCollapsedState(): boolean {
    return this.collapsedSubject.getValue();
  }
}

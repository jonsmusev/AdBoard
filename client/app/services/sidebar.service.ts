import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class SidebarService {

  private sidebarStateSource = new BehaviorSubject<any>({});
  currentSidebarState = this.sidebarStateSource.asObservable();

  constructor() { }

  changeSidebarData(sidebarState: {}) {
    this.sidebarStateSource.next(sidebarState)
  }

}

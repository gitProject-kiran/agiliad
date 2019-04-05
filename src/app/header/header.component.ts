import { Component, OnInit } from '@angular/core';
import { SidenavService } from 'src/app/shared/services/sidenav.service';
import { LoginService } from 'src/app/shared/services/login.service';
import { Observable, Subscription } from 'rxjs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isVerticalMenu: boolean;
  watcher: Subscription;

  constructor(
    private sidenav: SidenavService,
    private login: LoginService,
    private media: MediaObserver) {
    this.watcher = media.media$.subscribe((change: MediaChange) => {
      if (change.mqAlias === 'sm' || change.mqAlias === 'xs') {
        this.isVerticalMenu = true;
      } else {
        this.isVerticalMenu = false;
      }
    });
  }

  toggleActive: boolean = false;

  toggleRightSidenav() {
    this.toggleActive = !this.toggleActive;
    this.sidenav.toggle();
  }
}

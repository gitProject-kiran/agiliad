import { Component, OnInit } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { SidenavService } from 'src/app/shared/services/sidenav.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  opened = true;
  over = 'side';
  expandHeight = '42px';
  collapseHeight = '42px';
  displayMode = 'flat';
  @ViewChild('sidenav') public sidenav: MatSidenav;
  // overlap = false;

  watcher: Subscription;

  constructor(media: MediaObserver, private sidenavService: SidenavService) {
    this.watcher = media.media$.subscribe((change: MediaChange) => {
      if (change.mqAlias === 'sm' || change.mqAlias === 'xs') {
        this.opened = false;
        this.over = 'over';
      } else {
        this.opened = true;
        this.over = 'side';
      }
    });
  }

  ngOnInit() {
    this.sidenavService.setSidenav(this.sidenav);
  }

}

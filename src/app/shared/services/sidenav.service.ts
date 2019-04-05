import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {

  constructor() { }

  static sidenav: MatSidenav;

	public setSidenav(sidenav: MatSidenav) {
		SidenavService.sidenav = sidenav;
  }
  
  public toggle(): void {
		SidenavService.sidenav.toggle();
	}
}

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalComponent implements OnInit {
  @Input() dialogClass: string;
  @Input() headerClass: string;
  @Input() hideHeader: boolean = false;
  @Input() hideFooter: boolean = false;
  @Input() closeBackdrop: boolean = true;
  public visible = false;
  public visibleAnimate = false;

  constructor(){}

  ngOnInit(){

  }

  public show(): void {
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true, 100);
  }

  public hide(): void {
    this.visibleAnimate = false;
    setTimeout(() => this.visible = false, 300);
  }

  public onContainerClicked(event: MouseEvent): void {
    if(this.closeBackdrop){
      if ((<HTMLElement>event.target).classList.contains('modal')) {
        this.hide();
      }
    }
  }

}

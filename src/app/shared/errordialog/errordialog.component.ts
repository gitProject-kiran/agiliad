import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material'

@Component({
  selector: 'app-errordialog',
  templateUrl: './errordialog.component.html',
  styleUrls: ['./errordialog.component.scss']
})
export class ErrordialogComponent implements OnInit {

  title = 'Angular-Interceptor';
  constructor(@Inject(MAT_DIALOG_DATA) public data: string) {}

  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

export interface Product {
  name: string;
  sound: string;
}

export interface Tile {
  text: String;
  cols: number;
  rows: number;
  color: String;
}

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.scss']
})
export class AddProductsComponent implements OnInit {

  productControl = new FormControl('', [Validators.required]);
  selectFormControl = new FormControl('', Validators.required);
  products: Product[] = [
    {name: 'LG', sound: 'Woof!'},
    {name: 'SONY', sound: 'Meow!'},
    {name: 'SAMSUNG', sound: 'Moo!'},
    {name: 'RELIEF', sound: 'Wa-pa-pa-pa-pa-pa-pow!'},
  ];
  tiles = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      console.log("====> matches", matches);
      if(matches){
        return [
          {text: 'One', cols: 1, rows: 1, color: 'lightblue'},
          {text: 'Two', cols: 1, rows: 1, color: 'lightgreen'},
          {text: 'Three', cols: 1, rows: 1, color: 'lightpink'},
          {text: 'Four', cols: 1, rows: 1, color: '#DDBDF1'},
        ];
      } 

      return [
        {text: 'One', cols: 1, rows: 1, color: 'lightblue'},
        {text: 'Two', cols: 1, rows: 1, color: 'lightgreen'},
        {text: 'Three', cols: 1, rows: 1, color: 'lightpink'},
        {text: 'Four', cols: 1, rows: 1, color: '#DDBDF1'},
      ];
    })
  );

  constructor(private breakpointObserver: BreakpointObserver) { }

  ngOnInit() {
  }

}

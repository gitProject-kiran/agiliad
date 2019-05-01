import { Component, OnInit } from '@angular/core';
import { ProductManagementService } from '../_service/product-management.service';
import _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss']
})
export class OrderConfirmationComponent implements OnInit {
  custAddress: Object;
  productDetails = [];
  constructor(
    private route: ActivatedRoute,
    private productManagementService: ProductManagementService,
  ) {
    this.route.queryParams
      .subscribe(params => {
        console.log("params.order", params.order)
        this.productManagementService.getInvoiceDetails(params.order).subscribe(
          res => {
            this.custAddress = res['customer_info'][0];
            this.productDetails = res['productDetails'];
          }, er => {
    
          })
      });    
  }

  ngOnInit() {
  }

  getGst(gstRate, price) {
    return (price * gstRate) / 100;
  }

  getPrice(price, cgst, sgst){
    let c = (price * cgst) / 100;
    let s = (price * sgst) / 100;
    return price - c - s;
  }

  rowTotal(product) {
    return product['price'] * product['quantity'];
  }

  getTotal() {
    let total = 0;
    for (var i = 0; i < _.size(this.productDetails); i++) {
      total = total + (this.productDetails[i].price * this.productDetails[i].quantity);
    }
    return total;
  }

  convertNumberToWords(amount) {
    var words = new Array();
    words[0] = '';
    words[1] = 'One';
    words[2] = 'Two';
    words[3] = 'Three';
    words[4] = 'Four';
    words[5] = 'Five';
    words[6] = 'Six';
    words[7] = 'Seven';
    words[8] = 'Eight';
    words[9] = 'Nine';
    words[10] = 'Ten';
    words[11] = 'Eleven';
    words[12] = 'Twelve';
    words[13] = 'Thirteen';
    words[14] = 'Fourteen';
    words[15] = 'Fifteen';
    words[16] = 'Sixteen';
    words[17] = 'Seventeen';
    words[18] = 'Eighteen';
    words[19] = 'Nineteen';
    words[20] = 'Twenty';
    words[30] = 'Thirty';
    words[40] = 'Forty';
    words[50] = 'Fifty';
    words[60] = 'Sixty';
    words[70] = 'Seventy';
    words[80] = 'Eighty';
    words[90] = 'Ninety';
    amount = amount.toString();
    var atemp = amount.split(".");
    var number = atemp[0].split(",").join("");
    var n_length = number.length;
    var words_string = "";
    if (n_length <= 9) {
      var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
      var received_n_array = new Array();
      for (var i = 0; i < n_length; i++) {
        received_n_array[i] = number.substr(i, 1);
      }
      for (var i = 9 - n_length, j = 0; i < 9; i++ , j++) {
        n_array[i] = received_n_array[j];
      }
      for (var i = 0, j = 1; i < 9; i++ , j++) {
        if (i == 0 || i == 2 || i == 4 || i == 7) {
          if (n_array[i] == 1) {
            let val = n_array[j];
            n_array[j] = 10 + parseInt(val.toString());
            n_array[i] = 0;
          }
        }
      }
      let value;
      for (var i = 0; i < 9; i++) {
        if (i == 0 || i == 2 || i == 4 || i == 7) {
          value = n_array[i] * 10;
        } else {
          value = n_array[i];
        }
        if (value != 0) {
          words_string += words[value] + " ";
        }
        if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
          words_string += "Crores ";
        }
        if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
          words_string += "Lakhs ";
        }
        if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
          words_string += "Thousand ";
        }
        if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
          words_string += "Hundred and ";
        } else if (i == 6 && value != 0) {
          words_string += "Hundred ";
        }
      }
      words_string = words_string.split("  ").join(" ");
    }
    return words_string;
  }
  getAmountInWords() {
    return this.convertNumberToWords(this.getTotal());

  }
  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=' + window.innerHeight + 'px,width=' + window.innerWidth + 'px');
    popupWin.document.open();
    popupWin.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <title>Ashmita</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
        <style>
            .border {
                border: 1px solid !important;
                height: 91.7%;
            }
    
            P {
                margin-bottom: 0;
            }
    
            .f-family {
                font-family: monospace;
            }
    
            .owner-add {
                border-right: 1px solid;
                border-bottom: 1px solid;
            }
    
            .bb {
                border-bottom: 1px solid;
            }
    
            .br {
                border-right: 1px solid;
            }
    
            .table {
                border-top: 1px solid;
                border-bottom: 1px solid;
                height: calc(100vh - 49vh);
            }
    
            table tr {
                border-top: 1px solid;
            }
    
            .row-height {
                line-height: 20px;
                height: 20px !important;
            }
    
            tr td:not(:first-child),
            tr th:not(:first-child) {
                border-left: 1px solid;
            }
    
            body,
            html {
                height: 100%
            }
        </style>
    </head>
    
    <body onload="window.print();window.close()">
    
    ${printContents}
    
    </body>
    
    </html>`
    );
    popupWin.document.close();
  }

}

import { Component, OnInit,AfterViewInit } from '@angular/core';
import { HttpHandlerService } from 'src/app/services/http-handler.service';

@Component({
  selector: 'app-admin-dash',
  templateUrl: './admin-dash.component.html',
  styleUrls: ['./admin-dash.component.scss']
})
export class AdminDashComponent implements AfterViewInit {
  orders:any;
  suppliers:any;
  constructor(
    private httpHandler:HttpHandlerService
  ) { 
    this.httpHandler.ordersHandler().subscribe((data:any) => {
      this.orders=data.orders;
      console.log(this.orders)
    })
    this.httpHandler.suppliersHandler().subscribe((data:any) => {
      this.suppliers = data.supplier;
      console.log(this.suppliers)
    })
  }

  ngAfterViewInit(): void {
    console.log(this.suppliers)
  }

}

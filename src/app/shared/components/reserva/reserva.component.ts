import { Component, OnInit } from '@angular/core';
import { Reservas } from 'app/models/reservas';
@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.scss']
})
export class ReservaComponent implements OnInit {

  reserva: Reservas;
  token: any;
  constructor() {
    
    this.token = JSON.parse(localStorage.getItem("reserva") + '');
    this.reserva = new Reservas(0, '', '', '', '', '', '', this.token.id, '', '', '', '', '', '');
  }

  ngOnInit() {
  }

  onSubmit(form){
    console.log(this.reserva);
  }

}

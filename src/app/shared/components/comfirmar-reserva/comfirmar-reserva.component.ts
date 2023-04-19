import { Component, OnInit } from '@angular/core';
import { ReservaService } from '@shared/services/reserva.service';
import { Reservas } from 'app/models/reservas';

@Component({
  selector: 'app-comfirmar-reserva',
  templateUrl: './comfirmar-reserva.component.html',
  styleUrls: ['./comfirmar-reserva.component.scss'],
  providers: [ReservaService]
})
export class ComfirmarReservaComponent implements OnInit {

  reservas : Reservas;
  datos:any = [];
  constructor(private _reservaService: ReservaService) {
    this.reservas = new Reservas(0,'','','','','','','','','','','','','',0);
    this._reservaService.getAllReservas(this.reservas).subscribe(
      response => {
        this.datos = response;
        console.log(this.datos)
      }
    )


   }

  ngOnInit() {
  }

}

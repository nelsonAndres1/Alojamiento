import { Component, OnInit } from '@angular/core';
import { Taraloja } from 'app/models/taraloja';
import { TaralojaService } from '@shared/services/taraloja.service';
import { TiposalojaService } from '@shared/services/tiposloja.service';
import Swal from 'sweetalert2';
import { Tiposaloja } from 'app/models/tiposaloja';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  providers: [TaralojaService, TiposalojaService]
})
export class FooterComponent implements OnInit {

  disponibles: number;
  array_disponibles: any = [];
  taraloja: Taraloja;
  tiposaloja: Tiposaloja;
  usuario_logeado: any;
  usuario: any;
  tipaloja: any = [];
  datos_taraloja: any = [];
  constructor(private _taralojaService: TaralojaService, private _tiposalojaService: TiposalojaService, private _router: Router,) {

    this.tiposaloja_service();

  }

  ngOnInit() {
  }

  seleccion(seleccion: any) {
    this.array_disponibles = [];
    console.log(seleccion);
    this.disponibles = seleccion.disponibles;

    for (let index = 0; index < this.disponibles; index++) {
      this.array_disponibles.push(seleccion);
    }
    console.log(this.array_disponibles);
  }
  tarifas(id) {
    this._taralojaService.getTarifas({ 'id': id }).subscribe(
      response => {
        console.log(response);


        Swal.fire({
          title: '<strong><u>Tarifas</u></strong>',
          icon: 'info',
          html:
            'Las tarifas se ajustan segun la <b>categoria</b>, ' +
            '<br>' +
            '<strong>Tarifa A: $</strong>' + response.tarA + '<br>' +
            '<strong>Tarifa B: $</strong>' + response.tarB + '<br>' +
            '<strong>Tarifa C: $</strong>' + response.tarC + '<br>' +
            '<strong>Tarifa D: $</strong>' + response.tarD + '<br>' +
            '<strong>Tarifa E: $</strong>' + response.tarE,
          showCloseButton: true,
          showCancelButton: false,
          focusConfirm: false,
          confirmButtonText:
            '<i class="fa fa-thumbs-up"></i> Ok!',
        })

      }
    )
  }

  tiposaloja_service() {
    this._tiposalojaService.getAll({}).subscribe(
      response => {
        this.tipaloja = response;
        console.log(response);
      }
    );
  }

  reservas(res){
/* 
        const navigationExtras: NavigationExtras = {
            queryParams: {
                result: JSON.stringify(numero)
            }
        } */
        localStorage.setItem('reserva', JSON.stringify(res));


    this._router.navigate(['reserva']);
    console.log(res);
  }

}

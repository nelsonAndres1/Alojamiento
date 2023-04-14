import { Component, Input, OnInit } from '@angular/core';
import { Taraloja } from 'app/models/taraloja';
import { TaralojaService } from '@shared/services/taraloja.service';
import { TiposalojaService } from '@shared/services/tiposloja.service';
import Swal from 'sweetalert2';
import { Tiposaloja } from 'app/models/tiposaloja';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { ReservaService } from '@shared/services/reserva.service';
import { ICarouselItem } from '@shared/components/carousel/Icarousel-item.metadata';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  providers: [TaralojaService, TiposalojaService, ReservaService]
})
export class FooterComponent implements OnInit {

  @Input() height = 500;
  @Input() isFullScreen = false;
  @Input() items: ICarouselItem[] = [];

  disponibles: number;
  array_disponibles: any = [];
  array_disponibles_final: any = [];
  taraloja: Taraloja;
  tiposaloja: Tiposaloja;
  usuario_logeado: any;
  usuario: any;
  tipaloja: any = [];
  datos_taraloja: any = [];
  src:any='assets/images/3.jpeg'
  public currentPosition = 0;

  public finalHeight: string | number = 0;
  constructor(private _taralojaService: TaralojaService, private _tiposalojaService: TiposalojaService, private _reservaService: ReservaService, private _router: Router,) {
    this.tiposaloja_service();
    this.finalHeight = this.isFullScreen ? '100vh' : `${this.height}px`;
  }

  ngOnInit() { }
  seleccion(seleccion: any) {
    this.array_disponibles = [];
    this.disponibles = seleccion.disponibles;
    this._reservaService.getAll_tiposalojaId(new Tiposaloja(seleccion.id, '', '', '', '', 0, '', '')).subscribe(
      response => {
        this.array_disponibles = response;
        console.log("prueba!!!!");
        console.log(this.array_disponibles);
      }, error => {
        Swal.fire('Error', 'No existen datos!' + error.message, 'error');
      }

    );
  }

  setNext() {
    console.log("ahh!");
    let finalPercentage = 0;
    let nextPosition = this.currentPosition + 1;
    if (nextPosition <= this.items.length - 1) {
      finalPercentage = -100 * nextPosition;
    } else {
      nextPosition = 0;
    }
    this.items.find(i => i.id === 0).marginLeft = finalPercentage;
    this.currentPosition = nextPosition;
  }

  setBack() {
    let finalPercentage = 0;
    let backPosition = this.currentPosition - 1;
    if (backPosition >= 0) {
      finalPercentage = -100 * backPosition;
    } else {
      backPosition = this.items.length - 1;
      finalPercentage = -100 * backPosition;
    }
    this.items.find(i => i.id === 0).marginLeft = finalPercentage;
    this.currentPosition = backPosition;

  }


  enviar(arreglo) {
    let posiciones = [];
    if (arreglo.length > 0) {
      for (let index = 0; index < arreglo.length; index++) {
        posiciones.push(index);
      }
    }
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
      }
    );
  }

  reservas(res) {
    localStorage.setItem('reserva', JSON.stringify(res));
    this._router.navigate(['reserva']);
  }
}

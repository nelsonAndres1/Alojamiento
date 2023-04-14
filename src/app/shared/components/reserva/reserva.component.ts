import { Component, OnInit } from '@angular/core';
import { Reservas } from 'app/models/reservas';
import * as moment from 'moment'
import Swal from 'sweetalert2';
import { Subsi15Service } from '@shared/services/subsi15.service';
import { ReservaService } from '@shared/services/reserva.service';
import { TaralojaService } from '@shared/services/taraloja.service';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.scss'],
  providers: [Subsi15Service, ReservaService, TaralojaService]
})
export class ReservaComponent implements OnInit {

  reserva: Reservas;
  token: any;
  week: any = [
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado",
    "Domingo"
  ];
  monthSelect: any[];
  dateSelect: any;
  dateValue: any = '';
  dateValueFinal: any = '';
  opcion: any = [32];
  valores: any;
  valor: any;
  fechas_reservadas: any = [];
  fechas_reservadas_arreglo: any = [];
  dias: any = [];
  meses: any = [];
  anos: any = [];
  mes_selec: any;
  ano_selec: any;
  constructor(private subsi15Service: Subsi15Service, private _reservaService: ReservaService, private _taralojaService: TaralojaService) {

    this.token = JSON.parse(localStorage.getItem("reserva") + '');
    console.log("token");
    console.log(this.token);
    this.reserva = new Reservas(0, '', '', '', '', '', '', this.token.id, '', '', '', '', '', '', this.token.numero);
    this._reservaService.verificarReservas(this.reserva).subscribe(
      response => {
        console.log("respuestaaaaa!");
        console.log(response);
        this.fechas_reservadas = response;
        this.asignarDias();
      }
    );
    this._taralojaService.getTarifa(this.reserva).subscribe(
      response => {
        this.valores = response;
      }
    );
  }

  ngOnInit() {
    let date: Date = new Date();
    let mes = date.getMonth() + 1;
    this.mes_selec = mes;
    let año = date.getFullYear();
    this.ano_selec = año;
    this.getDaysFromDate(mes, año)
  }

  busqueda() {
    this.subsi15Service.getCategoria(this.reserva).subscribe(
      response => {
        if (response.bandera) {
          this.reserva.nombres = response.nombres;
          this.reserva.apellidos = response.apellidos;
          this.reserva.categoria = response.codcat;
          this.valor = this.valores[response.codcat];
        } else {
          this.reserva = new Reservas(0, '', '', '', '', '', '', this.token.id, '', '', '', '', '', '', this.token.numero);
        }
      }
    )
  }
  onSubmit(form) {
/*     if (this.dateValue != '' || this.dateValueFinal != '') { */
     /*  if (this.dateValue <= this.dateValueFinal) { */
/*         this.reserva.fecha_ini = this.dateValue;
        this.reserva.fecha_fin = this.dateValueFinal; */
        this._reservaService.register(this.reserva).subscribe(
          response => {
            if (response.status == 'success') {
              Swal.fire(
                'Ok!',
                'Reserva realizada con exito!',
                'success'
              );
            } else {
              Swal.fire(
                'Error!',
                'Reserva No realizada!' + '<br>' +
                'Verifique sus datos',
                'error'
              );
            }
          }, error => {
            Swal.fire(
              'Error!',
              'Reserva No realizada!' + '<br>' +
              'Verifique sus datos',
              'error'
            );
          }
        );
      /* } else {
        this.dateValue = '';
        this.dateValueFinal = '';
        Swal.fire(
          'Error',
          'la fecha final no puede ser menor a la inicial!, verifique las fechas.',
          'error'
        )
      } */
    /* } else {
      Swal.fire(
        'Error',
        'Fechas vacias, favor verificar!',
        'error'
      )
    } */
  }

  getDaysFromDate(month, year) {
    const startDate = moment(`${year}/${month}/01`)
    const endDate = startDate.clone().endOf('month')
    this.dateSelect = startDate;
    const diffDays = endDate.diff(startDate, 'days', true)
    const numberDays = Math.round(diffDays);
    const arrayDays = Object.keys([...Array(numberDays)]).map((a: any) => {
      a = parseInt(a) + 1;
      const dayObject = moment(`${year}-${month}-${a}`);
      return {
        name: dayObject.format("dddd"),
        value: a,
        indexWeek: dayObject.isoWeekday()
      };
    });

    this.monthSelect = arrayDays;
  }

  changeMonth(flag) {
    if (flag < 0) {
      const prevDate = this.dateSelect.clone().subtract(1, "month");
      this.getDaysFromDate(prevDate.format("MM"), prevDate.format("YYYY"));
      this.mes_selec = new Date(this.dateSelect._i).getMonth() + 1;
      this.ano_selec = new Date(this.dateSelect._i).getFullYear();
      console.log("anos");
      console.log(this.ano_selec);
    } else {
      const nextDate = this.dateSelect.clone().add(1, "month");
      this.getDaysFromDate(nextDate.format("MM"), nextDate.format("YYYY"));
      this.mes_selec = new Date(this.dateSelect._i).getMonth() + 1;
      this.ano_selec = new Date(this.dateSelect._i).getFullYear();
      console.log("anos");
      console.log(this.ano_selec);
    }
  }
  clickDay(day) {
    this.opcion.push(day.value);
    const monthYear = this.dateSelect.format('YYYY-MM')
    const parse = `${monthYear}-${day.value}`
    const objectDate = parse;
    if (this.dateValue != '') {
      if (this.dateValueFinal != '') {
        this.dateValue = objectDate;
        this.dateValueFinal = '';
      } else {
        this.dateValueFinal = objectDate;
      }
    } else {
      this.dateValue = objectDate;
    }
  }

  asignarDias() {
    if (this.fechas_reservadas.length > 0) {
      for (let index = 0; index < this.fechas_reservadas.length; index++) {
        this.fechas_reservadas_arreglo.push(this.fechas_reservadas[index].fecha_ini);
        this.fechas_reservadas_arreglo.push(this.fechas_reservadas[index].fecha_fin)
      }
    }
    for (let index = 0; index < this.fechas_reservadas_arreglo.length; index++) {
      this.dias.push(new Date(this.fechas_reservadas_arreglo[index]).getDate() + 1);
      this.meses.push(new Date(this.fechas_reservadas_arreglo[index]).getMonth() + 1);
      this.anos.push(new Date(this.fechas_reservadas_arreglo[index]).getFullYear());
    }
  }

  borrar() {
    this.dateValueFinal = '';
    this.dateValue = '';
    this.opcion = [32];
  }
}

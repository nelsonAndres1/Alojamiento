import { Component, OnInit } from '@angular/core';
import { Reservas } from 'app/models/reservas';
import * as moment from 'moment'
import Swal from 'sweetalert2';
import { Subsi15Service } from '@shared/services/subsi15.service';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.scss'],
  providers: [Subsi15Service]
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

  constructor(private subsi15Service: Subsi15Service) {

    this.token = JSON.parse(localStorage.getItem("reserva") + '');
    this.reserva = new Reservas(0, '', '', '', '', '', '', this.token.id, '', '', '', '', '', '');
  }

  ngOnInit() {
    this.getDaysFromDate(1, 2023)
  }

  busqueda() {
    console.log(this.reserva);
    console.log("blur funciona!");
    this.subsi15Service.getCategoria(this.reserva).subscribe(
      response => {
        if (response.bandera) {
          this.reserva.nombres = response.nombres;
          this.reserva.apellidos = response.apellidos;
          this.reserva.categoria = response.codcat;


        } else {
          this.reserva = new Reservas(0, '', '', '', '', '', '', this.token.id, '', '', '', '', '', '');
          Swal.fire(
            'Información',
            'Trabajador no existe o está inactivo',
            'info'
          )

        }
      }
    )


  }
  onSubmit(form) {
    console.log(this.dateValue, this.dateValueFinal);
    if (this.dateValue != '' || this.dateValueFinal != '') {
      if (this.dateValue <= this.dateValueFinal) {
        this.reserva.fecha_ini = this.dateValue;
        this.reserva.fecha_fin = this.dateValueFinal;
        
      


      } else {
        this.dateValue = '';
        this.dateValueFinal = '';
        Swal.fire(
          'Error',
          'la fecha final no puede ser menor a la inicial!, verifique las fechas.',
          'error'
        )
      }
    } else {
      Swal.fire(
        'Error',
        'Fechas vacias, favor verificar!',
        'error'
      )
    }
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
    } else {
      const nextDate = this.dateSelect.clone().add(1, "month");
      this.getDaysFromDate(nextDate.format("MM"), nextDate.format("YYYY"));
    }
  }
  clickDay(day) {
    this.opcion.push(day.value);
    console.log(this.opcion);
    const monthYear = this.dateSelect.format('YYYY-MM')
    console.log("month year!")
    console.log(monthYear);
    const parse = `${monthYear}-${day.value}`
    const objectDate = parse;
    console.log(objectDate);
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
  borrar() {
    this.dateValueFinal = '';
    this.dateValue = '';
    this.opcion = [32];
  }
}

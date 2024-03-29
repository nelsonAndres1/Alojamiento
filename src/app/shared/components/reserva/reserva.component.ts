import { Component, OnInit } from '@angular/core';
import { Reservas } from 'app/models/reservas';
import * as moment from 'moment'
import Swal from 'sweetalert2';
import { Subsi15Service } from '@shared/services/subsi15.service';
import { ReservaService } from '@shared/services/reserva.service';
import { TaralojaService } from '@shared/services/taraloja.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

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

  createPDF(nombres, apellidos) {

    const pdfDefinition: any = {
      // Invoice markup
      // Author: Max Kostinevich
      // BETA (no styles)
      // http://pdfmake.org/playground.html
      // playground requires you to assign document definition to a variable called dd



      footer: function (pagenumber, pagecount) {
        if (pagenumber == 1) {
          return {
            columns: [
              { text: pagenumber + ' de ' + pagecount, style: 'documentFooterRight' }
            ]
          }
        } else if (pagenumber == pagecount) {
          return {
            columns: [
              { text: 'Invoice #00001', style: 'documentFooterLeft' },
              { text: pagenumber + ' de ' + pagecount, style: 'documentFooterRight' }
            ]
          }
        } else {
          return {
            columns: [
              { text: 'Invoice #00001', style: 'documentFooterLeft' },
              { text: pagenumber + ' de ' + pagecount, style: 'documentFooterRight' }
            ]
          }
        }

      },
      content: [
        // Header

        {
          columns: [
            {
              image: 'data:image/png;base64,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',
              width: 150
            },

            [

              {
                qr: '123456789',
                style: 'invoiceTitle',
                width: '*'
              },
              {
                stack: [
                  {
                    columns: [
                      {
                        text: 'Invoice #',
                        style: 'invoiceSubTitle',
                        width: '*'

                      },
                      {
                        text: '00001',
                        style: 'invoiceSubValue',
                        width: 100

                      }
                    ]
                  },
                  {
                    columns: [
                      {
                        text: 'Fecha de facturación',
                        style: 'invoiceSubTitle',
                        width: '*'
                      },
                      {
                        text: 'Abril 19 de 2023',
                        style: 'invoiceSubValue',
                        width: 100
                      }
                    ]
                  },
                  {
                    columns: [
                      {
                        text: 'Fecha Vencimiento',
                        style: 'invoiceSubTitle',
                        width: '*'
                      },
                      {
                        text: 'Abril 25, 2023',
                        style: 'invoiceSubValue',
                        width: 100
                      }
                    ]
                  },
                ]
              }
            ],
          ],
        },
        // Billing Headers
        {
          columns: [
            {
              text: 'Generada por: ',
              style: 'invoiceBillingTitle',

            },
            {
              text: 'Recibida por: ',
              style: 'invoiceBillingTitle',

            },
          ]
        },
        // Billing Details
        {
          columns: [
            {
              text: 'Servicio de Alojamiento \n Comfamiliar de Nariño.',
              style: 'invoiceBillingDetails'
            },
            {
              text: nombres + ' ' + apellidos,
              style: 'invoiceBillingDetails'
            },
          ]
        },
        // Billing Address Title
        {
          columns: [
            {
              text: 'Address',
              style: 'invoiceBillingAddressTitle'
            },
            {
              text: 'Address',
              style: 'invoiceBillingAddressTitle'
            },
          ]
        },
        // Billing Address
        {
          columns: [
            {
              text: 'Dirección Comfamiliar de Nariño',
              style: 'invoiceBillingAddress'
            },
            {
              text: '1111 Other street 25 \n New-York City NY 00000 \n   USA',
              style: 'invoiceBillingAddress'
            },
          ]
        },
        // Line breaks
        '\n\n',
        // Items
        {
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            dontBreakRows: true,
            keepWithHeaderRows: 1,
            widths: ['*', 40, 'auto', 40, 'auto', 80],

            body: [
              // Table Header
              [
                {
                  text: 'Product',
                  style: 'itemsHeader'
                },
                {
                  text: 'Qty',
                  style: ['itemsHeader', 'center']
                },
                {
                  text: 'Price',
                  style: ['itemsHeader', 'center']
                },
                {
                  text: 'Tax',
                  style: ['itemsHeader', 'center']
                },
                {
                  text: 'Discount',
                  style: ['itemsHeader', 'center']
                },
                {
                  text: 'Total',
                  style: ['itemsHeader', 'center']
                }
              ],
              // Items
              // Item 1
              [
                [
                  {
                    text: 'Item 1',
                    style: 'itemTitle'
                  },
                  {
                    text: 'Item Description',
                    style: 'itemSubTitle'

                  }
                ],
                {
                  text: '1',
                  style: 'itemNumber'
                },
                {
                  text: '$999.99',
                  style: 'itemNumber'
                },
                {
                  text: '0%',
                  style: 'itemNumber'
                },
                {
                  text: '0%',
                  style: 'itemNumber'
                },
                {
                  text: '$999.99',
                  style: 'itemTotal'
                }
              ],




              [
                [
                  {
                    text: 'Item 30',
                    style: 'itemTitle'
                  },
                  {
                    text: 'Item Description',
                    style: 'itemSubTitle'

                  }
                ],
                {
                  text: '1',
                  style: 'itemNumber'
                },
                {
                  text: '$999.99',
                  style: 'itemNumber'
                },
                {
                  text: '0%',
                  style: 'itemNumber'
                },
                {
                  text: '0%',
                  style: 'itemNumber'
                },
                {
                  text: '$999.99',
                  style: 'itemTotal'
                }
              ],
              // END Items
            ]
          }, // table
          //  layout: 'lightHorizontalLines'
        },
        // Line breaks
        '\n\n',
        {
          // TOTAL
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            dontBreakRows: true,
            keepWithHeaderRows: 1,
            widths: ['*', '*', '*', '*', '*'],
            body: [
              // Table Header
              [
                {
                  text: 'Bruto',
                  style: ['itemsHeader', 'center']
                },
                {
                  text: 'Descuentos',
                  style: ['itemsHeader', 'center']
                },
                {
                  text: 'Base imponible',
                  style: ['itemsHeader', 'center']
                },
                {
                  text: 'Impuestos',
                  style: ['itemsHeader', 'center']
                },
                {
                  text: 'Total',
                  style: ['itemsHeader', 'center']
                }
              ],
              [
                {
                  text: '$999.99',
                  style: 'itemNumber'
                },
                {
                  text: '$999.99',
                  style: ['itemNumber']
                },
                {
                  text: '$999.99',
                  style: ['itemNumber']
                },
                {
                  text: '$999.99',
                  style: ['itemNumber']
                },
                {
                  text: '$999.99',
                  style: ['itemNumber']
                }
              ]
            ]
          },
        }
      ],
      styles: {
        // Document Headert
        documentHeaderLeft: {
          fontSize: 10,
          margin: [5, 5, 5, 5],
          alignment: 'left'
        },
        documentHeaderCenter: {
          fontSize: 10,
          margin: [5, 5, 5, 5],
          alignment: 'center'
        },
        documentHeaderRight: {
          fontSize: 10,
          margin: [5, 5, 5, 5],
          alignment: 'right'
        },
        // Document Footer
        documentFooterLeft: {
          fontSize: 10,
          margin: [5, 5, 5, 5],
          alignment: 'left'
        },
        documentFooterCenter: {
          fontSize: 10,
          margin: [5, 5, 5, 5],
          alignment: 'center'
        },
        documentFooterRight: {
          fontSize: 10,
          margin: [5, 5, 5, 5],
          alignment: 'right'
        },
        // Invoice Title
        invoiceTitle: {
          fontSize: 22,
          bold: true,
          alignment: 'right',
          margin: [0, 0, 0, 15]
        },
        // Invoice Details
        invoiceSubTitle: {
          fontSize: 12,
          alignment: 'right'
        },
        invoiceSubValue: {
          fontSize: 12,
          alignment: 'right'
        },
        // Billing Headers
        invoiceBillingTitle: {
          fontSize: 14,
          bold: true,
          alignment: 'left',
          margin: [0, 20, 0, 5],
        },
        // Billing Details
        invoiceBillingDetails: {
          alignment: 'left'

        },
        invoiceBillingAddressTitle: {
          margin: [0, 7, 0, 3],
          bold: true
        },
        invoiceBillingAddress: {

        },
        // Items Header
        itemsHeader: {
          margin: [0, 5, 0, 5],
          bold: true
        },
        // Item Title
        itemTitle: {
          bold: true,
        },
        itemSubTitle: {
          italics: true,
          fontSize: 10
        },
        itemNumber: {
          margin: [0, 5, 0, 5],
          alignment: 'center',
        },
        itemTotal: {
          margin: [0, 5, 0, 5],
          bold: true,
          alignment: 'center',
        },

        // Items Footer (Subtotal, Total, Tax, etc)
        itemsFooterSubTitle: {
          margin: [0, 5, 0, 5],
          bold: true,
          alignment: 'right',
        },
        itemsFooterSubValue: {
          margin: [0, 5, 0, 5],
          bold: true,
          alignment: 'center',
        },
        itemsFooterTotalTitle: {
          margin: [0, 5, 0, 5],
          bold: true,
          alignment: 'right',
        },
        itemsFooterTotalValue: {
          margin: [0, 5, 0, 5],
          bold: true,
          alignment: 'center',
        },
        signaturePlaceholder: {
          margin: [0, 70, 0, 0],
        },
        signatureName: {
          bold: true,
          alignment: 'center',
        },
        signatureJobTitle: {
          italics: true,
          fontSize: 10,
          alignment: 'center',
        },
        notesTitle: {
          fontSize: 10,
          bold: true,
          margin: [0, 50, 0, 3],
        },
        notesText: {
          fontSize: 10
        },
        center: {
          alignment: 'center',
        },
      },
      defaultStyle: {
        columnGap: 20,
      }
    }
    /*  */

    const pdf = pdfMake.createPdf(pdfDefinition);
    pdf.open();

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
    this._reservaService.register(this.reserva).subscribe(
      response => {

        console.log("response!!!!");
        console.log(response);
        if (response.status == 'success') {
          Swal.fire(
            'Ok!',
            'Reserva realizada con exito!',
            'success'
          ).then(() => {

            let disponibles = response.user.cantidad - response.user.numero;

            Swal.fire({
              title: '<strong>Prereserva: <u>' + response.user.detalle_tipo + '</u> realizada!</strong>',
              icon: 'info',
              html:
                'Al correo proporcionado en el formulario de reserva: ' + '<b> ' + response.user.correo + ' </b>' + 'se enviará el <b>recibo de pago</b>, ' +
                'Puede acercarse a realizar el pago a nuestras oficinas! ' +
                'Si existe alguna inquietud comunicarse al telefono: 602-7202020' +
                ' o al correo: ' + '<b>ejemplo@comfamiliarnarino.com</b> <br>' +
                '<b>Numero de </b>' + response.user.detalle_tipo + ': ' + response.user.numero + '<br>' +
                '<b>Disponibles </b>' + ': ' + disponibles,

              showCloseButton: true,
              showCancelButton: false,
              focusConfirm: true,
              confirmButtonText:
                '<i class="fa fa-thumbs-up"></i> Ok!',
              confirmButtonAriaLabel: 'Thumbs up, great!',
              cancelButtonText:
                '<i class="fa fa-thumbs-down"></i>',
              cancelButtonAriaLabel: 'Thumbs down'
            }).then(() => {
              this.createPDF(response.user.nombres, response.user.apellidos);
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            })
          }
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

        console.log("eror!");
        console.log(error.error.user);
        Swal.fire(
          'Error!',
          'Reserva No realizada!' + '<br>' +
          '<b>Información: </b>' + error.error.user,
          'error'
        );
      }
    );
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

import { Component, OnInit } from '@angular/core';
import { Taraloja } from 'app/models/taraloja';
import { TaralojaService } from '@shared/services/taraloja.service';
import { TiposalojaService } from '@shared/services/tiposloja.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-taraloja',
  templateUrl: './taraloja.component.html',
  styleUrls: ['./taraloja.component.scss'],
  providers: [TaralojaService, TiposalojaService]
})
export class TaralojaComponent implements OnInit {

  taraloja: Taraloja;
  usuario_logeado: any;
  usuario: any;
  tipaloja: any;
  datos_taraloja: any = [];
  constructor(private _taralojaService: TaralojaService, private _tiposalojaService: TiposalojaService) {
    this.usuario_logeado = JSON.parse(localStorage.getItem('identity') + '');
    this.usuario = this.usuario_logeado['sub'];
    this.taraloja = new Taraloja(0, '', '', '', '', '', '', this.usuario, '');


    this._tiposalojaService.getAll({}).subscribe(
      response => {
        this.tipaloja = response;
        console.log("this.tipaloja");
        console.log(response);
      }
    );

    this.taraloja_service();
  }

  ngOnInit() {
  }

  taraloja_service() {
    this._taralojaService.getAll({}).subscribe(
      response => {

        if (response.status == 'error') {
          this.datos_taraloja = [];
          Swal.fire('Información', 'No existen datos de tarifas!', 'info');
        } else {
          console.log("ahhhhhh!");
          console.log(response);
          this.datos_taraloja = response;
        }
      }
    )
  }



  onSubmit(form: any) {
    Swal.fire({
      title: 'Esta seguro de guardar cambios?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      denyButtonText: `No guardar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this._taralojaService.register(this.taraloja).subscribe(
          response => {
            console.log(response);
            if (response.status == 'success') {
              Swal.fire(
                'Guardado!',
                'Datos guardados con exito!',
                'success'
              )
              form.reset();
              this.taraloja_service();
            } else {
              Swal.fire(
                'No guardado!',
                'Datos No guardados!',
                'error'
              )
            }
          }, error => {
            Swal.fire(
              'No guardado!',
              'Datos No guardados!',
              'error'
            )
          }
        )
      } else if (result.isDenied) {
        Swal.fire('Cambios no guardados', '', 'info')
      }
    })
  }
}

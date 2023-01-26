import { Component, OnInit } from '@angular/core';
import { Taraloja } from 'app/models/taraloja';
import { TaralojaService } from '@shared/services/taraloja.service';
import { TiposalojaService } from '@shared/services/tiposloja.service';
import Swal from 'sweetalert2';
import { Tiposaloja } from 'app/models/tiposaloja';

@Component({
  selector: 'app-tiposaloja',
  templateUrl: './tiposaloja.component.html',
  styleUrls: ['./tiposaloja.component.scss'],
  providers: [TaralojaService, TiposalojaService]
})
export class TiposalojaComponent implements OnInit {

  taraloja: Taraloja;
  tiposaloja: Tiposaloja;
  usuario_logeado: any;
  usuario: any;
  tipaloja: any = [];
  datos_taraloja: any = [];
  constructor(private _taralojaService: TaralojaService, private _tiposalojaService: TiposalojaService) {
    this.usuario_logeado = JSON.parse(localStorage.getItem('identity') + '');
    this.usuario = this.usuario_logeado['sub'];
    this.tiposaloja = new Tiposaloja(0,'','','','',0,this.usuario,'');
   }

  ngOnInit() {
  }
  onSubmit(form:any){
    Swal.fire({
      title: 'Esta seguro de guardar cambios?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      denyButtonText: `No guardar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this._tiposalojaService.register(this.tiposaloja).subscribe(
          response => {
            console.log(response);
            if (response.status == 'success') {
              Swal.fire(
                'Guardado!',
                'Datos guardados con exito!',
                'success'
              )
              form.reset();
              /* this.taraloja_service(); */
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

import { Component, OnInit } from '@angular/core';
import { Taraloja } from 'app/models/taraloja';
import { TaralojaService } from '@shared/services/taraloja.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-taraloja',
  templateUrl: './taraloja.component.html',
  styleUrls: ['./taraloja.component.scss'],
  providers: [TaralojaService]
})
export class TaralojaComponent implements OnInit {

  taraloja: Taraloja;


  constructor(private _taralojaService: TaralojaService) {
    this.taraloja = new Taraloja(0, '', '', '', '', '', '', '');
  }

  ngOnInit() {
  }

  onSubmit(form: any) {
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
  }
}

import { Component, DoCheck, OnInit } from '@angular/core';
import { Gener02Service } from '@shared/services/gener02.service';
import { Gener02 } from './models/gener02';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { identity } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [Gener02Service]
})
export class AppComponent implements OnInit, DoCheck {
  title = 'Alojamiento';
  public identity;
  public permis: any;
  public token;

  public status: any;
  public v: any = true;
  public usuario: any;
  public bandera: any = true;
  public arrayN: any = [];
  public permisos: any;
  itemDetail: any = [];
  arrayPermisos: any = [];

  constructor(private route: ActivatedRoute, public _gener02Service: Gener02Service, private router: Router) {
    this.identity = this._gener02Service.getIdentity();
    this.token = this._gener02Service.getToken();

    console.log("Datos!!");
    console.log(this.identity);
  }


  ngOnInit(): void {
    console.log("Web cargada correctamente");
  }

  inp() {
    this.router.navigate(['teso10'])
  }

  salir() {

    Swal.fire({
      icon: 'warning',
      title: 'Salida',
      text: '¿Estas seguro de salir?',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si!'
    }).then((result) => {
      if (result.isConfirmed) {

        localStorage.removeItem('identity');
        localStorage.removeItem('token');
        localStorage.removeItem('tpago');
        localStorage.removeItem('token1');
        localStorage.removeItem('tpa');
        localStorage.removeItem('identity2');
        localStorage.removeItem('identity1');
        localStorage.removeItem('permisos');
        localStorage.removeItem('tokenConsultado');
        localStorage.removeItem('tokenConsultado2');
        localStorage.removeItem('numero');

        this.identity = null;
        this.token = null;
        if (this.identity == null) {

          console.log(this.identity);
          this.router.navigate(['login']);
        }
      }
    });
  }

  ngDoCheck(): void {
    this.loadUser();
}


  loadUser() {
    this.identity = this._gener02Service.getIdentity();
    this.token = this._gener02Service.getToken();
  }

}

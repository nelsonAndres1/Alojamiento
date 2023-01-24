import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  public identity;
  public permis: any;
  public token;
  constructor(
    private _router: Router,
    private _route: ActivatedRoute
  ) { 
    


  }

  ngOnInit() {
  }
  taraloja(){
    console.log("ahhhhhh!");
    this._router.navigate(['taraloja']);
  }

}

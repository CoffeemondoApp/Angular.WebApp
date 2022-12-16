import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { UsuariosService } from '../../../services/usuarios.service';
import { Usuarios } from '../../../usuarios.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  Usuarios: Usuarios[]
  menuStatus: boolean= true;
  @Input() sideNavStatus: boolean = false;
  @Output() sideNavToggled = new EventEmitter<boolean>();


  constructor(
    private usuariosService : UsuariosService,
    private router : Router
  ) { }

  ngOnInit(): void {
    document.getElementsByClassName('modal-backdrop')[0].classList.remove('modal-backdrop')

  }


  sideNavToggle() {
    this.menuStatus = !this.menuStatus;
    this.sideNavToggled.emit(this.menuStatus);
  }

  onClick(){
    this.usuariosService.logout()
      .then(()=>{
        Swal.fire({
          title:"¿Estas seguro?",
          text:"Si cierra sesion va a tener que volver a identificarse.",
          icon:"warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Si, estoy seguro."
        }).then( (result)=> {
          if (result.isConfirmed) {
            this.router.navigate(['/index']);
          }
          
        })
      })
      .catch( () => {});
  }
}

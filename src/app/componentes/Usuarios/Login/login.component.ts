import { Token } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import Swal from 'sweetalert2';
import { UsuariosService } from '../../../services/usuarios.service';
declare var window: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isAuth: boolean;
  isLogin: boolean;

  formLogin: FormGroup;
  formModalLog: any;
  modalLogin: any;
  IsLoggin: boolean= false;

  constructor(
    private userService: UsuariosService,
    private router: Router,
    private afAuth: AngularFireAuth
  ) {
    this.formLogin = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", Validators.required)
    })
  }

  ngOnInit(): void {
    this.afAuth.user.subscribe(user => {
      this.isAuth = !!user;
      if(this.isAuth == true) {
        this.isLogin = true;
        this.router.navigate(['/dashboard'])
      }
      
    });
    this.formModalLog = new window.bootstrap.Modal(
      document.getElementById("modalregister"))
  }

  onSubmit() {
    if (!this.formLogin.valid) {
      let errormsg = ""
      if (this.formLogin.get("password").hasError("required")) errormsg = "La contraseña es obligatoria"
      if (this.formLogin.get("email").hasError("email")) errormsg = "El formato del correo no es valido"
      if (this.formLogin.get("email").hasError("required")) errormsg = "El campo email es obligatorio"
      Swal.fire({
        text: errormsg,
        icon: "error"
      })
      return
    }
    Swal.fire("Cargando")
    Swal.showLoading()
    this.userService.login(this.formLogin.value)
      .then(() => {
        Swal.fire({
          text: "Se ha auntenticado de manera correcta",
          icon: "success",
          
        })

        this.goToDashboard();
      })
      .catch(err => {

        Swal.fire({
          title: "Error al autentificarse",
          icon: "error",
          text: "Su correo o contraseña no son validos"
        })
      });
  }

  onClick() {
    this.userService.loginWithGoogle()

      .then(() => {
        this.goToDashboard();
      })
      .catch(() => {
        Swal.fire({
          text: "Error al ingresar con Google",
          icon: "error"
        })
      })
  }

  onFace() {
    this.userService.loginWithFacebook()
      .then(() => {
        this.goToDashboard();
      })
      .catch(error => {
        Swal.fire({
          text: "Error al ingresar con Facebook",
          icon: "error"
        })
      })
  }
  openModelLog() {
    this.formModalLog.show();
    const backdrop = document.getElementsByClassName("modal-backdrop")[0] as HTMLElement;
    backdrop.style.zIndex = "-1";
  }
  doSomethingLog() {
    this.formModalLog.hide()
  }

  private goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}


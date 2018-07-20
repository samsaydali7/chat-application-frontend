import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import {EncryptionService} from '../encryption.service';
import * as BigInteger from "big-integer";
import { Router } from '@angular/router'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public username: string = "";
  public password: string = "";

  public username_err: boolean = false;
  public password_err: boolean = false;

  public exist_err: boolean = false;
  public errorMessage: string = "";

  public validate(): boolean {
    this.username_err = false;
    this.password_err = false;
    this.usernameVal();
    this.passwordVal();
    if (this.username_err || this.password_err)
      return false;
    return true;
  }

  private usernameVal() {
    if (this.username == "") {
      this.username_err = true;
      return;
    }
    var arr = this.username.split('');
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == " " || arr[i] == "\\" || arr[i] == "`" || arr[i] == "/" || arr[i] == "'" || arr[i] == '"') {
        this.username_err = true;
        return;
      }
    }
  }

  private passwordVal(){
    if (this.password == "") {
      this.password_err = true;
      return;
    }
    var arr = this.password.split('');
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == " ") {
        this.password_err = true;
        return;
      }
    }
  }

  public logIn() {
    if(this.validate()){
      let object = {
        username: this.username,
        password: this.password
      }
      this.chatService.logIn(object).subscribe(responce=>{
        if(responce['ok']){
          this.chatService.loginSeuccsess(responce);
          var login = {
            username:this.username,
            password:this.password
          }
          localStorage.setItem('login',JSON.stringify(login));

        }else{
          this.exist_err = true;
          this.errorMessage = responce['message'];
        }
      });
    }
  }

  constructor(private chatService: ChatService,private encryption:EncryptionService, private router: Router) { }
  ngOnInit() {
    this.loadToken();
  }

  public loadToken(){
    var login = localStorage.getItem('login');
    if(login != null){
      login = JSON.parse(login);
      if(login.hasOwnProperty('username') && login.hasOwnProperty('password')){
        this.chatService.logIn(login).subscribe(responce=>{
          if(responce['ok']){
            this.chatService.loginSeuccsess(responce);
          }else{
            this.exist_err = true;
            this.errorMessage = responce['message'];
          }
        });
      }
    }
  }

}

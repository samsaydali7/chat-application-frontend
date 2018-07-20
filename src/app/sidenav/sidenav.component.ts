import { Component, OnInit,Input } from '@angular/core';
import { User } from '../User';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  @Input() user:User;
   
  constructor(private chatService:ChatService) { }

  ngOnInit() {
  }

  logout(){
    this.chatService.logout();
  }

}

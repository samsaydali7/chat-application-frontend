import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { ChatService } from './chat.service';
import { EncryptionService } from "./encryption.service";
import { MainAppComponent } from './main-app/main-app.component';
import { ContatcsListComponent } from './contatcs-list/contatcs-list.component';
import { ChatBoxsComponent } from './chat-boxs/chat-boxs.component';
import { SearchPageComponent } from './search-page/search-page.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ContactsComponent } from './contacts/contacts.component';
import { ProfileComponent } from './profile/profile.component';
const appRoutes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'login',      component: LoginComponent },
  { path:'profile', component:ProfileComponent },
  { path: '',
    redirectTo: '/main',
    pathMatch: 'full'
  },{
    path:'main' , component:MainAppComponent
  },
  {
    path:'contacts',component:ContactsComponent
  }
];
@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    MainAppComponent,
    ContatcsListComponent,
    ChatBoxsComponent,
    SearchPageComponent,
    SidenavComponent,
    ContactsComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    ),
    FormsModule,
    HttpModule,
    HttpClientModule,
  ],
  providers: [ChatService,EncryptionService],
  bootstrap: [AppComponent]
})
export class AppModule { }

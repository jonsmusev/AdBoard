import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { RoutingModule } from './routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { SharedModule } from './shared/shared.module';
import { ClassifiedService } from './services/classified.service'
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { AuthGuardLogin } from './services/auth-guard-login.service';
import { AuthGuardAdmin } from './services/auth-guard-admin.service';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { AccountComponent } from './account/account.component';
import { AdminComponent } from './admin/admin.component';

import { ClassifiedComponent } from './classified/classified.component';
import { HeaderComponent } from './header/header.component';
import { FileSelectDirective, FileDropDirective} from 'ng2-file-upload';
import { OrderPipe } from './pipes/ngx-order.pipe';
import { niceDateFormatPipe} from './pipes/niceDateFormatPipe.pipe';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SidebarService} from "./services/sidebar.service";
import { ImComponent } from './im/im.component';

@NgModule({
  declarations: [
    AppComponent,
    ClassifiedComponent,
    HeaderComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    LogoutComponent,
    AccountComponent,
    AdminComponent,
    FileSelectDirective,
    FileDropDirective,
    OrderPipe,
    niceDateFormatPipe,
    SidebarComponent,
    ImComponent
  ],
  imports: [
    RoutingModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    SharedModule
  ],
  providers: [
    AuthService,
    AuthGuardLogin,
    AuthGuardAdmin,
    ClassifiedService,
    UserService,
    SidebarService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }

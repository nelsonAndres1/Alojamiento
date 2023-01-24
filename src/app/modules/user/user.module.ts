import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { UserRoutingModule } from './user-routing.module';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserListComponent } from './user-list/user-list.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    UserDetailComponent,
    UserListComponent
  ],
  imports: [
    SharedModule,
    UserRoutingModule,
    FormsModule
  ]
})
export class UserModule { }

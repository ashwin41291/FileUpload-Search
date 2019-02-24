import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule} from '@angular/router';
import {SearchComponent} from './search/search.component';
import {UploadComponent} from './upload/upload.component';
import {UploadSearchComponent} from './upload-search/upload-search.component';

const routes: Routes = [
  {path: '', redirectTo: 'upload_show', pathMatch: 'full'},
  {path: 'search' , component: SearchComponent},
  {path: 'upload' , component: UploadComponent},
  {path: 'upload_show' , component: UploadSearchComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes), CommonModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }

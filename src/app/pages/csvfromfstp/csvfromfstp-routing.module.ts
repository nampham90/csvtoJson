import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CsvfromfstpComponent } from './csvfromfstp.component';

const routes: Routes = [
  {path: '', component: CsvfromfstpComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CsvfromfstpRoutingModule { }

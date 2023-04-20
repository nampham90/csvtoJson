import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/importcsvformcp' },
  { path: 'importcsvformcp', loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule) },
  { path: 'importcsvformserverfstp', loadChildren: () => import('./pages/csvfromfstp/csvfromfstp.module').then(m => m.CsvfromfstpModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

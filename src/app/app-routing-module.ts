import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
  path: '',
  loadComponent: () =>import('./calculator-component/calculator-component').then(m => m.CalculatorComponent),
  pathMatch: 'full'
},{
  path: 'history',
  loadComponent: () =>import('./history-component/history-component').then(m => m.HistoryComponent),
  pathMatch: 'full'
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

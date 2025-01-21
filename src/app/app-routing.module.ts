import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessibilityComponent } from './components/accessibility/accessibility.component';
import { ReportDetailsComponent } from './components/report-details/report-details.component';

const routes: Routes = [
  { path: '', component: AccessibilityComponent },
  { path: 'report-details/:url', component: ReportDetailsComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

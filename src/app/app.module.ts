import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccessibilityComponent } from './components/accessibility/accessibility.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RawHtmlDirective } from './raw-html.directive';
import { RouterModule } from '@angular/router';
import { ReportDetailsComponent } from './components/report-details/report-details.component';
@NgModule({
  declarations: [
    AppComponent,
    AccessibilityComponent,
    RawHtmlDirective,
    ReportDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

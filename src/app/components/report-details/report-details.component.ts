import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-report-details',
  templateUrl: './report-details.component.html',
  styleUrls: ['./report-details.component.scss']
})
export class ReportDetailsComponent implements OnInit {
  reportUrl: SafeResourceUrl | null = null;

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    // Get the URL parameter from the route
    const urlParam = this.route.snapshot.paramMap.get('url');
    if (urlParam) {
      // Construct the report URL
      this.reportUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`http://localhost:3000/reports/${urlParam}.html`);
    }
  }
}

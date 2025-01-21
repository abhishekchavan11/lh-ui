import { Component } from '@angular/core';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { AccessibilityService} from 'src/app/accessibility.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accessibility',
  templateUrl: './accessibility.component.html',
  styleUrls: ['./accessibility.component.scss']
})
 export class AccessibilityComponent {
  urlForm: FormGroup; // Form to hold the URLs
  errorMessage: string | null = null;
  reports: {
passedAudits: any;
manualChecks: any;
notApplicable: any; url: string; report: string; accessibilityScore: number; issues: any[]; safeUrl: SafeResourceUrl; defectCounts: { type: string; count: number }[] 
}[] = [];
inputMethod: string = 'file';
fileName: string = '';
  constructor(private fb: FormBuilder, private accessibilityService: AccessibilityService,private sanitizer: DomSanitizer,  private router: Router) {
    this.urlForm = this.fb.group({
      urls: this.fb.array([]) // Dynamic array of URLs
    });
  }
  // Getter for the FormArray
  get urls(): FormArray {
    return this.urlForm.get('urls') as FormArray;
  }
  // Add a new URL input field
  addUrl(): void {
    this.urls.push(this.fb.control('')); // Add an empty control
  }
  // Remove a URL input field
  removeUrl(index: number): void {
    this.urls.removeAt(index);
  }
  // Submit the form to fetch reports
  submit(): void {
    const urlArray = this.urls.value;
    this.accessibilityService.generateReports(urlArray).subscribe({
      next: (response) => {
        this.reports = response.reports.map(report => ({
          ...report,
          safeUrl: this.sanitizer.bypassSecurityTrustResourceUrl(`http://localhost:3000${report.report}`),
          defectCounts: this.getDefectTypes(report.issues),
          passedAudits: report.passedAudits,
        manualChecks: report.manualChecks,
        notApplicable: report.notApplicable
        }));
        console.log("this.reports",this.reports);
      },
      error: (error) => {
        console.error('Error generating reports:', error);
        this.errorMessage = 'Failed to generate reports. Please try again later.';
      }
    });
  }
  
  viewDetails(report: { url: string; report: string }): void {
    const sanitizedUrl = report.url.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const reportUrl = `/report-details/${sanitizedUrl}`;
    window.open(reportUrl, '_blank');
  }
  

  // Process issues to get defect types with their counts
getDefectTypes(issues: any[]): { type: string; count: number }[] {
  const defectCounts: { [key: string]: number } = {};

  issues.forEach(issue => {
    if (defectCounts[issue.title]) {
      defectCounts[issue.title]++;
    } else {
      defectCounts[issue.title] = 1;
    }
  });

  return Object.keys(defectCounts).map(type => ({
    type,
    count: defectCounts[type]
  }));
}

onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length) {
    const file = input.files[0];
    this.fileName = file.name;
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const urls = text.split(/\r?\n/).filter(url => url.trim() !== '');
      this.urls.clear(); // Clear existing form controls
      urls.forEach(url => this.urls.push(this.fb.control(url)));
    };
    reader.readAsText(file);
    console.log("this.urls",this.urls);
  }
}
setInputMethod(method: string): void {
  this.inputMethod = method;
  if (method === 'file' || method === 'manual') {
    this.urls.clear(); // Clear manual inputs if switching to file upload
    this.reports = [];
    this.fileName = '';
  }
}
clearFile(): void {
  this.fileName = ''; // Clear the file name
  this.urls.clear(); // Clear any URLs loaded from the file
  this.reports = [];
}
}
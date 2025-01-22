import { Component } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators  } from '@angular/forms';
import { AccessibilityService } from 'src/app/accessibility.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accessibility',
  templateUrl: './accessibility.component.html',
  styleUrls: ['./accessibility.component.scss']
})
export class AccessibilityComponent {
  isLoading: boolean = false;
  urlForm: FormGroup; // Form to hold the URLs
  errorMessage: string | null = null;
  reports: {
    passedAudits: any;
    manualChecks: any;
    notApplicable: any; url: string; report: string; accessibilityScore: number; issues: any[]; safeUrl: SafeResourceUrl; defectCounts: { type: string; count: number }[]
  }[] = [];
  inputMethod: string = 'file';
  fileName: string = '';
  constructor(private fb: FormBuilder, private accessibilityService: AccessibilityService, private sanitizer: DomSanitizer, private router: Router) {
    this.urlForm = this.fb.group({
      urls: this.fb.array([], Validators.required)
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
    this.isLoading = true;
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
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error generating reports:', error);
        this.errorMessage = 'Failed to generate reports. Please try again later.';
        this.isLoading = false;
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
    let sortedIssues = issues.sort((a, b) => a.type.localeCompare(b.type));
    console.log("sortedIssues",sortedIssues);
    sortedIssues.forEach(issue => {
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
      console.log("this.urls", this.urls);
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

    // Reset the file input value
    const fileInput = document.querySelector('.file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; // Reset the file input
    }
  }

  // Open a new tab to view defects
  escapeHtml(text: string): string {
    return text.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
  viewDefects(url: string, defects: any[],type:string): void {
    const defectWindow = window.open('', '_blank');
    console.log(`Number of defects: ${defects.length}`);
    if (defectWindow) {
      let htmlContent = `
      <html>
        <head>
          <title>Defects</title>
          <style>
            .app-header {
              /* Add your CSS styles here */
              background-color: #f8f8f8;
              padding: 10px;
              text-align: center;
            }
            .header-logo {
              max-width: 100px;
            }
            li {
              margin: 5px 0;
            }
          </style>
        </head>
        <body>
          <div class="app-header">
            <img src="../assets/images/Amazon_logo.png" alt="Logo" class="header-logo">
          </div>
          <h2>${type} defects for ${this.escapeHtml(url)}</h2>
          <ul>
    `;
      defects.forEach(defect => {
        htmlContent += `<li>${this.escapeHtml(defect.title)}</li>`;
      });
      htmlContent += `
          </ul>
        </body>
      </html>
    `;
      defectWindow.document.write(htmlContent);
      defectWindow.document.close();
    }
  }


}
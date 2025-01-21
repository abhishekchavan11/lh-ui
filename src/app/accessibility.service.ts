import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccessibilityService {
  private apiUrl = 'http://localhost:3000/accessibility'; // Node.js API endpoint
  constructor(private http: HttpClient) {}
  // Method to send URLs to the backend
  // generateReports(urls: string[]): Observable<{ message: string; reports: { url: string; report: string }[] }> {
  //   return this.http.post<{ message: string; reports: { url: string; report: string }[] }>(this.apiUrl, { url: urls });
  // }

  generateReports(urls: string[]): Observable<{ 
    message: string; 
    reports: { 
      url: string; 
      report: string; 
      accessibilityScore: number; 
      issues: any[]; 
      passedAudits: number; 
      manualChecks: number; 
      notApplicable: number; 
    }[] 
  }> { 
    return this.http.post<{ 
      message: string; 
      reports: { 
        url: string; 
        report: string; 
        accessibilityScore: number; 
        issues: any[]; 
        passedAudits: number; 
        manualChecks: number; 
        notApplicable: number; 
      }[] 
    }>(this.apiUrl, { url: urls }); 
  }
  
 }
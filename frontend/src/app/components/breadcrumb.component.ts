import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  link?: string;
  active?: boolean;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="breadcrumb-nav" aria-label="Breadcrumb">
      <div class="container">
        <ol class="breadcrumb-list">
          <li 
            *ngFor="let item of items; let last = last"
            class="breadcrumb-item"
            [class.active]="item.active || last">
            
            <a 
              *ngIf="item.link && !item.active && !last"
              [routerLink]="item.link"
              class="breadcrumb-link">
              {{ item.label }}
            </a>
            
            <span 
              *ngIf="!item.link || item.active || last"
              class="breadcrumb-text">
              {{ item.label }}
            </span>
            
            <svg 
              *ngIf="!last"
              class="breadcrumb-separator"
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="currentColor">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
          </li>
        </ol>
      </div>
    </nav>
  `,
  styles: [`
    .breadcrumb-nav {
      background: white;
      border-bottom: 1px solid #e5e7eb;
      padding: 1rem 0;
    }

    .breadcrumb-list {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      list-style: none;
      margin: 0;
      padding: 0;
      flex-wrap: wrap;
    }

    .breadcrumb-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .breadcrumb-link {
      color: #6b7280;
      text-decoration: none;
      font-size: 0.875rem;
      transition: color 0.2s ease;
    }

    .breadcrumb-link:hover {
      color: #ec4899;
    }

    .breadcrumb-text {
      color: #374151;
      font-size: 0.875rem;
    }

    .breadcrumb-item.active .breadcrumb-text {
      color: #ec4899;
      font-weight: 500;
    }

    .breadcrumb-separator {
      color: #d1d5db;
      flex-shrink: 0;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .breadcrumb-nav {
        padding: 0.75rem 0;
      }

      .breadcrumb-link,
      .breadcrumb-text {
        font-size: 0.8rem;
      }

      .breadcrumb-separator {
        width: 14px;
        height: 14px;
      }
    }
  `]
})
export class BreadcrumbComponent {
  @Input() items: BreadcrumbItem[] = [];
}

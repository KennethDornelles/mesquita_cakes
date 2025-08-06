import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-gallery',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="product-gallery">
      <!-- Main Image Display -->
      <div class="main-image-container">
        <div class="image-wrapper" [class.loading]="isLoading">
          <img 
            [src]="currentImage" 
            [alt]="productName"
            class="main-image"
            (load)="onImageLoad()"
            (error)="onImageError($event)">
          
          <!-- Loading Placeholder -->
          <div *ngIf="isLoading" class="image-loading">
            <div class="loading-spinner"></div>
          </div>
          
          <!-- Navigation Arrows (for multiple images) -->
          <button 
            *ngIf="images.length > 1"
            class="nav-arrow nav-arrow--prev"
            (click)="previousImage()"
            [disabled]="currentIndex === 0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
          
          <button 
            *ngIf="images.length > 1"
            class="nav-arrow nav-arrow--next"
            (click)="nextImage()"
            [disabled]="currentIndex === images.length - 1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </button>
          
          <!-- Zoom Button -->
          <button class="zoom-btn" (click)="openLightbox()" title="Ampliar imagem">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              <path d="M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z"/>
            </svg>
          </button>
          
          <!-- Image Counter -->
          <div *ngIf="images.length > 1" class="image-counter">
            {{ currentIndex + 1 }} / {{ images.length }}
          </div>
        </div>
      </div>
      
      <!-- Thumbnail Gallery -->
      <div *ngIf="images.length > 1" class="thumbnail-gallery">
        <div class="thumbnails-container">
          <button
            *ngFor="let image of images; let i = index"
            class="thumbnail-btn"
            [class.active]="i === currentIndex"
            (click)="selectImage(i)">
            <img [src]="image" [alt]="productName + ' - Imagem ' + (i + 1)" class="thumbnail-image">
          </button>
        </div>
      </div>
      
      <!-- Product Badges -->
      <div class="product-badges">
        <span *ngFor="let badge of badges" class="badge" [ngClass]="'badge--' + badge.type">
          {{ badge.emoji }} {{ badge.label }}
        </span>
      </div>
    </div>
    
    <!-- Lightbox Modal -->
    <div *ngIf="showLightbox" class="lightbox-overlay" (click)="closeLightbox()">
      <div class="lightbox-container" (click)="$event.stopPropagation()">
        <button class="lightbox-close" (click)="closeLightbox()">×</button>
        
        <div class="lightbox-content">
          <img [src]="currentImage" [alt]="productName" class="lightbox-image">
          
          <!-- Lightbox Navigation -->
          <button 
            *ngIf="images.length > 1"
            class="lightbox-nav lightbox-nav--prev"
            (click)="previousImage()"
            [disabled]="currentIndex === 0">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
          
          <button 
            *ngIf="images.length > 1"
            class="lightbox-nav lightbox-nav--next"
            (click)="nextImage()"
            [disabled]="currentIndex === images.length - 1">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </button>
        </div>
        
        <!-- Lightbox Info -->
        <div class="lightbox-info">
          <h3>{{ productName }}</h3>
          <p>{{ currentIndex + 1 }} de {{ images.length }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-gallery {
      position: relative;
    }

    .main-image-container {
      position: relative;
      margin-bottom: 1rem;
    }

    .image-wrapper {
      position: relative;
      aspect-ratio: 1;
      border-radius: 1rem;
      overflow: hidden;
      background: #f8fafc;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .main-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .image-wrapper:hover .main-image {
      transform: scale(1.05);
    }

    .image-loading {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #e5e7eb;
      border-top: 4px solid #ec4899;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .nav-arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(255, 255, 255, 0.9);
      border: none;
      border-radius: 50%;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      z-index: 2;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .nav-arrow:hover:not(:disabled) {
      background: white;
      transform: translateY(-50%) scale(1.1);
    }

    .nav-arrow:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .nav-arrow--prev {
      left: 1rem;
    }

    .nav-arrow--next {
      right: 1rem;
    }

    .zoom-btn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: rgba(255, 255, 255, 0.9);
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      z-index: 2;
    }

    .zoom-btn:hover {
      background: white;
      transform: scale(1.1);
    }

    .image-counter {
      position: absolute;
      bottom: 1rem;
      right: 1rem;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 1rem;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .thumbnail-gallery {
      margin-top: 1rem;
    }

    .thumbnails-container {
      display: flex;
      gap: 0.75rem;
      overflow-x: auto;
      padding: 0.5rem 0;
    }

    .thumbnail-btn {
      flex-shrink: 0;
      border: 2px solid transparent;
      border-radius: 0.5rem;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
      background: none;
      padding: 0;
    }

    .thumbnail-btn.active {
      border-color: #ec4899;
      box-shadow: 0 0 0 2px rgba(236, 72, 153, 0.2);
    }

    .thumbnail-btn:hover {
      border-color: #ec4899;
    }

    .thumbnail-image {
      width: 80px;
      height: 80px;
      object-fit: cover;
      display: block;
    }

    .product-badges {
      position: absolute;
      top: 1rem;
      left: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      z-index: 2;
    }

    .badge {
      background: rgba(255, 255, 255, 0.95);
      padding: 0.5rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.75rem;
      font-weight: 600;
      border: 1px solid rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(10px);
    }

    .badge--new {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      border-color: transparent;
    }

    .badge--popular {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: white;
      border-color: transparent;
    }

    .badge--unavailable {
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: white;
      border-color: transparent;
    }

    .badge--discount {
      background: linear-gradient(135deg, #ec4899, #be185d);
      color: white;
      border-color: transparent;
    }

    /* Lightbox Styles */
    .lightbox-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      padding: 2rem;
    }

    .lightbox-container {
      position: relative;
      max-width: 90vw;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
    }

    .lightbox-close {
      position: absolute;
      top: -3rem;
      right: 0;
      background: none;
      border: none;
      color: white;
      font-size: 2rem;
      cursor: pointer;
      z-index: 10;
      width: 3rem;
      height: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background-color 0.3s ease;
    }

    .lightbox-close:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .lightbox-content {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .lightbox-image {
      max-width: 100%;
      max-height: 70vh;
      object-fit: contain;
      border-radius: 0.5rem;
    }

    .lightbox-nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(255, 255, 255, 0.9);
      border: none;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .lightbox-nav:hover:not(:disabled) {
      background: white;
      transform: translateY(-50%) scale(1.1);
    }

    .lightbox-nav:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .lightbox-nav--prev {
      left: -5rem;
    }

    .lightbox-nav--next {
      right: -5rem;
    }

    .lightbox-info {
      text-align: center;
      color: white;
      margin-top: 1rem;
    }

    .lightbox-info h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.25rem;
    }

    .lightbox-info p {
      margin: 0;
      opacity: 0.7;
      font-size: 0.875rem;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .nav-arrow {
        width: 40px;
        height: 40px;
      }

      .nav-arrow--prev {
        left: 0.5rem;
      }

      .nav-arrow--next {
        right: 0.5rem;
      }

      .zoom-btn {
        width: 36px;
        height: 36px;
        top: 0.5rem;
        right: 0.5rem;
      }

      .thumbnail-image {
        width: 60px;
        height: 60px;
      }

      .lightbox-nav {
        width: 50px;
        height: 50px;
      }

      .lightbox-nav--prev {
        left: -3rem;
      }

      .lightbox-nav--next {
        right: -3rem;
      }

      .lightbox-overlay {
        padding: 1rem;
      }
    }
  `]
})
export class ProductGalleryComponent implements OnInit {
  @Input() images: string[] = [];
  @Input() productName: string = '';
  @Input() badges: { type: string; label: string; emoji: string }[] = [];

  currentIndex = 0;
  isLoading = true;
  showLightbox = false;

  get currentImage(): string {
    return this.images[this.currentIndex] || '';
  }

  ngOnInit() {
    if (this.images.length === 0) {
      this.images = ['/assets/images/placeholder-cake.jpg'];
    }
  }

  selectImage(index: number) {
    if (index >= 0 && index < this.images.length) {
      this.currentIndex = index;
      this.isLoading = true;
    }
  }

  previousImage() {
    if (this.currentIndex > 0) {
      this.selectImage(this.currentIndex - 1);
    }
  }

  nextImage() {
    if (this.currentIndex < this.images.length - 1) {
      this.selectImage(this.currentIndex + 1);
    }
  }

  onImageLoad() {
    this.isLoading = false;
  }

  onImageError(event: any) {
    this.isLoading = false;
    // Fallback para imagem placeholder
    event.target.src = '/assets/images/placeholder-cake.jpg';
  }

  openLightbox() {
    this.showLightbox = true;
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.showLightbox = false;
    document.body.style.overflow = '';
  }
}

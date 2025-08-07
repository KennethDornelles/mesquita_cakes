import { Component, Input, OnInit } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface Review {
  id: number;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: Date;
  verified: boolean;
  helpful: number;
  images?: string[];
}

@Component({
  selector: 'app-product-reviews',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="product-reviews">
      <!-- Reviews Header -->
      <div class="reviews-header">
        <h3 class="reviews-title">Avaliações dos Clientes</h3>
    
        <!-- Rating Summary -->
        <div class="rating-summary">
          <div class="overall-rating">
            <div class="rating-score">{{ averageRating.toFixed(1) }}</div>
            <div class="rating-stars">
              @for (star of getOverallStars(); track star; let i = $index) {
                <span
                  class="star"
                  [class.filled]="star">
                  ⭐
                </span>
              }
            </div>
            <div class="rating-count">{{ reviews.length }} avaliações</div>
          </div>
    
          <!-- Rating Breakdown -->
          <div class="rating-breakdown">
            @for (breakdown of ratingBreakdown; track breakdown) {
              <div class="rating-row">
                <span class="rating-label">{{ breakdown.stars }} estrelas</span>
                <div class="rating-bar">
                  <div class="rating-fill" [style.width.%]="breakdown.percentage"></div>
                </div>
                <span class="rating-percentage">{{ breakdown.percentage }}%</span>
              </div>
            }
          </div>
        </div>
      </div>
    
      <!-- Add Review Button -->
      <div class="add-review-section">
        @if (!showReviewForm) {
          <button
            class="btn btn--outline"
            (click)="toggleReviewForm()"
            >
            ✏️ Escrever Avaliação
          </button>
        }
      </div>
    
      <!-- Review Form -->
      @if (showReviewForm) {
        <div class="review-form-container">
          <form [formGroup]="reviewForm" (ngSubmit)="submitReview()" class="review-form">
            <h4>Deixe sua avaliação</h4>
            <!-- Rating Input -->
            <div class="form-group">
              <label class="form-label">Sua nota *</label>
              <div class="star-rating-input">
                @for (star of [1,2,3,4,5]; track star; let i = $index) {
                  <button
                    type="button"
                    class="star-btn"
                    [class.active]="newRating >= star"
                    (click)="setRating(star)">
                    ⭐
                  </button>
                }
              </div>
              @if (reviewForm.get('rating')?.invalid && reviewForm.get('rating')?.touched) {
                <div class="error-message">
                  Por favor, selecione uma nota
                </div>
              }
            </div>
            <!-- Name Input -->
            <div class="form-group">
              <label for="reviewName" class="form-label">Seu nome *</label>
              <input
                id="reviewName"
                type="text"
                formControlName="name"
                class="form-input"
                placeholder="Digite seu nome">
              @if (reviewForm.get('name')?.invalid && reviewForm.get('name')?.touched) {
                <div class="error-message">
                  Nome é obrigatório
                </div>
              }
            </div>
            <!-- Comment Input -->
            <div class="form-group">
              <label for="reviewComment" class="form-label">Seu comentário *</label>
              <textarea
                id="reviewComment"
                formControlName="comment"
                class="form-textarea"
                rows="4"
              placeholder="Conte-nos sobre sua experiência com este produto..."></textarea>
              @if (reviewForm.get('comment')?.invalid && reviewForm.get('comment')?.touched) {
                <div class="error-message">
                  Comentário é obrigatório
                </div>
              }
            </div>
            <!-- Form Actions -->
            <div class="form-actions">
              <button type="button" class="btn btn--secondary" (click)="cancelReview()">
                Cancelar
              </button>
              <button
                type="submit"
                class="btn btn--sweet"
                [disabled]="reviewForm.invalid || isSubmitting">
                @if (!isSubmitting) {
                  <span>Enviar Avaliação</span>
                }
                @if (isSubmitting) {
                  <span>Enviando...</span>
                }
              </button>
            </div>
          </form>
        </div>
      }
    
      <!-- Reviews List -->
      <div class="reviews-list">
        @for (review of displayedReviews; track review) {
          <div class="review-item">
            <div class="review-header">
              <div class="reviewer-info">
                <div class="reviewer-avatar">
                  @if (review.userAvatar) {
                    <img [src]="review.userAvatar" [alt]="review.userName">
                  }
                  @if (!review.userAvatar) {
                    <span>{{ getInitials(review.userName) }}</span>
                  }
                </div>
                <div class="reviewer-details">
                  <h5 class="reviewer-name">
                    {{ review.userName }}
                    @if (review.verified) {
                      <span class="verified-badge" title="Compra verificada">✅</span>
                    }
                  </h5>
                  <div class="review-meta">
                    <div class="review-stars">
                      @for (star of getReviewStars(review.rating); track star; let i = $index) {
                        <span
                          class="star"
                          [class.filled]="star">
                          ⭐
                        </span>
                      }
                    </div>
                    <span class="review-date">{{ formatDate(review.date) }}</span>
                  </div>
                </div>
              </div>
              <!-- Review Actions -->
              <div class="review-actions">
                <button
                  class="helpful-btn"
                  (click)="markHelpful(review)"
                  [class.active]="isMarkedHelpful(review.id)">
                  👍 Útil ({{ review.helpful }})
                </button>
              </div>
            </div>
            <div class="review-content">
              <p class="review-comment">{{ review.comment }}</p>
              <!-- Review Images -->
              @if (review.images && review.images.length > 0) {
                <div class="review-images">
                  @for (image of review.images; track image) {
                    <img
                      [src]="image"
                      [alt]="'Foto da avaliação de ' + review.userName"
                      class="review-image"
                      (click)="openImageModal(image)">
                  }
                </div>
              }
            </div>
          </div>
        }
    
        <!-- Load More Button -->
        @if (hasMoreReviews) {
          <div class="load-more-section">
            <button class="btn btn--outline" (click)="loadMoreReviews()">
              Ver mais avaliações
            </button>
          </div>
        }
    
        <!-- Empty State -->
        @if (reviews.length === 0) {
          <div class="empty-reviews">
            <div class="empty-icon">💭</div>
            <h4>Ainda não há avaliações</h4>
            <p>Seja o primeiro a avaliar este produto!</p>
            <button class="btn btn--sweet" (click)="toggleReviewForm()">
              Escrever primeira avaliação
            </button>
          </div>
        }
      </div>
    </div>
    
    <!-- Image Modal -->
    @if (showImageModal) {
      <div class="image-modal-overlay" (click)="closeImageModal()">
        <div class="image-modal-content" (click)="$event.stopPropagation()">
          <button class="image-modal-close" (click)="closeImageModal()">×</button>
          <img [src]="selectedImage" alt="Imagem da avaliação" class="modal-image">
        </div>
      </div>
    }
    `,
  styles: [`
    .product-reviews {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .reviews-header {
      margin-bottom: 2rem;
    }

    .reviews-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 1.5rem 0;
    }

    .rating-summary {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 2rem;
      align-items: start;
    }

    .overall-rating {
      text-align: center;
    }

    .rating-score {
      font-size: 3rem;
      font-weight: 700;
      color: #111827;
      line-height: 1;
    }

    .rating-stars {
      margin: 0.5rem 0;
    }

    .star {
      font-size: 1.25rem;
      color: #d1d5db;
    }

    .star.filled {
      color: #fbbf24;
    }

    .rating-count {
      color: #6b7280;
      font-size: 0.875rem;
    }

    .rating-breakdown {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .rating-row {
      display: grid;
      grid-template-columns: 80px 1fr 60px;
      gap: 1rem;
      align-items: center;
      font-size: 0.875rem;
    }

    .rating-label {
      color: #6b7280;
    }

    .rating-bar {
      height: 8px;
      background: #e5e7eb;
      border-radius: 4px;
      overflow: hidden;
    }

    .rating-fill {
      height: 100%;
      background: linear-gradient(90deg, #fbbf24, #f59e0b);
      transition: width 0.3s ease;
    }

    .rating-percentage {
      color: #6b7280;
      text-align: right;
    }

    .add-review-section {
      margin-bottom: 2rem;
    }

    .review-form-container {
      background: #f8fafc;
      border-radius: 1rem;
      padding: 1.5rem;
      margin-bottom: 2rem;
    }

    .review-form h4 {
      margin: 0 0 1.5rem 0;
      color: #111827;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-label {
      display: block;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.5rem;
    }

    .star-rating-input {
      display: flex;
      gap: 0.25rem;
      margin-bottom: 0.5rem;
    }

    .star-btn {
      background: none;
      border: none;
      font-size: 2rem;
      cursor: pointer;
      color: #d1d5db;
      transition: color 0.2s ease;
      padding: 0.25rem;
    }

    .star-btn.active,
    .star-btn:hover {
      color: #fbbf24;
    }

    .form-input,
    .form-textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: border-color 0.2s ease;
    }

    .form-input:focus,
    .form-textarea:focus {
      outline: none;
      border-color: #ec4899;
      box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
    }

    .form-textarea {
      resize: vertical;
      min-height: 100px;
    }

    .error-message {
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }

    .reviews-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .review-item {
      border: 1px solid #e5e7eb;
      border-radius: 1rem;
      padding: 1.5rem;
    }

    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .reviewer-info {
      display: flex;
      gap: 1rem;
    }

    .reviewer-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #ec4899, #be185d);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      overflow: hidden;
      flex-shrink: 0;
    }

    .reviewer-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .reviewer-name {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      color: #111827;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .verified-badge {
      font-size: 0.875rem;
    }

    .review-meta {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-top: 0.25rem;
    }

    .review-stars .star {
      font-size: 1rem;
    }

    .review-date {
      color: #6b7280;
      font-size: 0.875rem;
    }

    .helpful-btn {
      background: none;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .helpful-btn:hover,
    .helpful-btn.active {
      border-color: #ec4899;
      background: #fdf2f8;
      color: #ec4899;
    }

    .review-comment {
      color: #374151;
      line-height: 1.6;
      margin: 0 0 1rem 0;
    }

    .review-images {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .review-image {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: transform 0.2s ease;
    }

    .review-image:hover {
      transform: scale(1.05);
    }

    .load-more-section {
      text-align: center;
      margin-top: 1rem;
    }

    .empty-reviews {
      text-align: center;
      padding: 3rem 1rem;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .empty-reviews h4 {
      color: #111827;
      margin: 0 0 0.5rem 0;
    }

    .empty-reviews p {
      color: #6b7280;
      margin: 0 0 1.5rem 0;
    }

    /* Image Modal */
    .image-modal-overlay {
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

    .image-modal-content {
      position: relative;
      max-width: 90vw;
      max-height: 90vh;
    }

    .image-modal-close {
      position: absolute;
      top: -3rem;
      right: 0;
      background: none;
      border: none;
      color: white;
      font-size: 2rem;
      cursor: pointer;
      width: 3rem;
      height: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background-color 0.3s ease;
    }

    .image-modal-close:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .modal-image {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      border-radius: 0.5rem;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .product-reviews {
        padding: 1.5rem;
      }

      .rating-summary {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .overall-rating {
        text-align: left;
      }

      .rating-score {
        font-size: 2.5rem;
      }

      .review-header {
        flex-direction: column;
        gap: 1rem;
      }

      .form-actions {
        flex-direction: column;
      }

      .rating-row {
        grid-template-columns: 60px 1fr 50px;
        gap: 0.75rem;
      }
    }
  `]
})
export class ProductReviewsComponent implements OnInit {
  @Input() productId: number = 0;
  @Input() reviews: Review[] = [];

  reviewForm: FormGroup;
  showReviewForm = false;
  isSubmitting = false;
  newRating = 0;
  displayedReviews: Review[] = [];
  reviewsPerPage = 5;
  showImageModal = false;
  selectedImage = '';
  helpfulReviews = new Set<number>();

  constructor(private fb: FormBuilder) {
    this.reviewForm = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1)]],
      name: ['', [Validators.required, Validators.minLength(2)]],
      comment: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit() {
    this.loadInitialReviews();
  }

  get averageRating(): number {
    if (this.reviews.length === 0) return 0;
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / this.reviews.length;
  }

  get ratingBreakdown() {
    const breakdown = [5, 4, 3, 2, 1].map(stars => {
      const count = this.reviews.filter(r => r.rating === stars).length;
      const percentage = this.reviews.length > 0 ? (count / this.reviews.length) * 100 : 0;
      return { stars, count, percentage: Math.round(percentage) };
    });
    return breakdown;
  }

  get hasMoreReviews(): boolean {
    return this.displayedReviews.length < this.reviews.length;
  }

  getOverallStars() {
    return Array(5).fill(false).map((_, i) => i < Math.round(this.averageRating));
  }

  getReviewStars(rating: number) {
    return Array(5).fill(false).map((_, i) => i < rating);
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  loadInitialReviews() {
    this.displayedReviews = this.reviews.slice(0, this.reviewsPerPage);
  }

  loadMoreReviews() {
    const currentLength = this.displayedReviews.length;
    const newReviews = this.reviews.slice(currentLength, currentLength + this.reviewsPerPage);
    this.displayedReviews = [...this.displayedReviews, ...newReviews];
  }

  toggleReviewForm() {
    this.showReviewForm = !this.showReviewForm;
    if (!this.showReviewForm) {
      this.resetReviewForm();
    }
  }

  setRating(rating: number) {
    this.newRating = rating;
    this.reviewForm.patchValue({ rating });
  }

  submitReview() {
    if (this.reviewForm.valid) {
      this.isSubmitting = true;
      
      const newReview: Review = {
        id: Date.now(),
        userName: this.reviewForm.value.name,
        rating: this.reviewForm.value.rating,
        comment: this.reviewForm.value.comment,
        date: new Date(),
        verified: false,
        helpful: 0
      };

      // Simular envio da avaliação
      setTimeout(() => {
        this.reviews.unshift(newReview);
        this.loadInitialReviews();
        this.isSubmitting = false;
        this.showReviewForm = false;
        this.resetReviewForm();
      }, 1500);
    }
  }

  cancelReview() {
    this.showReviewForm = false;
    this.resetReviewForm();
  }

  resetReviewForm() {
    this.reviewForm.reset();
    this.newRating = 0;
  }

  markHelpful(review: Review) {
    if (!this.isMarkedHelpful(review.id)) {
      review.helpful++;
      this.helpfulReviews.add(review.id);
    }
  }

  isMarkedHelpful(reviewId: number): boolean {
    return this.helpfulReviews.has(reviewId);
  }

  openImageModal(image: string) {
    this.selectedImage = image;
    this.showImageModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeImageModal() {
    this.showImageModal = false;
    this.selectedImage = '';
    document.body.style.overflow = '';
  }
}

import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [],
  template: `
    <section class="hero-section dots-bg">
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title font-primary animate-fade-in">
              Mesquita Cakes 🎂
            </h1>
            <p class="hero-subtitle text-xl animate-slide-in-up">
              Bolos artesanais feitos com amor e carinho
            </p>
            <p class="hero-description">
              Transformamos momentos especiais em experiências ainda mais doces. 
              Cada bolo é uma obra de arte feita especialmente para você! ✨
            </p>
            <div class="hero-actions">
              <button 
                class="btn btn--sweet btn--lg hover-glow"
                (click)="onViewMenu()">
                Ver Cardápio ✨
              </button>
              <button 
                class="btn btn--outline btn--lg"
                (click)="onContact()">
                Fazer Pedido 📞
              </button>
            </div>
          </div>
          
          <div class="hero-image">
            <div class="cake-display">
              <div class="main-cake animate-sweet-bounce">🎂</div>
              <div class="floating-elements">
                <span class="floating-item heart-1 animate-heart-beat">💖</span>
                <span class="floating-item star-1 animate-sparkle">✨</span>
                <span class="floating-item cupcake-1">🧁</span>
                <span class="floating-item star-2 animate-sparkle">⭐</span>
                <span class="floating-item heart-2 animate-heart-beat">💕</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Stats Section -->
        <div class="hero-stats">
          <div class="stat-item">
            <div class="stat-number">500+</div>
            <div class="stat-label">Bolos Entregues</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">4.9⭐</div>
            <div class="stat-label">Avaliação</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">100%</div>
            <div class="stat-label">Artesanal</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">24h</div>
            <div class="stat-label">Encomendas</div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero-section {
      min-height: 80vh;
      display: flex;
      align-items: center;
      background: linear-gradient(135deg, #fef7ed 0%, #fce7f3 100%);
      position: relative;
      overflow: hidden;
    }

    .dots-bg::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: radial-gradient(circle, #ec4899 1px, transparent 1px);
      background-size: 50px 50px;
      opacity: 0.1;
      z-index: 1;
    }

    .hero-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
      position: relative;
      z-index: 2;
    }

    .hero-title {
      font-size: 4rem;
      color: #ec4899;
      margin-bottom: 1rem;
      line-height: 1.1;
      text-shadow: 2px 2px 4px rgba(236, 72, 153, 0.1);
    }

    .hero-subtitle {
      color: #14b8a6;
      margin-bottom: 1.5rem;
      font-weight: 600;
    }

    .hero-description {
      color: #6b7280;
      font-size: 1.125rem;
      line-height: 1.6;
      margin-bottom: 2.5rem;
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .hero-image {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .cake-display {
      position: relative;
      width: 300px;
      height: 300px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .main-cake {
      font-size: 8rem;
      filter: drop-shadow(0 10px 20px rgba(236, 72, 153, 0.2));
    }

    .floating-elements {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    .floating-item {
      position: absolute;
      font-size: 2rem;
      animation-duration: 3s;
      animation-iteration-count: infinite;
    }

    .heart-1 {
      top: 10%;
      left: 20%;
      animation-delay: 0s;
    }

    .star-1 {
      top: 20%;
      right: 15%;
      animation-delay: 1s;
    }

    .cupcake-1 {
      bottom: 25%;
      left: 10%;
      animation: float 4s ease-in-out infinite;
    }

    .star-2 {
      bottom: 15%;
      right: 20%;
      animation-delay: 2s;
    }

    .heart-2 {
      top: 60%;
      right: 10%;
      animation-delay: 1.5s;
    }

    .hero-stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
      margin-top: 4rem;
      padding-top: 3rem;
      border-top: 1px solid rgba(236, 72, 153, 0.2);
    }

    .stat-item {
      text-align: center;
    }

    .stat-number {
      font-family: 'Fredoka One', cursive;
      font-size: 2.5rem;
      color: #ec4899;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      color: #6b7280;
      font-size: 0.875rem;
      font-weight: 500;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }

    /* Responsive */
    @media (max-width: 768px) {
      .hero-content {
        grid-template-columns: 1fr;
        gap: 3rem;
        text-align: center;
      }

      .hero-title {
        font-size: 3rem;
      }

      .hero-stats {
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
      }

      .main-cake {
        font-size: 6rem;
      }

      .cake-display {
        width: 250px;
        height: 250px;
      }
    }

    @media (max-width: 480px) {
      .hero-actions {
        flex-direction: column;
        align-items: center;
      }

      .hero-stats {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HeroSectionComponent {
  @Output() viewMenuClick = new EventEmitter<void>();
  @Output() contactClick = new EventEmitter<void>();

  onViewMenu() {
    this.viewMenuClick.emit();
  }

  onContact() {
    this.contactClick.emit();
  }
}

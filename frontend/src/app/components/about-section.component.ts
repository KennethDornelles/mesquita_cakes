import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about-section',
  standalone: true,
  imports: [],
  template: `
    <section class="about-section section bg-gradient-sweet">
      <div class="container">
        <div class="about-content grid grid--2 gap-12 items-center">
          
          <div class="about-text">
            <h2 class="about-title text-4xl text-white mb-6">
              Feito com Amor e Tradição 💖
            </h2>
            
            <div class="about-description text-white/90 space-y-4">
              <p class="text-lg leading-relaxed">
                Na <strong>Mesquita Cakes</strong>, cada bolo conta uma história especial. 
                Há mais de 10 anos criamos momentos únicos através dos nossos sabores artesanais.
              </p>
              
              <p>
                Utilizamos apenas ingredientes premium e receitas desenvolvidas com carinho, 
                garantindo que cada mordida seja uma experiência inesquecível.
              </p>
              
              <p>
                Nossos bolos não são apenas sobremesas, são memórias afetivas que 
                acompanham seus momentos mais especiais! ✨
              </p>
            </div>
            
            <div class="about-features mt-8">
              <div class="feature-grid grid grid--2 gap-4">
                <div class="feature-item">
                  <div class="feature-icon">🏆</div>
                  <div class="feature-text">
                    <h4>Qualidade Premium</h4>
                    <p>Ingredientes selecionados</p>
                  </div>
                </div>
                
                <div class="feature-item">
                  <div class="feature-icon">👩‍🍳</div>
                  <div class="feature-text">
                    <h4>Feito à Mão</h4>
                    <p>Processo 100% artesanal</p>
                  </div>
                </div>
                
                <div class="feature-item">
                  <div class="feature-icon">🚚</div>
                  <div class="feature-text">
                    <h4>Entrega Rápida</h4>
                    <p>Fresquinho na sua casa</p>
                  </div>
                </div>
                
                <div class="feature-item">
                  <div class="feature-icon">🎨</div>
                  <div class="feature-text">
                    <h4>Personalização</h4>
                    <p>Do seu jeitinho</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="about-actions mt-8">
              <button 
                class="btn btn--outline-white btn--lg hover-lift"
                (click)="goToAbout()"
                style="pointer-events: auto !important; z-index: 1000; position: relative;">
                Nossa História 📖
              </button>
            </div>
          </div>
          
          <div class="about-image">
            <div class="image-container">
              <div class="main-visual">
                <div class="chef-emoji">👩‍🍳</div>
                <div class="floating-treats">
                  <div class="treat treat-1">🍰</div>
                  <div class="treat treat-2">🧁</div>
                  <div class="treat treat-3">🥧</div>
                  <div class="treat treat-4">🍪</div>
                </div>
              </div>
              
              <div class="decorative-elements">
                <div class="sparkle sparkle-1">✨</div>
                <div class="sparkle sparkle-2">⭐</div>
                <div class="sparkle sparkle-3">💫</div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  `,
  styles: [`
    .about-section {
      background: linear-gradient(135deg, #ec4899 0%, #ff6b9d 50%, #ff8cc8 100%);
      position: relative;
      overflow: hidden;
    }

    .about-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
      background-size: 40px 40px;
      z-index: 1;
    }

    .about-content {
      position: relative;
      z-index: 2;
    }

    .about-title {
      font-family: 'Fredoka One', cursive;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    }

    .about-description strong {
      font-weight: 700;
    }

    .feature-grid {
      gap: 1.5rem;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: rgba(255, 255, 255, 0.1);
      padding: 1rem;
      border-radius: 1rem;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .feature-icon {
      font-size: 2rem;
      flex-shrink: 0;
    }

    .feature-text h4 {
      color: white;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .feature-text p {
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.875rem;
    }

    .about-image {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .image-container {
      position: relative;
      width: 300px;
      height: 300px;
    }

    .main-visual {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .chef-emoji {
      font-size: 6rem;
      filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.2));
      z-index: 2;
      position: relative;
    }

    .floating-treats {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    .treat {
      position: absolute;
      font-size: 2.5rem;
      animation: float 4s ease-in-out infinite;
    }

    .treat-1 {
      top: 10%;
      left: 20%;
      animation-delay: 0s;
    }

    .treat-2 {
      top: 20%;
      right: 15%;
      animation-delay: 1s;
    }

    .treat-3 {
      bottom: 25%;
      left: 15%;
      animation-delay: 2s;
    }

    .treat-4 {
      bottom: 15%;
      right: 20%;
      animation-delay: 3s;
    }

    .decorative-elements {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    .sparkle {
      position: absolute;
      font-size: 1.5rem;
      animation: sparkle 3s ease-in-out infinite;
    }

    .sparkle-1 {
      top: 5%;
      left: 10%;
      animation-delay: 0.5s;
    }

    .sparkle-2 {
      top: 60%;
      right: 5%;
      animation-delay: 1.5s;
    }

    .sparkle-3 {
      bottom: 10%;
      left: 5%;
      animation-delay: 2.5s;
    }

    .btn--outline-white {
      background: transparent;
      border: 2px solid white;
      color: white;
      transition: all 0.3s ease;
    }

    .btn--outline-white:hover {
      background: white;
      color: #ec4899;
    }

    @keyframes float {
      0%, 100% { 
        transform: translateY(0px) rotate(0deg); 
      }
      50% { 
        transform: translateY(-15px) rotate(5deg); 
      }
    }

    @keyframes sparkle {
      0%, 100% { 
        opacity: 0.4;
        transform: scale(1);
      }
      50% { 
        opacity: 1;
        transform: scale(1.2);
      }
    }

    /* Responsive */
    @media (max-width: 768px) {
      .about-content {
        grid-template-columns: 1fr;
        text-align: center;
      }

      .about-title {
        font-size: 2.5rem;
      }

      .feature-grid {
        grid-template-columns: 1fr;
      }

      .image-container {
        width: 250px;
        height: 250px;
      }

      .chef-emoji {
        font-size: 4rem;
      }

      .treat {
        font-size: 2rem;
      }
    }
  `]
})
export class AboutSectionComponent {
  constructor(private router: Router) {}

  goToAbout() {
    console.log('🔥 Nossa História clicked!');
    this.router.navigate(['/sobre']);
  }
}

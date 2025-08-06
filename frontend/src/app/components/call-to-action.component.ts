import { Component } from '@angular/core';

@Component({
  selector: 'app-call-to-action',
  standalone: true,
  imports: [],
  template: `
    <section class="cta-section section bg-gradient-primary">
      <div class="container">
        <div class="cta-content text-center">
          <div class="cta-emoji-group">
            <span class="cta-emoji main-emoji">🎂</span>
            <span class="cta-emoji floating-emoji-1">✨</span>
            <span class="cta-emoji floating-emoji-2">💖</span>
            <span class="cta-emoji floating-emoji-3">🧁</span>
          </div>
          
          <h2 class="cta-title text-white mb-6">
            Pronto para Adoçar seu Dia?
          </h2>
          
          <p class="cta-subtitle text-white/90 text-xl mb-8 max-w-2xl mx-auto">
            Faça seu pedido agora e receba nossos deliciosos bolos artesanais 
            fresquinhos na sua casa! 🏠💕
          </p>
          
          <div class="cta-features grid grid--3 gap-6 mb-10">
            <div class="feature-item">
              <div class="feature-icon">🚚</div>
              <h4 class="feature-title">Entrega Rápida</h4>
              <p class="feature-desc">Receba em até 2 horas</p>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon">🏆</div>
              <h4 class="feature-title">Qualidade Garantida</h4>
              <p class="feature-desc">Ingredientes premium</p>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon">💳</div>
              <h4 class="feature-title">Pagamento Fácil</h4>
              <p class="feature-desc">PIX, cartão ou dinheiro</p>
            </div>
          </div>
          
          <div class="cta-actions">
            <button class="btn btn--large btn--white hover-lift">
              🛒 Fazer Pedido Agora
            </button>
            <button class="btn btn--large btn--outline-white">
              📞 Falar no WhatsApp
            </button>
          </div>
          
          <div class="cta-guarantee mt-8">
            <div class="guarantee-badge">
              <span class="guarantee-icon">🛡️</span>
              <span class="guarantee-text">
                <strong>100% Satisfação Garantida</strong><br>
                Ou devolvemos seu dinheiro
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Floating decorative elements -->
      <div class="decoration-elements">
        <div class="decoration decoration-1">🍰</div>
        <div class="decoration decoration-2">🥧</div>
        <div class="decoration decoration-3">🍪</div>
        <div class="decoration decoration-4">🧁</div>
        <div class="decoration decoration-5">🍮</div>
        <div class="decoration decoration-6">🎂</div>
      </div>
    </section>
  `,
  styles: [`
    .cta-section {
      background: linear-gradient(135deg, #ec4899 0%, #be185d 100%);
      position: relative;
      overflow: hidden;
      min-height: 600px;
      display: flex;
      align-items: center;
    }

    .cta-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
      background-size: 50px 50px;
      z-index: 1;
    }

    .cta-content {
      position: relative;
      z-index: 2;
    }

    .cta-emoji-group {
      position: relative;
      margin-bottom: 2rem;
      height: 120px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .main-emoji {
      font-size: 6rem;
      filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3));
      animation: bounce 2s ease-in-out infinite;
    }

    .floating-emoji-1,
    .floating-emoji-2,
    .floating-emoji-3 {
      position: absolute;
      font-size: 2rem;
      animation: float 3s ease-in-out infinite;
    }

    .floating-emoji-1 {
      top: 10px;
      left: -60px;
      animation-delay: 0s;
    }

    .floating-emoji-2 {
      top: 20px;
      right: -50px;
      animation-delay: 1s;
    }

    .floating-emoji-3 {
      bottom: 10px;
      left: -40px;
      animation-delay: 2s;
    }

    .cta-title {
      font-family: 'Fredoka One', cursive;
      font-size: 3.5rem;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
      line-height: 1.1;
    }

    .cta-subtitle {
      font-weight: 500;
      line-height: 1.5;
    }

    .cta-features {
      max-width: 800px;
      margin: 0 auto 2.5rem;
    }

    .feature-item {
      background: rgba(255, 255, 255, 0.1);
      padding: 1.5rem;
      border-radius: 1rem;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: transform 0.3s ease;
    }

    .feature-item:hover {
      transform: translateY(-4px);
    }

    .feature-icon {
      font-size: 2.5rem;
      margin-bottom: 0.75rem;
    }

    .feature-title {
      color: white;
      font-weight: 600;
      margin-bottom: 0.5rem;
      font-size: 1.125rem;
    }

    .feature-desc {
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.875rem;
    }

    .cta-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .btn--large {
      padding: 1rem 2rem;
      font-size: 1.125rem;
      font-weight: 600;
    }

    .btn--white {
      background: white;
      color: #ec4899;
      border: none;
    }

    .btn--white:hover {
      background: #f9fafb;
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    }

    .btn--outline-white {
      background: transparent;
      color: white;
      border: 2px solid white;
    }

    .btn--outline-white:hover {
      background: white;
      color: #ec4899;
    }

    .cta-guarantee {
      opacity: 0.9;
    }

    .guarantee-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      background: rgba(255, 255, 255, 0.15);
      padding: 1rem 1.5rem;
      border-radius: 2rem;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .guarantee-icon {
      font-size: 1.5rem;
    }

    .guarantee-text {
      color: white;
      font-size: 0.875rem;
      line-height: 1.4;
    }

    .guarantee-text strong {
      font-weight: 700;
    }

    .decoration-elements {
      position: absolute;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
    }

    .decoration {
      position: absolute;
      font-size: 2rem;
      opacity: 0.3;
      animation: decorationFloat 6s ease-in-out infinite;
    }

    .decoration-1 { top: 10%; left: 5%; animation-delay: 0s; }
    .decoration-2 { top: 20%; right: 8%; animation-delay: 1s; }
    .decoration-3 { top: 60%; left: 3%; animation-delay: 2s; }
    .decoration-4 { bottom: 30%; right: 5%; animation-delay: 3s; }
    .decoration-5 { bottom: 15%; left: 8%; animation-delay: 4s; }
    .decoration-6 { top: 70%; right: 3%; animation-delay: 5s; }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    @keyframes float {
      0%, 100% { 
        transform: translateY(0) rotate(0deg); 
      }
      50% { 
        transform: translateY(-15px) rotate(5deg); 
      }
    }

    @keyframes decorationFloat {
      0%, 100% { 
        transform: translateY(0) rotate(0deg); 
        opacity: 0.2;
      }
      50% { 
        transform: translateY(-20px) rotate(10deg); 
        opacity: 0.5;
      }
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .cta-features {
        grid-template-columns: 1fr;
        max-width: 400px;
      }
    }

    @media (max-width: 768px) {
      .cta-title {
        font-size: 2.5rem;
      }

      .cta-subtitle {
        font-size: 1.125rem;
      }

      .main-emoji {
        font-size: 4rem;
      }

      .cta-actions {
        flex-direction: column;
        align-items: center;
      }

      .btn--large {
        width: 100%;
        max-width: 300px;
      }

      .floating-emoji-1,
      .floating-emoji-2,
      .floating-emoji-3 {
        display: none;
      }
    }

    @media (max-width: 480px) {
      .cta-title {
        font-size: 2rem;
      }

      .guarantee-badge {
        flex-direction: column;
        text-align: center;
        gap: 0.5rem;
      }
    }
  `]
})
export class CallToActionComponent {
}

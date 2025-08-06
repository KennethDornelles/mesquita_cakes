import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  template: `
    <footer class="footer">
      <div class="container">
        
        <!-- Main Footer Content -->
        <div class="footer-content">
          <div class="footer-sections grid grid--4 gap-8">
            
            <!-- Company Info -->
            <div class="footer-section">
              <div class="footer-logo">
                <div class="logo">
                  <span class="logo-emoji">🎂</span>
                  <span class="logo-text">Mesquita Cakes</span>
                </div>
              </div>
              <p class="footer-description">
                Criando momentos doces e especiais há mais de 10 anos. 
                Cada bolo é feito com amor e ingredientes premium.
              </p>
              <div class="social-links">
                <a href="#" class="social-link" aria-label="Instagram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" class="social-link" aria-label="Facebook">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" class="social-link" aria-label="WhatsApp">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <!-- Quick Links -->
            <div class="footer-section">
              <h4 class="footer-title">Links Rápidos</h4>
              <ul class="footer-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#cardapio">Cardápio</a></li>
                <li><a href="#sobre">Sobre Nós</a></li>
                <li><a href="#contato">Contato</a></li>
                <li><a href="#pedidos">Meus Pedidos</a></li>
              </ul>
            </div>
            
            <!-- Categories -->
            <div class="footer-section">
              <h4 class="footer-title">Categorias</h4>
              <ul class="footer-links">
                <li><a href="#bolos">Bolos Especiais</a></li>
                <li><a href="#tortas">Tortas</a></li>
                <li><a href="#cupcakes">Cupcakes</a></li>
                <li><a href="#sobremesas">Sobremesas</a></li>
                <li><a href="#personalizados">Personalizados</a></li>
              </ul>
            </div>
            
            <!-- Contact Info -->
            <div class="footer-section">
              <h4 class="footer-title">Fale Conosco</h4>
              <div class="contact-info">
                <div class="contact-item">
                  <span class="contact-icon">📞</span>
                  <span class="contact-text">(11) 99999-9999</span>
                </div>
                <div class="contact-item">
                  <span class="contact-icon">📧</span>
                  <span class="contact-text">contato&commat;mesquitacakes.com</span>
                </div>
                <div class="contact-item">
                  <span class="contact-icon">📍</span>
                  <span class="contact-text">São Paulo, SP</span>
                </div>
                <div class="contact-item">
                  <span class="contact-icon">🕒</span>
                  <span class="contact-text">Seg-Sáb: 8h às 18h</span>
                </div>
              </div>
              
              <button class="whatsapp-btn btn btn--sweet btn--sm mt-4" (click)="openWhatsApp()">
                💬 Fazer Pedido
              </button>
            </div>
            
          </div>
        </div>
        
        <!-- Newsletter Section -->
        <div class="newsletter-section">
          <div class="newsletter-content">
            <div class="newsletter-text">
              <h3 class="newsletter-title">
                Receba nossas novidades! 📬
              </h3>
              <p class="newsletter-description">
                Fique por dentro de novos sabores, promoções especiais e dicas doces
              </p>
            </div>
            <div class="newsletter-form">
              <div class="input-group">
                <input 
                  type="email" 
                  placeholder="Seu melhor e-mail"
                  class="newsletter-input">
                <button class="newsletter-btn btn btn--primary">
                  Inscrever-se ✨
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Bottom Footer -->
        <div class="footer-bottom">
          <div class="footer-bottom-content">
            <div class="footer-bottom-left">
              <p>&copy; 2024 Mesquita Cakes. Todos os direitos reservados.</p>
              <p class="footer-love">Feito com 💖 para adoçar seus momentos especiais</p>
            </div>
            <div class="footer-bottom-right">
              <a href="#privacidade" class="footer-legal">Política de Privacidade</a>
              <a href="#termos" class="footer-legal">Termos de Uso</a>
            </div>
          </div>
        </div>
        
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
      color: white;
      margin-top: auto;
    }

    .footer-content {
      padding: 4rem 0 2rem;
    }

    .footer-sections {
      margin-bottom: 3rem;
    }

    .footer-section {
      /* Grid handles the layout */
    }

    .footer-logo {
      margin-bottom: 1.5rem;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .logo-emoji {
      font-size: 2rem;
      filter: drop-shadow(0 2px 4px rgba(236, 72, 153, 0.5));
    }

    .logo-text {
      font-family: 'Fredoka One', cursive;
      font-size: 1.5rem;
      color: white;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
    }

    .footer-description {
      color: #d1d5db;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .social-links {
      display: flex;
      gap: 1rem;
    }

    .social-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: rgba(236, 72, 153, 0.2);
      border-radius: 50%;
      color: #ec4899;
      transition: all 0.3s ease;
    }

    .social-link:hover {
      background: #ec4899;
      color: white;
      transform: translateY(-2px);
    }

    .footer-title {
      font-family: 'Quicksand', sans-serif;
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      color: #ec4899;
    }

    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .footer-links li {
      margin-bottom: 0.75rem;
    }

    .footer-links a {
      color: #d1d5db;
      text-decoration: none;
      transition: color 0.3s ease;
      font-size: 0.9rem;
    }

    .footer-links a:hover {
      color: #ec4899;
    }

    .contact-info {
      space-y: 1rem;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .contact-icon {
      font-size: 1.25rem;
      width: 24px;
      text-align: center;
    }

    .contact-text {
      color: #d1d5db;
      font-size: 0.9rem;
    }

    .whatsapp-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .newsletter-section {
      background: rgba(236, 72, 153, 0.1);
      border-radius: 1.5rem;
      padding: 2.5rem;
      margin-bottom: 3rem;
      border: 1px solid rgba(236, 72, 153, 0.2);
    }

    .newsletter-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      align-items: center;
    }

    .newsletter-title {
      font-family: 'Fredoka One', cursive;
      font-size: 1.75rem;
      color: #ec4899;
      margin-bottom: 0.5rem;
    }

    .newsletter-description {
      color: #d1d5db;
      line-height: 1.5;
    }

    .input-group {
      display: flex;
      gap: 0.75rem;
    }

    .newsletter-input {
      flex: 1;
      padding: 0.75rem 1rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 0.5rem;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      font-size: 0.9rem;
      backdrop-filter: blur(10px);
    }

    .newsletter-input::placeholder {
      color: rgba(255, 255, 255, 0.6);
    }

    .newsletter-input:focus {
      outline: none;
      border-color: #ec4899;
      box-shadow: 0 0 0 2px rgba(236, 72, 153, 0.2);
    }

    .newsletter-btn {
      white-space: nowrap;
      flex-shrink: 0;
    }

    .footer-bottom {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 2rem;
      padding-bottom: 2rem;
    }

    .footer-bottom-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .footer-bottom-left p {
      margin: 0;
      color: #9ca3af;
      font-size: 0.875rem;
    }

    .footer-love {
      margin-top: 0.25rem !important;
      color: #ec4899 !important;
      font-style: italic;
    }

    .footer-bottom-right {
      display: flex;
      gap: 2rem;
    }

    .footer-legal {
      color: #9ca3af;
      text-decoration: none;
      font-size: 0.875rem;
      transition: color 0.3s ease;
    }

    .footer-legal:hover {
      color: #ec4899;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .footer-sections {
        grid-template-columns: repeat(2, 1fr);
      }

      .newsletter-content {
        grid-template-columns: 1fr;
        text-align: center;
      }
    }

    @media (max-width: 768px) {
      .footer-sections {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .footer-content {
        padding: 3rem 0 1.5rem;
      }

      .newsletter-section {
        padding: 2rem 1.5rem;
      }

      .input-group {
        flex-direction: column;
      }

      .footer-bottom-content {
        flex-direction: column;
        gap: 1.5rem;
        text-align: center;
      }

      .footer-bottom-right {
        flex-direction: column;
        gap: 1rem;
      }
    }

    @media (max-width: 480px) {
      .newsletter-title {
        font-size: 1.5rem;
      }

      .social-links {
        justify-content: center;
      }
    }
  `]
})
export class FooterComponent {
  openWhatsApp() {
    const message = encodeURIComponent('Olá! Gostaria de fazer um pedido na Mesquita Cakes 🎂');
    const whatsappUrl = `https://wa.me/5511999999999?text=${message}`;
    window.open(whatsappUrl, '_blank');
  }
}

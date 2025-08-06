import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface ContactInfo {
  icon: string;
  title: string;
  description: string;
  value: string;
  link?: string;
}

interface FAQ {
  question: string;
  answer: string;
  isExpanded: boolean;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="contact-page">
      <div class="container">
        <!-- Hero Section -->
        <div class="hero-section">
          <div class="hero-content">
            <h1 class="hero-title">📞 Entre em Contato</h1>
            <p class="hero-subtitle">
              Estamos aqui para ajudar! Entre em contato conosco através de qualquer um dos canais abaixo
            </p>
          </div>
          <div class="hero-image">
            <div class="contact-illustration">
              <span class="illustration-emoji">🧁</span>
              <span class="illustration-emoji">🎂</span>
              <span class="illustration-emoji">🍰</span>
            </div>
          </div>
        </div>

        <div class="contact-layout">
          <!-- Contact Information -->
          <div class="contact-info-section">
            <h2 class="section-title">💬 Fale Conosco</h2>
            
            <div class="contact-cards">
              <div *ngFor="let info of contactInfo" class="contact-card">
                <div class="contact-icon">{{ info.icon }}</div>
                <div class="contact-content">
                  <h3>{{ info.title }}</h3>
                  <p>{{ info.description }}</p>
                  <a 
                    *ngIf="info.link" 
                    [href]="info.link" 
                    class="contact-link"
                    target="_blank"
                    rel="noopener noreferrer">
                    {{ info.value }}
                  </a>
                  <span *ngIf="!info.link" class="contact-value">{{ info.value }}</span>
                </div>
              </div>
            </div>

            <!-- Business Hours -->
            <div class="business-hours">
              <h3>🕒 Horário de Funcionamento</h3>
              <div class="hours-list">
                <div class="hours-item">
                  <span class="day">Segunda a Sexta</span>
                  <span class="time">8:00 - 18:00</span>
                </div>
                <div class="hours-item">
                  <span class="day">Sábado</span>
                  <span class="time">8:00 - 16:00</span>
                </div>
                <div class="hours-item">
                  <span class="day">Domingo</span>
                  <span class="time">10:00 - 14:00</span>
                </div>
                <div class="hours-item special">
                  <span class="day">Feriados</span>
                  <span class="time">Consulte nossa agenda</span>
                </div>
              </div>
            </div>

            <!-- Location Map -->
            <div class="location-section">
              <h3>📍 Nossa Localização</h3>
              <div class="location-info">
                <p class="address">
                  <strong>Mesquita Cakes</strong><br>
                  Rua das Delícias, 123<br>
                  Centro - Mesquita/RJ<br>
                  CEP: 26550-000
                </p>
              </div>
              <div class="map-placeholder">
                <div class="map-content">
                  <span class="map-icon">🗺️</span>
                  <p>Mapa interativo em breve</p>
                  <a 
                    href="https://maps.google.com/?q=Mesquita+RJ" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="btn btn--outline btn--sm">
                    Ver no Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Form -->
          <div class="contact-form-section">
            <h2 class="section-title">✉️ Envie uma Mensagem</h2>
            
            <form [formGroup]="contactForm" (ngSubmit)="submitForm()" class="contact-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="name" class="form-label">Nome completo *</label>
                  <input
                    id="name"
                    type="text"
                    formControlName="name"
                    class="form-input"
                    placeholder="Seu nome completo">
                  <div *ngIf="contactForm.get('name')?.invalid && contactForm.get('name')?.touched" 
                       class="form-error">
                    Nome é obrigatório
                  </div>
                </div>

                <div class="form-group">
                  <label for="email" class="form-label">E-mail *</label>
                  <input
                    id="email"
                    type="email"
                    formControlName="email"
                    class="form-input"
                    placeholder="seu@email.com">
                  <div *ngIf="contactForm.get('email')?.invalid && contactForm.get('email')?.touched" 
                       class="form-error">
                    E-mail válido é obrigatório
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="phone" class="form-label">Telefone</label>
                  <input
                    id="phone"
                    type="tel"
                    formControlName="phone"
                    class="form-input"
                    placeholder="(11) 99999-9999">
                </div>

                <div class="form-group">
                  <label for="subject" class="form-label">Assunto *</label>
                  <select id="subject" formControlName="subject" class="form-select">
                    <option value="">Selecione um assunto</option>
                    <option value="pedido">Dúvidas sobre pedidos</option>
                    <option value="produtos">Informações sobre produtos</option>
                    <option value="entrega">Entrega e retirada</option>
                    <option value="evento">Encomendas para eventos</option>
                    <option value="sugestao">Sugestões</option>
                    <option value="reclamacao">Reclamações</option>
                    <option value="outros">Outros</option>
                  </select>
                  <div *ngIf="contactForm.get('subject')?.invalid && contactForm.get('subject')?.touched" 
                       class="form-error">
                    Assunto é obrigatório
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group full-width">
                  <label for="message" class="form-label">Mensagem *</label>
                  <textarea
                    id="message"
                    formControlName="message"
                    class="form-textarea"
                    rows="6"
                    placeholder="Escreva sua mensagem aqui..."></textarea>
                  <div *ngIf="contactForm.get('message')?.invalid && contactForm.get('message')?.touched" 
                       class="form-error">
                    Mensagem é obrigatória (mínimo 10 caracteres)
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group full-width">
                  <label class="form-checkbox">
                    <input type="checkbox" formControlName="newsletter">
                    <span class="checkmark"></span>
                    Desejo receber novidades e promoções por e-mail
                  </label>
                </div>
              </div>

              <div class="form-actions">
                <button 
                  type="submit" 
                  class="btn btn--sweet"
                  [disabled]="contactForm.invalid || isSubmitting"
                  [class.loading]="isSubmitting">
                  <span *ngIf="!isSubmitting">✉️ Enviar Mensagem</span>
                  <span *ngIf="isSubmitting">Enviando...</span>
                </button>
              </div>
            </form>

            <!-- Success Message -->
            <div *ngIf="showSuccessMessage" class="success-message">
              <div class="success-icon">✅</div>
              <h3>Mensagem enviada com sucesso!</h3>
              <p>Agradecemos o seu contato. Responderemos em breve através do e-mail informado.</p>
            </div>
          </div>
        </div>

        <!-- FAQ Section -->
        <div class="faq-section">
          <h2 class="section-title">❓ Perguntas Frequentes</h2>
          <p class="section-subtitle">
            Confira as respostas para as dúvidas mais comuns dos nossos clientes
          </p>

          <div class="faq-list">
            <div *ngFor="let faq of faqs" class="faq-item">
              <button 
                class="faq-question" 
                (click)="toggleFAQ(faq)"
                [class.expanded]="faq.isExpanded">
                <span>{{ faq.question }}</span>
                <span class="faq-icon">{{ faq.isExpanded ? '−' : '+' }}</span>
              </button>
              <div class="faq-answer" [class.expanded]="faq.isExpanded">
                <p>{{ faq.answer }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Social Media -->
        <div class="social-section">
          <h2 class="section-title">📱 Redes Sociais</h2>
          <p class="section-subtitle">
            Siga-nos nas redes sociais para ficar por dentro das novidades
          </p>

          <div class="social-links">
            <a 
              href="https://instagram.com/mesquitacakes" 
              target="_blank" 
              rel="noopener noreferrer"
              class="social-link instagram">
              <span class="social-icon">📷</span>
              <div class="social-content">
                <h3>Instagram</h3>
                <p>&#64;mesquitacakes</p>
              </div>
            </a>

            <a 
              href="https://facebook.com/mesquitacakes" 
              target="_blank" 
              rel="noopener noreferrer"
              class="social-link facebook">
              <span class="social-icon">📘</span>
              <div class="social-content">
                <h3>Facebook</h3>
                <p>/mesquitacakes</p>
              </div>
            </a>

            <a 
              href="https://wa.me/5521999999999" 
              target="_blank" 
              rel="noopener noreferrer"
              class="social-link whatsapp">
              <span class="social-icon">💬</span>
              <div class="social-content">
                <h3>WhatsApp</h3>
                <p>(21) 99999-9999</p>
              </div>
            </a>

            <a 
              href="mailto:contato@mesquitacakes.com" 
              class="social-link email">
              <span class="social-icon">✉️</span>
              <div class="social-content">
                <h3>E-mail</h3>
                <p>contato&#64;mesquitacakes.com</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .contact-page {
      background: #f8fafc;
      min-height: 100vh;
      padding: 2rem 0;
    }

    /* Hero Section */
    .hero-section {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 3rem;
      align-items: center;
      margin-bottom: 4rem;
      padding: 3rem 0;
      background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
      border-radius: 2rem;
      padding: 3rem;
    }

    .hero-title {
      font-size: 3rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 1rem 0;
      line-height: 1.2;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      color: #6b7280;
      margin: 0;
      line-height: 1.6;
    }

    .contact-illustration {
      display: flex;
      gap: 1rem;
      padding: 2rem;
    }

    .illustration-emoji {
      font-size: 4rem;
      animation: float 3s ease-in-out infinite;
    }

    .illustration-emoji:nth-child(2) {
      animation-delay: -1s;
    }

    .illustration-emoji:nth-child(3) {
      animation-delay: -2s;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }

    /* Layout */
    .contact-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      margin-bottom: 4rem;
    }

    .section-title {
      font-size: 2rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 1rem 0;
    }

    .section-subtitle {
      color: #6b7280;
      font-size: 1.125rem;
      margin: 0 0 2rem 0;
      text-align: center;
    }

    /* Contact Information */
    .contact-info-section {
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }

    .contact-cards {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .contact-card {
      display: flex;
      gap: 1.5rem;
      padding: 2rem;
      background: white;
      border-radius: 1.5rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
    }

    .contact-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    }

    .contact-icon {
      font-size: 2.5rem;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 4rem;
      height: 4rem;
      background: linear-gradient(135deg, #fce7f3, #f3e8ff);
      border-radius: 1rem;
    }

    .contact-content h3 {
      margin: 0 0 0.5rem 0;
      font-weight: 600;
      color: #111827;
      font-size: 1.125rem;
    }

    .contact-content p {
      margin: 0 0 0.75rem 0;
      color: #6b7280;
      font-size: 0.9375rem;
    }

    .contact-link,
    .contact-value {
      font-weight: 600;
      color: #ec4899;
      text-decoration: none;
      font-size: 1rem;
    }

    .contact-link:hover {
      text-decoration: underline;
    }

    /* Business Hours */
    .business-hours {
      background: white;
      border-radius: 1.5rem;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .business-hours h3 {
      margin: 0 0 1.5rem 0;
      font-weight: 600;
      color: #111827;
      font-size: 1.25rem;
    }

    .hours-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .hours-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid #f3f4f6;
    }

    .hours-item:last-child {
      border-bottom: none;
    }

    .hours-item.special {
      color: #ec4899;
      font-weight: 600;
    }

    .day {
      font-weight: 500;
      color: #374151;
    }

    .time {
      font-weight: 600;
      color: #111827;
    }

    /* Location */
    .location-section {
      background: white;
      border-radius: 1.5rem;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .location-section h3 {
      margin: 0 0 1.5rem 0;
      font-weight: 600;
      color: #111827;
      font-size: 1.25rem;
    }

    .address {
      color: #6b7280;
      line-height: 1.6;
      margin-bottom: 2rem;
    }

    .map-placeholder {
      background: #f9fafb;
      border: 2px dashed #d1d5db;
      border-radius: 1rem;
      padding: 3rem;
      text-align: center;
    }

    .map-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .map-icon {
      font-size: 3rem;
    }

    .map-content p {
      margin: 0;
      color: #6b7280;
    }

    /* Contact Form */
    .contact-form-section {
      background: white;
      border-radius: 2rem;
      padding: 3rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      height: fit-content;
    }

    .contact-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-row {
      display: flex;
      gap: 1rem;
    }

    .form-group {
      flex: 1;
      min-width: 0;
    }

    .form-group.full-width {
      flex: 1 1 100%;
    }

    .form-label {
      display: block;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
    }

    .form-input,
    .form-select,
    .form-textarea {
      width: 100%;
      padding: 0.875rem 1rem;
      border: 1px solid #d1d5db;
      border-radius: 0.75rem;
      font-size: 1rem;
      transition: all 0.3s ease;
      font-family: inherit;
    }

    .form-input:focus,
    .form-select:focus,
    .form-textarea:focus {
      outline: none;
      border-color: #ec4899;
      box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
    }

    .form-textarea {
      resize: vertical;
      min-height: 120px;
    }

    .form-error {
      color: #ef4444;
      font-size: 0.75rem;
      margin-top: 0.25rem;
    }

    .form-checkbox {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      font-size: 0.875rem;
    }

    .form-checkbox input {
      display: none;
    }

    .checkmark {
      width: 1.25rem;
      height: 1.25rem;
      border: 2px solid #d1d5db;
      border-radius: 0.25rem;
      position: relative;
      transition: all 0.3s ease;
      flex-shrink: 0;
    }

    .form-checkbox input:checked + .checkmark {
      background: #ec4899;
      border-color: #ec4899;
    }

    .form-checkbox input:checked + .checkmark::after {
      content: '✓';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-weight: bold;
      font-size: 0.75rem;
    }

    .form-actions {
      margin-top: 1rem;
    }

    .success-message {
      text-align: center;
      padding: 3rem;
      background: #f0fdf4;
      border-radius: 1.5rem;
      border: 1px solid #bbf7d0;
      margin-top: 2rem;
    }

    .success-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .success-message h3 {
      margin: 0 0 0.5rem 0;
      color: #166534;
      font-weight: 600;
    }

    .success-message p {
      margin: 0;
      color: #15803d;
    }

    /* FAQ Section */
    .faq-section {
      background: white;
      border-radius: 2rem;
      padding: 3rem;
      margin-bottom: 4rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .faq-section .section-title {
      text-align: center;
    }

    .faq-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .faq-item {
      border: 1px solid #e5e7eb;
      border-radius: 1rem;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .faq-item:hover {
      border-color: #ec4899;
    }

    .faq-question {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      background: none;
      border: none;
      text-align: left;
      cursor: pointer;
      font-weight: 600;
      color: #111827;
      transition: all 0.3s ease;
    }

    .faq-question:hover {
      background: #f9fafb;
    }

    .faq-question.expanded {
      background: #fdf2f8;
      color: #ec4899;
    }

    .faq-icon {
      font-size: 1.25rem;
      font-weight: bold;
      transition: transform 0.3s ease;
    }

    .faq-question.expanded .faq-icon {
      transform: rotate(180deg);
    }

    .faq-answer {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
    }

    .faq-answer.expanded {
      max-height: 200px;
    }

    .faq-answer p {
      padding: 0 1.5rem 1.5rem 1.5rem;
      margin: 0;
      color: #6b7280;
      line-height: 1.6;
    }

    /* Social Media */
    .social-section {
      background: white;
      border-radius: 2rem;
      padding: 3rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .social-section .section-title {
      text-align: center;
    }

    .social-links {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .social-link {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      border-radius: 1rem;
      text-decoration: none;
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }

    .social-link.instagram {
      background: linear-gradient(135deg, #fce7f3, #f3e8ff);
      color: #a855f7;
    }

    .social-link.facebook {
      background: linear-gradient(135deg, #dbeafe, #e0e7ff);
      color: #3b82f6;
    }

    .social-link.whatsapp {
      background: linear-gradient(135deg, #dcfce7, #d1fae5);
      color: #10b981;
    }

    .social-link.email {
      background: linear-gradient(135deg, #fee2e2, #fecaca);
      color: #ef4444;
    }

    .social-link:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
      border-color: currentColor;
    }

    .social-icon {
      font-size: 2rem;
      flex-shrink: 0;
    }

    .social-content h3 {
      margin: 0 0 0.25rem 0;
      font-weight: 600;
      color: #111827;
    }

    .social-content p {
      margin: 0;
      font-size: 0.875rem;
      opacity: 0.8;
    }

    /* Loading State */
    .btn.loading {
      position: relative;
      color: transparent;
    }

    .btn.loading::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 1rem;
      height: 1rem;
      border: 2px solid #ffffff;
      border-top: 2px solid transparent;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: translate(-50%, -50%) rotate(0deg); }
      100% { transform: translate(-50%, -50%) rotate(360deg); }
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .contact-layout {
        grid-template-columns: 1fr;
        gap: 3rem;
      }

      .hero-section {
        grid-template-columns: 1fr;
        text-align: center;
      }
    }

    @media (max-width: 768px) {
      .contact-page {
        padding: 1rem 0;
      }

      .hero-section {
        padding: 2rem;
        margin-bottom: 2rem;
      }

      .hero-title {
        font-size: 2rem;
      }

      .hero-subtitle {
        font-size: 1.125rem;
      }

      .contact-form-section,
      .faq-section,
      .social-section {
        padding: 2rem;
      }

      .form-row {
        flex-direction: column;
        gap: 0.75rem;
      }

      .social-links {
        grid-template-columns: 1fr;
      }

      .contact-illustration {
        padding: 1rem;
      }

      .illustration-emoji {
        font-size: 3rem;
      }
    }
  `]
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  isSubmitting = false;
  showSuccessMessage = false;

  contactInfo: ContactInfo[] = [
    {
      icon: '📱',
      title: 'Telefone / WhatsApp',
      description: 'Ligue ou mande uma mensagem',
      value: '(21) 99999-9999',
      link: 'https://wa.me/5521999999999'
    },
    {
      icon: '✉️',
      title: 'E-mail',
      description: 'Envie sua mensagem',
      value: 'contato@mesquitacakes.com',
      link: 'mailto:contato@mesquitacakes.com'
    },
    {
      icon: '📍',
      title: 'Endereço',
      description: 'Venha nos visitar',
      value: 'Rua das Delícias, 123 - Centro, Mesquita/RJ'
    },
    {
      icon: '📷',
      title: 'Instagram',
      description: 'Siga nossas novidades',
      value: '&#64;mesquitacakes',
      link: 'https://instagram.com/mesquitacakes'
    }
  ];

  faqs: FAQ[] = [
    {
      question: 'Qual o prazo mínimo para encomendas?',
      answer: 'Para bolos personalizados e grandes quantidades, recomendamos um prazo mínimo de 48 horas. Para itens do cardápio regular, temos disponibilidade no mesmo dia.',
      isExpanded: false
    },
    {
      question: 'Vocês fazem entrega?',
      answer: 'Sim! Fazemos entregas na região de Mesquita e cidades vizinhas. A taxa de entrega varia conforme a distância. Consulte as condições no momento do pedido.',
      isExpanded: false
    },
    {
      question: 'Posso retirar no local?',
      answer: 'Claro! Você pode retirar seu pedido em nossa loja. Nosso endereço é Rua das Delícias, 123 - Centro, Mesquita/RJ. Funcionamos de segunda a sábado.',
      isExpanded: false
    },
    {
      question: 'Quais formas de pagamento vocês aceitam?',
      answer: 'Aceitamos dinheiro, cartão de débito, cartão de crédito e PIX. Para pagamentos online, trabalhamos com as principais bandeiras e PIX instantâneo.',
      isExpanded: false
    },
    {
      question: 'Vocês fazem bolos para pessoas com restrições alimentares?',
      answer: 'Sim! Temos opções sem glúten, sem lactose e veganas. Entre em contato para discutirmos suas necessidades específicas e prepararmos algo especial.',
      isExpanded: false
    },
    {
      question: 'Como funciona o processo de personalização de bolos?',
      answer: 'Você pode nos enviar fotos, desenhos ou uma descrição detalhada do que deseja. Nossa equipe criativa transformará sua ideia em realidade. Fazemos uma proposta e, após aprovação, iniciamos a produção.',
      isExpanded: false
    }
  ];

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]],
      newsletter: [false]
    });
  }

  ngOnInit() {
    // Component initialization
  }

  submitForm() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    // Simulate form submission
    setTimeout(() => {
      this.isSubmitting = false;
      this.showSuccessMessage = true;
      this.contactForm.reset();

      // Hide success message after 5 seconds
      setTimeout(() => {
        this.showSuccessMessage = false;
      }, 5000);
    }, 2000);
  }

  toggleFAQ(faq: FAQ) {
    faq.isExpanded = !faq.isExpanded;
  }
}

import { Component } from '@angular/core';


@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [],
  template: `
    <section class="testimonials-section section bg-cream">
      <div class="container">
        <div class="section-header text-center mb-12">
          <h2 class="sweet-text text-4xl mb-4">
            O que Nossos Clientes Dizem 💬
          </h2>
          <p class="text-lg text-neutral max-w-2xl mx-auto">
            Momentos especiais merecem sabores especiais
          </p>
        </div>
        
        <div class="testimonials-grid grid grid--3 gap-8">
          @for (testimonial of testimonials; track testimonial.id) {
            <div class="testimonial-card card card--sweet">
              <div class="testimonial-header">
                <div class="customer-avatar">
                  <span class="avatar-emoji">{{ testimonial.avatar }}</span>
                </div>
                <div class="customer-info">
                  <h4 class="customer-name">{{ testimonial.name }}</h4>
                  <div class="customer-rating">
                    @for (star of getStars(testimonial.rating); track $index) {
                      <span class="star">⭐</span>
                    }
                  </div>
                </div>
              </div>
              
              <blockquote class="testimonial-text">
                "{{ testimonial.text }}"
              </blockquote>
              
              <div class="testimonial-footer">
                <span class="testimonial-product">{{ testimonial.product }}</span>
                <span class="testimonial-date">{{ testimonial.date }}</span>
              </div>
            </div>
          }
        </div>
        
        <div class="testimonials-summary">
          <div class="summary-stats grid grid--4 gap-6">
            <div class="stat-item">
              <div class="stat-icon">😍</div>
              <div class="stat-number">98%</div>
              <div class="stat-label">Satisfação</div>
            </div>
            
            <div class="stat-item">
              <div class="stat-icon">🏆</div>
              <div class="stat-number">4.9</div>
              <div class="stat-label">Avaliação Média</div>
            </div>
            
            <div class="stat-item">
              <div class="stat-icon">🔄</div>
              <div class="stat-number">85%</div>
              <div class="stat-label">Clientes Retornam</div>
            </div>
            
            <div class="stat-item">
              <div class="stat-icon">📝</div>
              <div class="stat-number">150+</div>
              <div class="stat-label">Avaliações</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .testimonials-section {
      background: linear-gradient(135deg, #fef7ed 0%, #f0fdf4 100%);
    }

    .section-header h2 {
      background: linear-gradient(135deg, #ec4899 0%, #14b8a6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .testimonial-card {
      background: white;
      padding: 2rem;
      border-radius: 1.5rem;
      border: 1px solid rgba(236, 72, 153, 0.1);
      transition: all 0.3s ease;
      position: relative;
    }

    .testimonial-card::before {
      content: '"';
      position: absolute;
      top: -0.5rem;
      left: 1.5rem;
      font-size: 4rem;
      color: #ec4899;
      font-family: 'Dancing Script', cursive;
      opacity: 0.3;
    }

    .testimonial-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 15px 30px rgba(236, 72, 153, 0.1);
      border-color: #ec4899;
    }

    .testimonial-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .customer-avatar {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      background: linear-gradient(135deg, #ec4899 0%, #f472b6 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .avatar-emoji {
      font-size: 1.5rem;
    }

    .customer-name {
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 0.25rem;
    }

    .customer-rating {
      display: flex;
      gap: 0.125rem;
    }

    .star {
      font-size: 0.875rem;
    }

    .testimonial-text {
      font-style: italic;
      color: #4b5563;
      line-height: 1.6;
      margin-bottom: 1.5rem;
      font-size: 1rem;
    }

    .testimonial-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid #f3f4f6;
    }

    .testimonial-product {
      font-weight: 500;
      color: #ec4899;
      font-size: 0.875rem;
    }

    .testimonial-date {
      color: #9ca3af;
      font-size: 0.75rem;
    }

    .testimonials-summary {
      margin-top: 4rem;
      padding-top: 3rem;
      border-top: 1px solid rgba(107, 114, 128, 0.2);
    }

    .summary-stats {
      background: white;
      padding: 2rem;
      border-radius: 1.5rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    }

    .stat-item {
      text-align: center;
    }

    .stat-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .stat-number {
      font-family: 'Fredoka One', cursive;
      font-size: 2rem;
      color: #ec4899;
      margin-bottom: 0.25rem;
    }

    .stat-label {
      color: #6b7280;
      font-size: 0.875rem;
      font-weight: 500;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .testimonials-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .summary-stats {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 640px) {
      .testimonials-grid {
        grid-template-columns: 1fr;
      }
      
      .summary-stats {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .testimonial-card {
        padding: 1.5rem;
      }

      .testimonial-footer {
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-start;
      }
    }
  `]
})
export class TestimonialsComponent {
  testimonials = [
    {
      id: 1,
      name: 'Maria Silva',
      avatar: '👩',
      rating: 5,
      text: 'Simplesmente perfeito! O bolo de morango estava divino e chegou fresquinho. Recomendo muito!',
      product: 'Bolo de Morango Especial',
      date: 'há 2 dias'
    },
    {
      id: 2,
      name: 'João Santos',
      avatar: '👨',
      rating: 5,
      text: 'A torta de chocolate foi um sucesso na festa de aniversário. Todos elogiaram muito o sabor!',
      product: 'Torta de Chocolate',
      date: 'há 1 semana'
    },
    {
      id: 3,
      name: 'Ana Costa',
      avatar: '👩‍🦱',
      rating: 5,
      text: 'Os cupcakes ficaram lindos e deliciosos. Qualidade excepcional e entrega pontual!',
      product: 'Cupcakes Personalizados',
      date: 'há 3 dias'
    },
    {
      id: 4,
      name: 'Carlos Lima',
      avatar: '👨‍🦲',
      rating: 4,
      text: 'Bolo de cenoura muito saboroso! Lembrou da receita da minha avó. Parabéns pelo trabalho!',
      product: 'Bolo de Cenoura',
      date: 'há 5 dias'
    },
    {
      id: 5,
      name: 'Fernanda Oliveira',
      avatar: '👩‍🦰',
      rating: 5,
      text: 'Atendimento excelente e produto de alta qualidade. Já virei cliente fiel da Mesquita Cakes!',
      product: 'Torta de Limão',
      date: 'há 1 semana'
    },
    {
      id: 6,
      name: 'Ricardo Mendes',
      avatar: '👨‍🦱',
      rating: 5,
      text: 'Pudim maravilhoso! Cremoso na medida certa e com aquele gostinho caseiro que tanto procurava.',
      product: 'Pudim de Leite',
      date: 'há 4 dias'
    }
  ];

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }
}

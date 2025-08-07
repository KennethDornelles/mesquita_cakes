import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

interface TeamMember {
  name: string;
  role: string;
  description: string;
  image: string;
  specialties: string[];
}

interface Achievement {
  year: string;
  title: string;
  description: string;
  icon: string;
}

interface Value {
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  template: `
    <div class="about-page">
      <div class="container">
        <!-- Hero Section -->
        <div class="hero-section">
          <div class="hero-content">
            <h1 class="hero-title">🧁 Nossa História</h1>
            <p class="hero-subtitle">
              Há mais de uma década transformando momentos especiais em memórias doces
            </p>
            <div class="hero-stats">
              <div class="stat-item">
                <span class="stat-number">10+</span>
                <span class="stat-label">Anos de Experiência</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">5000+</span>
                <span class="stat-label">Clientes Satisfeitos</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">50+</span>
                <span class="stat-label">Tipos de Doces</span>
              </div>
            </div>
          </div>
          <div class="hero-image">
            <div class="image-placeholder">
              <span class="placeholder-icon">🏪</span>
              <p>Nossa confeitaria</p>
            </div>
          </div>
        </div>
    
        <!-- Story Section -->
        <div class="story-section">
          <div class="story-content">
            <h2 class="section-title">📖 Nossa Jornada</h2>
            <div class="story-text">
              <p>
                A <strong>Mesquita Cakes</strong> nasceu em 2012 do sonho de Maria Silva, uma apaixonada confeiteira
                que transformou sua cozinha doméstica em um laboratório de sabores únicos. O que começou como
                uma pequena produção para amigos e familiares, hoje se tornou uma das confeitarias mais queridas
                de Mesquita e região.
              </p>
              <p>
                Nossa missão sempre foi clara: criar momentos especiais através de doces artesanais feitos com
                muito amor e ingredientes de primeira qualidade. Cada receita é cuidadosamente desenvolvida,
                cada decoração é pensada nos mínimos detalhes, e cada cliente é tratado como parte da nossa família.
              </p>
              <p>
                Ao longo dos anos, crescemos, mas nunca perdemos nossa essência familiar. Continuamos fazendo
                tudo à mão, com a mesma dedicação e carinho do primeiro dia. Nossa equipe é formada por pessoas
                que compartilham da nossa paixão pela confeitaria e pelo atendimento excepcional.
              </p>
            </div>
          </div>
          <div class="story-timeline">
            <h3>🕒 Marcos Importantes</h3>
            <div class="timeline">
              @for (achievement of achievements; track achievement) {
                <div class="timeline-item">
                  <div class="timeline-icon">{{ achievement.icon }}</div>
                  <div class="timeline-content">
                    <span class="timeline-year">{{ achievement.year }}</span>
                    <h4>{{ achievement.title }}</h4>
                    <p>{{ achievement.description }}</p>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
    
        <!-- Values Section -->
        <div class="values-section">
          <h2 class="section-title">💖 Nossos Valores</h2>
          <p class="section-subtitle">
            Os princípios que guiam cada doce que criamos
          </p>
    
          <div class="values-grid">
            @for (value of values; track value) {
              <div class="value-card">
                <div class="value-icon">{{ value.icon }}</div>
                <h3>{{ value.title }}</h3>
                <p>{{ value.description }}</p>
              </div>
            }
          </div>
        </div>
    
        <!-- Team Section -->
        <div class="team-section">
          <h2 class="section-title">👥 Nossa Equipe</h2>
          <p class="section-subtitle">
            Conheça as pessoas talentosas por trás dos nossos doces
          </p>
    
          <div class="team-grid">
            @for (member of teamMembers; track member) {
              <div class="team-card">
                <div class="member-image">
                  <img [src]="member.image" [alt]="member.name">
                </div>
                <div class="member-info">
                  <h3>{{ member.name }}</h3>
                  <span class="member-role">{{ member.role }}</span>
                  <p class="member-description">{{ member.description }}</p>
                  <div class="member-specialties">
                    @for (specialty of member.specialties; track specialty) {
                      <span
                        class="specialty-tag">
                        {{ specialty }}
                      </span>
                    }
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
    
        <!-- Mission Section -->
        <div class="mission-section">
          <div class="mission-content">
            <div class="mission-item">
              <div class="mission-icon">🎯</div>
              <div class="mission-text">
                <h3>Missão</h3>
                <p>
                  Criar momentos especiais e inesquecíveis através de doces artesanais de alta qualidade,
                  feitos com amor e dedicação, proporcionando experiências únicas que toquem o coração
                  de nossos clientes.
                </p>
              </div>
            </div>
    
            <div class="mission-item">
              <div class="mission-icon">👁️</div>
              <div class="mission-text">
                <h3>Visão</h3>
                <p>
                  Ser reconhecida como a confeitaria de referência na região, conhecida pela excelência
                  em qualidade, criatividade e atendimento, expandindo nossa presença e levando nossos
                  sabores únicos para cada vez mais pessoas.
                </p>
              </div>
            </div>
    
            <div class="mission-item">
              <div class="mission-icon">⭐</div>
              <div class="mission-text">
                <h3>Valores</h3>
                <p>
                  Qualidade acima de tudo, atendimento humanizado, inovação constante, sustentabilidade,
                  respeito aos nossos colaboradores e clientes, e a paixão pela confeitaria como arte
                  que transforma vidas.
                </p>
              </div>
            </div>
          </div>
        </div>
    
        <!-- Quality Section -->
        <div class="quality-section">
          <h2 class="section-title">🏆 Nosso Compromisso com a Qualidade</h2>
          <div class="quality-grid">
            <div class="quality-card">
              <div class="quality-icon">🥄</div>
              <h3>Ingredientes Premium</h3>
              <p>
                Selecionamos cuidadosamente cada ingrediente, priorizando fornecedores locais
                e produtos de origem controlada para garantir o melhor sabor e qualidade.
              </p>
            </div>
    
            <div class="quality-card">
              <div class="quality-icon">👨‍🍳</div>
              <h3>Produção Artesanal</h3>
              <p>
                Todos os nossos doces são feitos à mão, seguindo receitas tradicionais
                aperfeiçoadas ao longo dos anos, garantindo autenticidade em cada mordida.
              </p>
            </div>
    
            <div class="quality-card">
              <div class="quality-icon">🌡️</div>
              <h3>Controle Rigoroso</h3>
              <p>
                Mantemos rígidos padrões de higiene e controle de qualidade em todas as
                etapas da produção, seguindo as melhores práticas da indústria alimentícia.
              </p>
            </div>
    
            <div class="quality-card">
              <div class="quality-icon">🎨</div>
              <h3>Criatividade Única</h3>
              <p>
                Nossa equipe criativa está sempre desenvolvendo novos sabores e
                apresentações, combinando tradição com inovação para surpreender nossos clientes.
              </p>
            </div>
          </div>
        </div>
    
        <!-- Community Section -->
        <div class="community-section">
          <h2 class="section-title">🤝 Compromisso Social</h2>
          <p class="section-subtitle">
            Acreditamos que uma empresa deve contribuir positivamente para sua comunidade
          </p>
    
          <div class="community-grid">
            <div class="community-card">
              <div class="community-icon">🎂</div>
              <h3>Doações para Instituições</h3>
              <p>
                Mensalmente doamos bolos e doces para orfanatos, asilos e instituições
                de caridade da região, espalhando alegria para quem mais precisa.
              </p>
            </div>
    
            <div class="community-card">
              <div class="community-icon">📚</div>
              <h3>Cursos Gratuitos</h3>
              <p>
                Oferecemos oficinas gratuitas de confeitaria básica para jovens da
                comunidade, promovendo capacitação profissional e geração de renda.
              </p>
            </div>
    
            <div class="community-card">
              <div class="community-icon">🌱</div>
              <h3>Sustentabilidade</h3>
              <p>
                Utilizamos embalagens eco-friendly, fazemos compostagem dos resíduos
                orgânicos e compramos de produtores locais sempre que possível.
              </p>
            </div>
          </div>
        </div>
    
        <!-- CTA Section -->
        <div class="cta-section">
          <div class="cta-content">
            <h2>🎉 Faça Parte da Nossa História</h2>
            <p>
              Venha conhecer nossa confeitaria e descobrir por que somos a escolha favorita
              de milhares de clientes. Cada doce é uma nova história, cada cliente é especial.
            </p>
            <div class="cta-buttons">
              <button class="btn btn--sweet" (click)="goToProducts()">
                Ver Nossos Produtos
              </button>
              <button class="btn btn--outline" (click)="goToContact()">
                Entre em Contato
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    `,
  styles: [`
    .about-page {
      background: #f8fafc;
      min-height: 100vh;
      padding: 2rem 0;
    }

    /* Hero Section */
    .hero-section {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 4rem;
      align-items: center;
      margin-bottom: 5rem;
      padding: 4rem 0;
      background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
      border-radius: 2rem;
      padding: 4rem 3rem;
    }

    .hero-title {
      font-size: 3.5rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 1rem 0;
      line-height: 1.1;
    }

    .hero-subtitle {
      font-size: 1.5rem;
      color: #6b7280;
      margin: 0 0 3rem 0;
      line-height: 1.4;
    }

    .hero-stats {
      display: flex;
      gap: 3rem;
    }

    .stat-item {
      text-align: center;
    }

    .stat-number {
      display: block;
      font-size: 2.5rem;
      font-weight: 700;
      color: #ec4899;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 600;
    }

    .hero-image {
      flex-shrink: 0;
    }

    .image-placeholder {
      width: 300px;
      height: 300px;
      background: white;
      border-radius: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12);
      border: 3px dashed #d1d5db;
    }

    .placeholder-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .image-placeholder p {
      margin: 0;
      color: #6b7280;
      font-weight: 600;
    }

    /* Sections */
    .section-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 1rem 0;
      text-align: center;
    }

    .section-subtitle {
      color: #6b7280;
      font-size: 1.25rem;
      margin: 0 0 3rem 0;
      text-align: center;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    /* Story Section */
    .story-section {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 4rem;
      margin-bottom: 5rem;
      align-items: start;
    }

    .story-content .section-title {
      text-align: left;
      margin-bottom: 2rem;
    }

    .story-text p {
      font-size: 1.125rem;
      line-height: 1.8;
      color: #374151;
      margin-bottom: 1.5rem;
    }

    .story-text strong {
      color: #ec4899;
      font-weight: 600;
    }

    .story-timeline {
      background: white;
      border-radius: 1.5rem;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      height: fit-content;
      position: sticky;
      top: 2rem;
    }

    .story-timeline h3 {
      margin: 0 0 2rem 0;
      font-weight: 600;
      color: #111827;
      font-size: 1.25rem;
    }

    .timeline {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .timeline-item {
      display: flex;
      gap: 1rem;
      align-items: start;
    }

    .timeline-icon {
      width: 3rem;
      height: 3rem;
      background: linear-gradient(135deg, #ec4899, #be185d);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      flex-shrink: 0;
    }

    .timeline-content {
      flex: 1;
    }

    .timeline-year {
      display: inline-block;
      background: #fdf2f8;
      color: #ec4899;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .timeline-content h4 {
      margin: 0 0 0.5rem 0;
      font-weight: 600;
      color: #111827;
    }

    .timeline-content p {
      margin: 0;
      color: #6b7280;
      font-size: 0.875rem;
      line-height: 1.5;
    }

    /* Values Section */
    .values-section {
      margin-bottom: 5rem;
    }

    .values-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .value-card {
      background: white;
      border-radius: 1.5rem;
      padding: 2.5rem;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
    }

    .value-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    }

    .value-icon {
      font-size: 3rem;
      margin-bottom: 1.5rem;
    }

    .value-card h3 {
      margin: 0 0 1rem 0;
      font-weight: 600;
      color: #111827;
      font-size: 1.25rem;
    }

    .value-card p {
      margin: 0;
      color: #6b7280;
      line-height: 1.6;
    }

    /* Team Section */
    .team-section {
      margin-bottom: 5rem;
    }

    .team-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2rem;
    }

    .team-card {
      background: white;
      border-radius: 1.5rem;
      padding: 0;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
    }

    .team-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    }

    .member-image {
      width: 100%;
      height: 250px;
      background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #9ca3af;
      font-size: 4rem;
    }

    .member-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .member-info {
      padding: 2rem;
    }

    .member-info h3 {
      margin: 0 0 0.5rem 0;
      font-weight: 600;
      color: #111827;
      font-size: 1.25rem;
    }

    .member-role {
      color: #ec4899;
      font-weight: 600;
      font-size: 0.875rem;
      display: block;
      margin-bottom: 1rem;
    }

    .member-description {
      color: #6b7280;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .member-specialties {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .specialty-tag {
      background: #fdf2f8;
      color: #ec4899;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    /* Mission Section */
    .mission-section {
      margin-bottom: 5rem;
    }

    .mission-content {
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }

    .mission-item {
      display: flex;
      gap: 2rem;
      align-items: start;
      background: white;
      border-radius: 1.5rem;
      padding: 3rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .mission-icon {
      font-size: 3rem;
      flex-shrink: 0;
      width: 4rem;
      height: 4rem;
      background: linear-gradient(135deg, #fdf2f8, #fce7f3);
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .mission-text h3 {
      margin: 0 0 1rem 0;
      font-weight: 600;
      color: #111827;
      font-size: 1.5rem;
    }

    .mission-text p {
      margin: 0;
      color: #6b7280;
      line-height: 1.7;
      font-size: 1.125rem;
    }

    /* Quality Section */
    .quality-section {
      margin-bottom: 5rem;
    }

    .quality-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
    }

    .quality-card {
      background: white;
      border-radius: 1.5rem;
      padding: 2.5rem;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }

    .quality-card:hover {
      border-color: #ec4899;
      transform: translateY(-4px);
    }

    .quality-icon {
      font-size: 3rem;
      margin-bottom: 1.5rem;
    }

    .quality-card h3 {
      margin: 0 0 1rem 0;
      font-weight: 600;
      color: #111827;
      font-size: 1.125rem;
    }

    .quality-card p {
      margin: 0;
      color: #6b7280;
      line-height: 1.6;
      font-size: 0.9375rem;
    }

    /* Community Section */
    .community-section {
      margin-bottom: 5rem;
    }

    .community-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2rem;
    }

    .community-card {
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      border-radius: 1.5rem;
      padding: 2.5rem;
      text-align: center;
      border: 1px solid #bbf7d0;
      transition: all 0.3s ease;
    }

    .community-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 30px rgba(16, 185, 129, 0.15);
    }

    .community-icon {
      font-size: 3rem;
      margin-bottom: 1.5rem;
    }

    .community-card h3 {
      margin: 0 0 1rem 0;
      font-weight: 600;
      color: #065f46;
      font-size: 1.125rem;
    }

    .community-card p {
      margin: 0;
      color: #047857;
      line-height: 1.6;
      font-size: 0.9375rem;
    }

    /* CTA Section */
    .cta-section {
      background: linear-gradient(135deg, #ec4899 0%, #be185d 100%);
      border-radius: 2rem;
      padding: 4rem;
      text-align: center;
      color: white;
    }

    .cta-content h2 {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 1rem 0;
    }

    .cta-content p {
      font-size: 1.25rem;
      margin: 0 0 3rem 0;
      opacity: 0.9;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
      line-height: 1.6;
    }

    .cta-buttons {
      display: flex;
      gap: 1.5rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .cta-section .btn--sweet {
      background: white;
      color: #ec4899;
    }

    .cta-section .btn--sweet:hover {
      background: #f9fafb;
    }

    .cta-section .btn--outline {
      border-color: white;
      color: white;
    }

    .cta-section .btn--outline:hover {
      background: white;
      color: #ec4899;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .hero-section {
        grid-template-columns: 1fr;
        text-align: center;
        gap: 3rem;
      }

      .hero-stats {
        justify-content: center;
      }

      .story-section {
        grid-template-columns: 1fr;
        gap: 3rem;
      }

      .story-timeline {
        position: static;
      }

      .mission-item {
        flex-direction: column;
        text-align: center;
        gap: 1.5rem;
      }
    }

    @media (max-width: 768px) {
      .about-page {
        padding: 1rem 0;
      }

      .hero-section {
        padding: 2rem;
        margin-bottom: 3rem;
      }

      .hero-title {
        font-size: 2.5rem;
      }

      .hero-subtitle {
        font-size: 1.125rem;
      }

      .hero-stats {
        flex-direction: column;
        gap: 1.5rem;
      }

      .image-placeholder {
        width: 250px;
        height: 250px;
      }

      .section-title {
        font-size: 2rem;
      }

      .values-grid,
      .quality-grid,
      .community-grid {
        grid-template-columns: 1fr;
      }

      .team-grid {
        grid-template-columns: 1fr;
      }

      .mission-item {
        padding: 2rem;
      }

      .cta-section {
        padding: 3rem 2rem;
      }

      .cta-content h2 {
        font-size: 2rem;
      }

      .cta-buttons {
        flex-direction: column;
        align-items: center;
      }

      .cta-buttons .btn {
        width: 100%;
        max-width: 300px;
      }
    }
  `]
})
export class AboutComponent implements OnInit {
  
  achievements: Achievement[] = [
    {
      year: '2012',
      title: 'Fundação',
      description: 'Maria Silva funda a Mesquita Cakes em sua cozinha doméstica',
      icon: '🏠'
    },
    {
      year: '2015',
      title: 'Primeira Loja',
      description: 'Abertura da primeira loja física no centro de Mesquita',
      icon: '🏪'
    },
    {
      year: '2018',
      title: 'Expansão da Equipe',
      description: 'Crescimento para 10 funcionários especializados',
      icon: '👥'
    },
    {
      year: '2020',
      title: 'Delivery Online',
      description: 'Lançamento da plataforma de pedidos online',
      icon: '📱'
    },
    {
      year: '2022',
      title: '10 Anos',
      description: 'Celebração de uma década de doçura e sucesso',
      icon: '🎉'
    },
    {
      year: '2024',
      title: 'Nova Plataforma',
      description: 'Lançamento do novo site com experiência aprimorada',
      icon: '💻'
    }
  ];

  values: Value[] = [
    {
      title: 'Qualidade Premium',
      description: 'Utilizamos apenas ingredientes de primeira qualidade, selecionados cuidadosamente para garantir o melhor sabor em cada doce.',
      icon: '⭐'
    },
    {
      title: 'Tradição Familiar',
      description: 'Mantemos o carinho e dedicação artesanal que caracteriza uma confeitaria familiar, preservando receitas e técnicas tradicionais.',
      icon: '👨‍👩‍👧‍👦'
    },
    {
      title: 'Inovação Constante',
      description: 'Estamos sempre criando novos sabores e apresentações, combinando tradição com as tendências mais modernas da confeitaria.',
      icon: '💡'
    },
    {
      title: 'Atendimento Excepcional',
      description: 'Cada cliente é único e especial. Oferecemos um atendimento personalizado e cuidadoso em cada interação.',
      icon: '💖'
    },
    {
      title: 'Responsabilidade Social',
      description: 'Acreditamos em retribuir à comunidade através de ações sociais, doações e projetos que impactem positivamente nossa região.',
      icon: '🤝'
    },
    {
      title: 'Sustentabilidade',
      description: 'Comprometidos com práticas sustentáveis, desde a escolha de fornecedores até o uso de embalagens eco-friendly.',
      icon: '🌱'
    }
  ];

  teamMembers: TeamMember[] = [
    {
      name: 'Maria Silva',
      role: 'Fundadora e Chef Confeiteira',
      description: 'Com mais de 15 anos de experiência, Maria é a mente criativa por trás de todas as nossas receitas especiais.',
      image: '/assets/images/team/maria.jpg',
      specialties: ['Bolos Artísticos', 'Doces Tradicionais', 'Criação de Receitas']
    },
    {
      name: 'João Santos',
      role: 'Chef de Produção',
      description: 'Responsável por manter a qualidade e consistência de todos os produtos, João garante que cada doce saia perfeito.',
      image: '/assets/images/team/joao.jpg',
      specialties: ['Controle de Qualidade', 'Produção em Larga Escala', 'Treinamento de Equipe']
    },
    {
      name: 'Ana Costa',
      role: 'Designer de Bolos',
      description: 'Especialista em decoração e design, Ana transforma ideias em obras de arte comestíveis únicas e personalizadas.',
      image: '/assets/images/team/ana.jpg',
      specialties: ['Decoração Artística', 'Bolos Personalizados', 'Técnicas Modernas']
    },
    {
      name: 'Carlos Oliveira',
      role: 'Gerente de Atendimento',
      description: 'Carlos cuida para que cada cliente tenha uma experiência excepcional, desde o primeiro contato até a entrega.',
      image: '/assets/images/team/carlos.jpg',
      specialties: ['Atendimento ao Cliente', 'Gestão de Pedidos', 'Experiência do Cliente']
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    // Component initialization
  }

  goToProducts() {
    this.router.navigate(['/products']);
  }

  goToContact() {
    this.router.navigate(['/contact']);
  }
}

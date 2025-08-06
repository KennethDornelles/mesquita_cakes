import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddressService } from '../services/address.service';

@Component({
  selector: 'app-cep-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="cep-test-container">
      <h2>Teste de CEP</h2>
      
      <div class="form-group">
        <label for="cep">Digite um CEP:</label>
        <input 
          id="cep" 
          type="text" 
          [(ngModel)]="cep" 
          placeholder="00000-000"
          (input)="onCepChange()"
          maxlength="9">
      </div>
      
      <div *ngIf="isLoading" class="loading">
        Buscando endereço...
      </div>
      
      <div *ngIf="result && !isLoading" class="result">
        <h3>Resultado:</h3>
        <div *ngIf="result.valid" class="success">
          <p><strong>CEP:</strong> {{ result.address?.zipCode }}</p>
          <p><strong>Logradouro:</strong> {{ result.address?.street }}</p>
          <p><strong>Bairro:</strong> {{ result.address?.neighborhood }}</p>
          <p><strong>Cidade:</strong> {{ result.address?.city }}</p>
          <p><strong>Estado:</strong> {{ result.address?.state }}</p>
          
          <div *ngIf="deliveryInfo" class="delivery-info">
            <h4>Informações de Entrega:</h4>
            <p><strong>Taxa:</strong> R$ {{ deliveryInfo.fee.toFixed(2).replace('.', ',') }}</p>
            <p><strong>Prazo:</strong> {{ deliveryInfo.estimate }}</p>
          </div>
        </div>
        
        <div *ngIf="!result.valid" class="error">
          <p>❌ {{ result.error }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cep-test-container {
      max-width: 500px;
      margin: 2rem auto;
      padding: 2rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      background: white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .form-group {
      margin-bottom: 1rem;
    }
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }
    
    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }
    
    .loading {
      text-align: center;
      color: #666;
      font-style: italic;
    }
    
    .result {
      margin-top: 1rem;
      padding: 1rem;
      border-radius: 4px;
    }
    
    .success {
      background: #f0f9ff;
      border: 1px solid #0ea5e9;
      color: #0c4a6e;
    }
    
    .error {
      background: #fef2f2;
      border: 1px solid #ef4444;
      color: #991b1b;
    }
    
    .delivery-info {
      margin-top: 1rem;
      padding: 1rem;
      background: #f8fafc;
      border-radius: 4px;
    }
    
    h2, h3, h4 {
      margin-top: 0;
      color: #1f2937;
    }
    
    p {
      margin: 0.5rem 0;
    }
  `]
})
export class CepTestComponent {
  cep = '';
  result: any = null;
  deliveryInfo: any = null;
  isLoading = false;
  private searchTimeout: any;

  constructor(private addressService: AddressService) {}

  onCepChange() {
    // Limpar timeout anterior
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    // Limpar resultados anteriores
    this.result = null;
    this.deliveryInfo = null;

    // Verificar se CEP tem 8 dígitos
    const cleanCep = this.cep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      // Aguardar 500ms antes de fazer a busca
      this.searchTimeout = setTimeout(() => {
        this.searchAddress();
      }, 500);
    }
  }

  private searchAddress() {
    this.isLoading = true;
    
    console.log('🔥 Buscando CEP:', this.cep);
    
    this.addressService.getAddressByCep(this.cep).subscribe({
      next: (result) => {
        console.log('🔥 Resultado da busca:', result);
        this.result = result;
        this.isLoading = false;
        
        // Se o endereço é válido, buscar informações de entrega
        if (result.valid) {
          this.getDeliveryInfo();
        }
      },
      error: (error) => {
        console.error('🔥 Erro na busca:', error);
        this.result = {
          valid: false,
          error: 'Erro ao buscar CEP. Tente novamente.'
        };
        this.isLoading = false;
      }
    });
  }
  
  private getDeliveryInfo() {
    this.addressService.calculateDeliveryFee(this.cep, 1).subscribe({
      next: (info) => {
        console.log('🔥 Info de entrega:', info);
        this.deliveryInfo = info;
      },
      error: (error) => {
        console.error('🔥 Erro ao calcular entrega:', error);
      }
    });
  }
}

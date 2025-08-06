import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface AddressResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export interface AddressValidation {
  valid: boolean;
  error?: string;
  address?: {
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private readonly API_URL = 'http://localhost:3000/graphql';
  private readonly VIACEP_URL = 'https://viacep.com.br/ws';

  constructor(private http: HttpClient) {}

  /**
   * Busca endereço pelo CEP usando a API GraphQL do projeto
   */
  getAddressByCep(cep: string): Observable<AddressValidation> {
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length !== 8) {
      return of({ 
        valid: false, 
        error: 'CEP deve ter 8 dígitos' 
      });
    }

    const query = `
      query GetAddressByCep($cep: String!) {
        getAddressByCep(findByCepInput: { cep: $cep }) {
          cep
          logradouro
          complemento
          bairro
          localidade
          uf
          ibge
          gia
          ddd
          siafi
          erro
        }
      }
    `;

    const variables = { cep: cleanCep };

    return this.http.post<any>(this.API_URL, { query, variables }).pipe(
      map(response => {
        const data = response.data?.getAddressByCep;
        
        if (!data || data.erro) {
          return {
            valid: false,
            error: 'CEP não encontrado'
          };
        }

        return {
          valid: true,
          address: {
            street: data.logradouro,
            neighborhood: data.bairro,
            city: data.localidade,
            state: data.uf,
            zipCode: data.cep
          }
        };
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Erro ao buscar CEP na API:', error);
        
        // Fallback para ViaCEP diretamente
        return this.getAddressByViaCep(cleanCep);
      })
    );
  }

  /**
   * Fallback: busca endereço diretamente no ViaCEP
   */
  private getAddressByViaCep(cep: string): Observable<AddressValidation> {
    const url = `${this.VIACEP_URL}/${cep}/json/`;
    
    return this.http.get<AddressResponse>(url).pipe(
      map(data => {
        if (data.erro) {
          return {
            valid: false,
            error: 'CEP não encontrado'
          };
        }

        return {
          valid: true,
          address: {
            street: data.logradouro,
            neighborhood: data.bairro,
            city: data.localidade,
            state: data.uf,
            zipCode: data.cep
          }
        };
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Erro ao buscar CEP no ViaCEP:', error);
        return of({
          valid: false,
          error: 'Erro ao consultar CEP. Tente novamente.'
        });
      })
    );
  }

  /**
   * Calcula taxa de entrega baseada no CEP
   */
  calculateDeliveryFee(cep: string, weight: number = 1): Observable<{ fee: number; estimate: string }> {
    return this.getAddressByCep(cep).pipe(
      map(result => {
        if (!result.valid || !result.address) {
          return { fee: 0, estimate: 'CEP inválido' };
        }

        const state = result.address.state;
        const city = result.address.city;
        
        // Lógica de cálculo baseada na localização
        let fee = 8.99; // Taxa base
        let estimate = '2-3 dias úteis';
        
        // Ajustes por estado
        if (state === 'RJ') {
          // Mesmo estado - taxa reduzida
          fee = 5.99;
          estimate = '1-2 dias úteis';
          
          // Mesma cidade - taxa ainda menor
          if (city.toLowerCase().includes('mesquita') || 
              city.toLowerCase().includes('nova iguaçu') ||
              city.toLowerCase().includes('rio de janeiro')) {
            fee = 3.99;
            estimate = '1 dia útil';
          }
        } else if (['SP', 'MG', 'ES'].includes(state)) {
          // Estados próximos
          fee = 9.99;
          estimate = '2-4 dias úteis';
        } else {
          // Estados distantes
          fee = 15.99;
          estimate = '3-7 dias úteis';
        }
        
        // Ajuste por peso
        if (weight > 2) {
          fee += (weight - 2) * 2.50;
        }
        
        return { fee, estimate };
      })
    );
  }

  /**
   * Valida se o CEP está em área de entrega
   */
  isDeliveryAreaValid(cep: string): Observable<boolean> {
    return this.getAddressByCep(cep).pipe(
      map(result => {
        if (!result.valid || !result.address) {
          return false;
        }
        
        const state = result.address.state;
        
        // Por enquanto, atendemos apenas RJ, SP, MG e ES
        return ['RJ', 'SP', 'MG', 'ES'].includes(state);
      })
    );
  }
}

import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'CUSTOMER' | 'ADMIN';
  createdAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone?: string;
  password: string;
  acceptMarketing?: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresIn: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);

  public currentUser$ = this.currentUserSubject.asObservable();
  public isLoading$ = this.isLoadingSubject.asObservable();

  // Mock users database
  private mockUsers: User[] = [
    {
      id: 1,
      name: 'João Silva',
      email: 'joao@email.com',
      phone: '(11) 99999-9999',
      role: 'CUSTOMER',
      createdAt: new Date('2024-01-15')
    },
    {
      id: 2,
      name: 'Maria Santos',
      email: 'maria@email.com',
      phone: '(11) 88888-8888',
      role: 'CUSTOMER',
      createdAt: new Date('2024-02-20')
    },
    {
      id: 3,
      name: 'Admin Mesquita',
      email: 'admin@mesquitacakes.com',
      phone: '(11) 77777-7777',
      role: 'ADMIN',
      createdAt: new Date('2023-12-01')
    }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.loadUserFromStorage();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    this.isLoadingSubject.next(true);

    return of(null).pipe(
      delay(1500), // Simular delay da API
      map(() => {
        const user = this.mockUsers.find(u => u.email === credentials.email);
        
        if (!user) {
          this.isLoadingSubject.next(false);
          throw new Error('E-mail não encontrado');
        }

        // Simular verificação de senha (em produção seria hasheada)
        const validPassword = credentials.password === '123456' || 
                             credentials.password === 'admin123';
        
        if (!validPassword) {
          this.isLoadingSubject.next(false);
          throw new Error('Senha incorreta');
        }

        const token = this.generateMockToken();
        const authResponse: AuthResponse = {
          user,
          token,
          expiresIn: 3600000 // 1 hora
        };

        this.setCurrentUser(user, token);
        this.isLoadingSubject.next(false);
        
        return authResponse;
      })
    );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    this.isLoadingSubject.next(true);

    return of(null).pipe(
      delay(2000), // Simular delay da API
      map(() => {
        // Verificar se e-mail já existe
        const existingUser = this.mockUsers.find(u => u.email === userData.email);
        if (existingUser) {
          this.isLoadingSubject.next(false);
          throw new Error('E-mail já está em uso');
        }

        // Criar novo usuário
        const newUser: User = {
          id: this.mockUsers.length + 1,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          role: 'CUSTOMER',
          createdAt: new Date()
        };

        this.mockUsers.push(newUser);

        const token = this.generateMockToken();
        const authResponse: AuthResponse = {
          user: newUser,
          token,
          expiresIn: 3600000
        };

        this.setCurrentUser(newUser, token);
        this.isLoadingSubject.next(false);
        
        return authResponse;
      })
    );
  }

  logout(): Observable<void> {
    return of(null).pipe(
      map(() => {
        this.currentUserSubject.next(null);
        this.clearStorage();
      })
    );
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value && !!this.getStorageItem('auth_token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  updateProfile(userData: Partial<User>): Observable<User> {
    this.isLoadingSubject.next(true);

    return of(null).pipe(
      delay(1000),
      map(() => {
        const currentUser = this.getCurrentUser();
        if (!currentUser) {
          this.isLoadingSubject.next(false);
          throw new Error('Usuário não autenticado');
        }

        const updatedUser: User = {
          ...currentUser,
          ...userData,
          id: currentUser.id, // Não permitir alteração do ID
          role: currentUser.role, // Não permitir alteração do role
          createdAt: currentUser.createdAt // Não permitir alteração da data de criação
        };

        // Atualizar no mock database
        const userIndex = this.mockUsers.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
          this.mockUsers[userIndex] = updatedUser;
        }

        this.setCurrentUser(updatedUser);
        this.isLoadingSubject.next(false);
        
        return updatedUser;
      })
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<boolean> {
    this.isLoadingSubject.next(true);

    return of(null).pipe(
      delay(1000),
      map(() => {
        const user = this.getCurrentUser();
        if (!user) {
          this.isLoadingSubject.next(false);
          throw new Error('Usuário não autenticado');
        }

        // Em produção, verificaria a senha atual hasheada
        const validCurrentPassword = currentPassword === '123456' || currentPassword === 'admin123';
        if (!validCurrentPassword) {
          this.isLoadingSubject.next(false);
          throw new Error('Senha atual incorreta');
        }

        this.isLoadingSubject.next(false);
        return true;
      })
    );
  }

  forgotPassword(email: string): Observable<boolean> {
    this.isLoadingSubject.next(true);

    return of(null).pipe(
      delay(1500),
      map(() => {
        const user = this.mockUsers.find(u => u.email === email);
        if (!user) {
          this.isLoadingSubject.next(false);
          throw new Error('E-mail não encontrado');
        }

        this.isLoadingSubject.next(false);
        return true;
      })
    );
  }

  private generateMockToken(): string {
    return 'mock_token_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  private setCurrentUser(user: User, token?: string): void {
    this.currentUserSubject.next(user);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('current_user', JSON.stringify(user));
      if (token) {
        localStorage.setItem('auth_token', token);
      }
    }
  }

  private loadUserFromStorage(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return; // Skip localStorage operations on server
    }
    
    const token = this.getStorageItem('auth_token');
    const userStr = this.getStorageItem('current_user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error loading user from storage:', error);
        this.clearStorage();
      }
    }
  }

  private clearStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('current_user');
    }
  }

  private getStorageItem(key: string): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(key);
    }
    return null;
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { AuthService, User } from './auth.service';
import { CheckoutService, Order } from './checkout.service';

export interface UserProfile extends User {
  birthDate?: Date;
  addresses: Address[];
  preferences: {
    notifications: boolean;
    newsletter: boolean;
    smsUpdates: boolean;
  };
  statistics: {
    totalOrders: number;
    totalSpent: number;
    favoriteProducts: string[];
    loyaltyPoints: number;
  };
}

export interface Address {
  id: string;
  name: string;
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  reference?: string;
  isDefault: boolean;
  createdAt: Date;
}

export interface UserOrder extends Order {
  hasReview?: boolean;
  deliveryAddress?: Address;
}

export interface OrderFilter {
  status?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
  offset?: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userProfile$ = new BehaviorSubject<UserProfile | null>(null);

  constructor(
    private authService: AuthService,
    private checkoutService: CheckoutService
  ) {
    // Subscribe to auth changes
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.loadUserProfile(user.id.toString());
      } else {
        this.userProfile$.next(null);
      }
    });
  }

  // User Profile Management
  getUserProfile(): Observable<UserProfile | null> {
    return this.userProfile$.asObservable();
  }

  updateProfile(updates: Partial<UserProfile>): Observable<UserProfile> {
    const currentProfile = this.userProfile$.value;
    if (!currentProfile) {
      throw new Error('No user profile loaded');
    }

    const updatedProfile: UserProfile = {
      ...currentProfile,
      ...updates
    };

    // Simulate API call
    return of(updatedProfile).pipe(
      delay(1000),
      map(profile => {
        this.userProfile$.next(profile);
        return profile;
      })
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<boolean> {
    // Simulate API call
    return of(true).pipe(delay(1000));
  }

  // Address Management
  getAddresses(): Observable<Address[]> {
    const profile = this.userProfile$.value;
    return of(profile?.addresses || []).pipe(delay(300));
  }

  addAddress(address: Omit<Address, 'id' | 'createdAt'>): Observable<Address> {
    const newAddress: Address = {
      ...address,
      id: this.generateId(),
      createdAt: new Date()
    };

    const currentProfile = this.userProfile$.value;
    if (currentProfile) {
      // If this is the first address or marked as default, make it default
      if (currentProfile.addresses.length === 0 || address.isDefault) {
        // Remove default from other addresses
        currentProfile.addresses.forEach(addr => addr.isDefault = false);
        newAddress.isDefault = true;
      }

      currentProfile.addresses.push(newAddress);
      this.userProfile$.next(currentProfile);
    }

    return of(newAddress).pipe(delay(800));
  }

  updateAddress(id: string, updates: Partial<Address>): Observable<Address> {
    const currentProfile = this.userProfile$.value;
    if (!currentProfile) {
      throw new Error('No user profile loaded');
    }

    const addressIndex = currentProfile.addresses.findIndex(addr => addr.id === id);
    if (addressIndex === -1) {
      throw new Error('Address not found');
    }

    // If setting as default, remove default from others
    if (updates.isDefault) {
      currentProfile.addresses.forEach(addr => addr.isDefault = false);
    }

    const updatedAddress = { ...currentProfile.addresses[addressIndex], ...updates };
    currentProfile.addresses[addressIndex] = updatedAddress;
    this.userProfile$.next(currentProfile);

    return of(updatedAddress).pipe(delay(800));
  }

  deleteAddress(id: string): Observable<boolean> {
    const currentProfile = this.userProfile$.value;
    if (!currentProfile) {
      throw new Error('No user profile loaded');
    }

    const addressIndex = currentProfile.addresses.findIndex(addr => addr.id === id);
    if (addressIndex === -1) {
      throw new Error('Address not found');
    }

    const wasDefault = currentProfile.addresses[addressIndex].isDefault;
    currentProfile.addresses.splice(addressIndex, 1);

    // If deleted address was default, make first address default
    if (wasDefault && currentProfile.addresses.length > 0) {
      currentProfile.addresses[0].isDefault = true;
    }

    this.userProfile$.next(currentProfile);
    return of(true).pipe(delay(500));
  }

  setDefaultAddress(id: string): Observable<boolean> {
    return this.updateAddress(id, { isDefault: true }).pipe(
      map(() => true)
    );
  }

  // Order Management
  getUserOrders(filter?: OrderFilter): Observable<UserOrder[]> {
    // Get orders from checkout service and filter
    return this.checkoutService.getOrderHistory().pipe(
      map(orders => {
        let filteredOrders = [...orders];

        if (filter?.status && filter.status.length > 0) {
          filteredOrders = filteredOrders.filter(order => 
            filter.status!.includes(order.status)
          );
        }

        if (filter?.dateFrom) {
          filteredOrders = filteredOrders.filter(order => 
            order.createdAt >= filter.dateFrom!
          );
        }

        if (filter?.dateTo) {
          filteredOrders = filteredOrders.filter(order => 
            order.createdAt <= filter.dateTo!
          );
        }

        // Sort by creation date (newest first)
        filteredOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        
        // Apply pagination
        if (filter?.offset || filter?.limit) {
          const offset = filter.offset || 0;
          const limit = filter.limit || 10;
          filteredOrders = filteredOrders.slice(offset, offset + limit);
        }

        // Convert to UserOrder[] (add hasReview and deliveryAddress properties)
        return filteredOrders.map(order => ({
          ...order,
          hasReview: Math.random() > 0.7, // Simulate some orders having reviews
          deliveryAddress: order.address ? {
            id: '1',
            name: 'Casa',
            zipCode: order.address.zipCode,
            street: order.address.street,
            number: order.address.number,
            complement: order.address.complement,
            neighborhood: order.address.neighborhood,
            city: order.address.city,
            state: order.address.state,
            reference: order.address.reference,
            isDefault: true,
            createdAt: new Date()
          } : undefined
        }));
      }),
      delay(500)
    );
  }

  getOrderDetails(orderNumber: string): Observable<Order> {
    return this.checkoutService.getOrder(orderNumber);
  }

  cancelOrder(orderNumber: string, reason: string): Observable<boolean> {
    // Simulate API call to cancel order
    return of(true).pipe(delay(1000));
  }

  reorderItems(orderNumber: string): Observable<boolean> {
    // Simulate adding order items back to cart
    return of(true).pipe(delay(800));
  }

  // Preferences Management
  updatePreferences(preferences: UserProfile['preferences']): Observable<boolean> {
    const currentProfile = this.userProfile$.value;
    if (!currentProfile) {
      throw new Error('No user profile loaded');
    }

    currentProfile.preferences = preferences;
    this.userProfile$.next(currentProfile);

    return of(true).pipe(delay(500));
  }

  // Loyalty Points
  getLoyaltyPoints(): Observable<number> {
    const profile = this.userProfile$.value;
    return of(profile?.statistics.loyaltyPoints || 0);
  }

  // Private methods
  private loadUserProfile(userId: string): void {
    // Simulate loading user profile
    const mockProfile: UserProfile = {
      id: parseInt(userId),
      name: 'João Silva',
      email: 'joao.silva@email.com',
      phone: '(11) 99999-9999',
      role: 'CUSTOMER',
      birthDate: new Date('1990-05-15'),
      addresses: [
        {
          id: 'addr-1',
          name: 'Casa',
          zipCode: '01234-567',
          street: 'Rua das Flores',
          number: '123',
          complement: 'Apto 45',
          neighborhood: 'Centro',
          city: 'São Paulo',
          state: 'SP',
          reference: 'Próximo ao supermercado',
          isDefault: true,
          createdAt: new Date('2024-01-15')
        },
        {
          id: 'addr-2',
          name: 'Trabalho',
          zipCode: '04567-890',
          street: 'Av. Paulista',
          number: '1000',
          complement: 'Sala 801',
          neighborhood: 'Bela Vista',
          city: 'São Paulo',
          state: 'SP',
          isDefault: false,
          createdAt: new Date('2024-02-20')
        }
      ],
      preferences: {
        notifications: true,
        newsletter: true,
        smsUpdates: false
      },
      statistics: {
        totalOrders: 25,
        totalSpent: 1250.75,
        favoriteProducts: ['bolo-chocolate', 'brigadeiro-gourmet', 'torta-morango'],
        loyaltyPoints: 1250
      },
      createdAt: new Date('2024-01-01')
    };

    // Simulate network delay
    setTimeout(() => {
      this.userProfile$.next(mockProfile);
    }, 1000);
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}

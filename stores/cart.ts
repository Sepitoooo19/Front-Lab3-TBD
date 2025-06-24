import { defineStore } from 'pinia';
import { trackClientNavigation } from '~/services/trackingService';

export const useCartStore = defineStore('cart', {
  state: () => ({
    products: [] as { id: number; name: string; price: number }[],
  }),
  actions: {
    async addProduct(product: { id: number; name: string; price: number }) {
      const exists = this.products.find((p) => p.id === product.id);
      if (!exists) {
        this.products.push(product);
        this.saveToLocalStorage();
        
        // Tracking con nuevo formato
        await trackClientNavigation({
          eventType: 'add_to_cart',
          metadata: {
            productId: product.id,
            productName: product.name,
            unitPrice: product.price,
            currentCartSize: this.products.length,
            totalCartValue: this.products.reduce((sum, p) => sum + p.price, 0)
          }
        });
      }
    },
    
    async removeProduct(productId: number) {
      const product = this.products.find(p => p.id === productId);
      this.products = this.products.filter((p) => p.id !== productId);
      this.saveToLocalStorage();
      
      // Tracking con nuevo formato
      if (product) {
        await trackClientNavigation({
          eventType: 'remove_from_cart',
          metadata: {
            productId: product.id,
            productName: product.name,
            currentCartSize: this.products.length
          }
        });
      }
    },
    
    async clearCart() {
      // Tracking con nuevo formato
      if (this.products.length > 0) {
        await trackClientNavigation({
          eventType: 'cart_cleared',
          metadata: {
            itemsCleared: this.products.length,
            lastProduct: this.products[this.products.length - 1]
          }
        });
      }
      
      this.products = [];
      this.saveToLocalStorage();
    },
    
    saveToLocalStorage() {
      localStorage.setItem('cart', JSON.stringify(this.products));
    },
    
    async loadFromLocalStorage() {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          if (Array.isArray(parsedCart)) {
            this.products = parsedCart;
            console.log('Productos cargados desde localStorage:', this.products);
            
            // Tracking con nuevo formato
            if (this.products.length > 0) {
              await trackClientNavigation({
                eventType: 'cart_restored',
                metadata: {
                  itemCount: this.products.length
                }
              });
            }
          } else {
            throw new Error('Datos corruptos en localStorage');
          }
        } catch (error) {
          console.error('Error al cargar productos del carrito:', error);
          this.products = [];
        }
      }
    },
  },
});
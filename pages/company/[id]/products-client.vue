<!-- Productos de la empresa por id para el cliente -->
<script setup lang="ts">
// Importa las dependencias necesarias
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getProductsByCompanyId } from '~/services/productService';
import { getCompanyById } from '~/services/companyService';
import { useCartStore } from '~/stores/cart';
import { trackClientNavigation } from '~/services/trackingService';
import type { Product, Company } from '~/types/types';

// Define las variables reactivas
const route = useRoute();
const companyId = Number(route.params.id);
const products = ref<Product[]>([]);
const company = ref<Company | null>(null);
const cartStore = useCartStore();
cartStore.loadFromLocalStorage();

// Handle para agregar productos al carrito
const handleAddToCart = async (product: Product) => {
  try {
    await cartStore.addProduct({
      id: product.id,
      name: product.name,
      price: product.price,
    });
    
    // Tracking con nuevo formato
    await trackClientNavigation({
      eventType: 'add_to_cart',
      metadata: {
        productId: product.id,
        productName: product.name,
        companyId: companyId
      }
    });
    
    console.log('Producto agregado al carrito:', product);
  } catch (error) {
    console.error('Error al agregar producto:', error);
  }
};

// Carga inicial de productos
onMounted(async () => {
  try {
    // Tracking con nuevo formato
    await trackClientNavigation({
      eventType: 'view_products',
      metadata: {
        companyId: companyId,
        category: route.query.category?.toString() || 'general'
      }
    });
    
    // Carga de productos
    products.value = await getProductsByCompanyId(companyId);
    company.value = await getCompanyById(companyId);
    
  } catch (err) {
    console.error('Error al cargar datos:', err);
    
    // Tracking de error
    await trackClientNavigation({
      eventType: 'product_load_error',
      metadata: {
        companyId: companyId,
        error: err instanceof Error ? err.message : 'Error desconocido'
      }
    });
  }
});

definePageMeta({
  layout: 'client',
});
</script>

<template>
  <div>
    <!-- Título dinámico basado en el nombre de la empresa -->
    <h1 v-if="company" class="text-2xl font-bold mb-4">
      Productos - Empresa {{ company.name }}
    </h1>
    <h1 v-else class="text-2xl font-bold mb-4">
      Cargando datos de la empresa...
    </h1>

    <!-- Tabla de productos -->
    <table class="min-w-full bg-white border border-gray-300 rounded-lg shadow">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-4 py-2 text-left">Nombre</th>
          <th class="px-4 py-2 text-left">Precio</th>
          <th class="px-4 py-2 text-left">Acción</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="product in products"
          :key="product.id"
          class="hover:bg-gray-50"
        >
          <td class="px-4 py-2">{{ product.name }}</td>
          <td class="px-4 py-2">${{ product.price }}</td>
          <td class="px-4 py-2">
            <button
              class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              @click="handleAddToCart(product)"
            >
              Agregar al Carrito
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
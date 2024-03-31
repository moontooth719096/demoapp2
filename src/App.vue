<script setup lang="ts">
import { ref } from "vue";

interface Product {
  id: number;
  title: string;
  price: number;
  inStock: boolean;
  imageUrl: string;
}
const products = ref<Product[]>([
  {
    id: 1,
    title: "纯棉 T 恤",
    price: 66,
    inStock: true,
    imageUrl: "/images/t-shirt1.jpg",
  },
  {
    id: 2,
    title: "夹克外套",
    price: 128,
    inStock: true,
    imageUrl: "/images/jacket1.jpg",
  },
  {
    id: 3,
    title: "水洗牛仔裤",
    price: 99,
    inStock: false,
    imageUrl: "/images/jeans1.jpg",
  },
  {
    id: 4,
    title: "印花 T恤",
    price: 72,
    inStock: true,
    imageUrl: "/images/t-shirt2.jpg",
  },
]);
</script>

<template>
  <router-view></router-view>
</template>

<style scoped></style>

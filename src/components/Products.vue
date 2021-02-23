<template>
    <div>
        <div v-bind:key="product.id" v-for="product in products">
            <ProductCard />
        </div>
    </div>
</template>

<script>
import ProductCard from './ProductCard.vue';
export default {
    name: "Products",
    components: {
        ProductCard
    },
    props: ["products"]
}
</script>

<style scoped>

</style>
<template>
    <v-container>
        <v-row>
            <v-col :key="product.id" v-for="product in products" cols="12" sm="3">
                <ProductCard :product="product" v-on:del-product="$emit('del-product', product.id)"/>
            </v-col>
        </v-row>
    </v-container>
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
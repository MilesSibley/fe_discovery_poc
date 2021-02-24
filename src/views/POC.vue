<template>
    <div class="POC">
        <h1 class="page-title">Original POC</h1>
        <Products v-bind:products="products" v-on:del-product="deleteProduct" v-on:edit-product="editProduct"/>
    </div>
</template>

<script>
import axios from 'axios';
import Products from '../components/Products.vue'
export default {
    name: 'Home',
    components:{
        Products
    },
    data(){
        return{
            products:[]
        }      
    },
    created(){
        axios.get('https://my-json-server.typicode.com/MilesSibley/JSON-Server/products')
        .then(res => this.products = res.data)
        .catch(err => console.log(err));
    },
    methods: {
        deleteProduct(id){
            axios.delete(`https://my-json-server.typicode.com/MilesSibley/JSON-Server/products/${id}`)
                // eslint-disable-next-line no-unused-vars
                .then(res => console.log(res.status),this.products = this.products.filter( product => product.id !== id))            
                .catch(err => console.log(err));      
        },
        editProduct(product){
            this.$router.push({name: 'Form', params: {product:product}})   
        }
    }
}
</script>

<style scoped>

</style>
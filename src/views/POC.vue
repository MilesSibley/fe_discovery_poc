<template>
    <div class="POC">
        <h1>Original POC</h1>
        <Products v-bind:products="products"/>
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
    }
}
</script>

<style scoped>

</style>
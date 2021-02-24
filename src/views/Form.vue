<template>
<div class="edit">
    <h1 class="page-title">Create New Product</h1>
    <ProductForm v-bind:product="product" v-on:create-product="createProduct" v-on:update-product="updateProduct"/>
</div>

</template>

<script>
import ProductForm from '@/components/ProductForm.vue'
import axios from 'axios';

export default {
    name: 'Edit',
    components: {
        ProductForm
    },
    methods: {
        createProduct(formValues){
            axios.post('https://my-json-server.typicode.com/MilesSibley/JSON-Server/products/',formValues)
                // eslint-disable-next-line no-unused-vars
                .then(res => console.log(res.status))            
                .catch(err => console.log(err));    
            this.$router.push('POC')  
        },
        updateProduct(formValues){
            axios.put(`https://my-json-server.typicode.com/MilesSibley/JSON-Server/products/${formValues.id}`,formValues)
                // eslint-disable-next-line no-unused-vars
                .then(res => console.log(res.status))            
                .catch(err => console.log(err));    
            this.$router.push('POC')  
        }
    },
    props: {
        product:{
            default: {}
        }
    }
     
}
</script>
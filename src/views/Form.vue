<template>
<div class="edit">
    <h1 class="page-title">Create New Product</h1>
    <ProductForm v-on:create-product="createProduct" />
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
        }
    }
}
</script>
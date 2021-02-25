<template>
  <div class="POC">
    <v-container>
      <v-row>
        <v-spacer></v-spacer>
        <v-col cols="11">
        <h1 class="page-title">Original POC</h1>
        <Products
        v-bind:products="products"
        v-on:del-product="deleteProduct"
        v-on:edit-product="editProduct"
        />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios';
import Products from '../components/Products.vue'
import Swal from "sweetalert2";

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
                .then((res) => { 
                    if(res.status == 200){
                        setTimeout(function () {
                            Swal.fire({
                                position: "top-end",
                                icon: "success",
                                width: 400,
                                title: "Prodcut successfully deleted. Response code: " + res.status,
                                showConfirmButton: false,
                                timer: 1500,
                            });
                        }, 500);
                        
                        //Filter out the deleted product from the view
                        this.products = this.products.filter( product => product.id !== id);
                    }
                    else{
                        Swal.fire({
                            position: "top-end",
                            icon: "error",
                            title: "Something went wrong... Response code: " + res.status,
                            showConfirmButton: false,
                            timer: 1500,
                        });
                    }
                })
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
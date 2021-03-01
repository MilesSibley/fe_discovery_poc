<template>
  <div class="POC">
    <v-container>
        <v-row>
            <v-col cols="1"/>
            <v-col cols="6">
                <h1 >Original POC</h1>
            </v-col>
            <v-col cols="2">
                <SearchBar v-on:search-typeahead="filterProductList"/>
            </v-col>
            <v-col cols="1">
                <v-btn icon @click="$router.push('Form')">
                    <v-icon large>{{ "mdi-plus" }}</v-icon>
                </v-btn>
            </v-col>
        </v-row>
      <v-row>
        <v-col cols="1"/>
        <v-col cols="10">
            <Products
            v-bind:products="filteredProductDetails"
            v-on:del-product="deleteProduct"
            v-on:edit-product="editProduct"
            />
        </v-col>
        <v-col cols="1"/>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios';
import Products from '../components/Products.vue'
import SearchBar from '../components/SearchBar.vue'
import Swal from "sweetalert2";

export default {
    name: 'Home',
    components:{
        Products,
        SearchBar
    },
    data(){
        return{
            productList:[],
            productDetails:[],
            filteredProductDetails:[],
            selectedProduct:[]
        }      
    },
    created(){
        axios.get('https://my-json-server.typicode.com/MilesSibley/JSON-Server/products')
        .then(res => {
            this.productList = res.data 
            for (var i = 0; i < this.productList.length; i++) {
                this.productDetails.push({
                    id: this.productList[i].id,
                    image: this.productList[i].image,
                    title: this.productList[i].name,
                    subtitle: this.productList[i].fileName,
                    details: this.productList[i].legendTitle,
                    status: this.productList[i].imageStatus
                })
            }
            this.filteredProductDetails = this.productDetails      
        })
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
                        this.filteredProductDetails = this.filteredProductDetails.filter( product => product.id !== id);
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
            this.selectedProduct = this.productList[product.id]
            this.$router.push({name: 'Form', params: {product:this.selectedProduct}})   
        },
        filterProductList(filterOnValue){
            if(filterOnValue == ''){
                this.filteredProductDetails = this.productDetails
            }
            else{
                this.filteredProductDetails = this.productDetails.filter( product => { 
                    return (product.title.toLowerCase().includes(filterOnValue.toLowerCase()) ||
                            product.subtitle.toLowerCase().includes(filterOnValue.toLowerCase()))
                    });
            }
        }
    }
}
</script>

<style scoped>
</style>
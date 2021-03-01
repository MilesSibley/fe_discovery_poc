<template>
    <div class="imageUploader">
        <v-container>
            <v-row>
                <v-col cols="1"/>
                <v-col cols="6">
                    <h1 >Bio-Techne Image Uploader POC</h1>
                </v-col>
                <v-col cols="2">
                    <SearchBar v-on:search-typeahead="buildSearchValue"/>
                </v-col>
                <v-col cols="1">
                    <v-btn @click="findImages" elevation="2"> Search</v-btn>
                </v-col>
                <v-col cols="2">
                    <v-btn v-if="productDetails.length > 0" icon @click="$router.push('Form')">
                        <v-icon large>{{ "mdi-plus" }}</v-icon>
                    </v-btn>
                
                </v-col>
            </v-row>
        <v-row>
            <v-col cols="1"/>
            <v-col cols="10">
                <Products
                    v-bind:products="productDetails"
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
// import Swal from "sweetalert2";

export default {
    name: 'ProductImages',
    components:{
        Products,
        SearchBar
    },
    data(){
        return{
            productImagesList:[],
            productDetails:[],
            productSearchValue: ''            

        }      
    },
    created(){
        
    },
     methods: {
        deleteProduct(id){
            //Filter out the deleted product from the view
            this.productDetails = this.productDetails.filter( product => product.id !== id);
        },
        editProduct(product){
            this.$router.push({name: 'Form', params: {product:product}})   
        },
        buildSearchValue(searchValue){
            this.productSearchValue = searchValue
        },
        findImages(){
            axios.get(`https://aeroproductimageswebapidev.azurewebsites.net/api/BaseImages/productimagebyproductcode/${this.productSearchValue}`)
            .then(res => {
                this.productImagesList = res.data
                for (var i = 0; i < this.productImagesList.length; i++) {
                    this.productDetails.push({
                        id: this.productImagesList[i].$id,
                        image: this.productImagesList[i].fileLocation,
                        title: this.productImagesList[i].productCode + " - Image " +  this.productImagesList[i].imageOrder,
                        subtitle: this.productImagesList[i].fileName,
                        details: this.productImagesList[i].legendTitle,
                        status: this.productImagesList[i].imageStatus
                    })
                }           
            })
            .catch(err => console.log(err));
        }
     }
}
</script>

<style scoped>

</style>
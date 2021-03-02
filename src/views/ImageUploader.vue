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
                    <v-btn v-if="productCode != 0" icon @click="createProduct">
                        <v-icon large>{{ "mdi-plus" }}</v-icon>
                    </v-btn>
                
                </v-col>
            </v-row>
        <v-row>
            <v-col cols="1"/>
            <v-col cols="10">
                <keep-alive>
                <Products
                    v-bind:products="productCardDetails"
                    v-on:del-product="deleteProduct"
                    v-on:edit-product="editProduct"
                />
                </keep-alive>
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
            productCardDetails:[],
            selectedProduct:{},
            productSearchValue: '',
            productCode: 'MAB0033'            

        }      
    },
    created(){
        
    },
     methods: {
        createProduct(){
            this.selectedProduct = {
                productCode: this.productCode
            }
            this.$router.push({name: 'IU-Form', params: {product:this.selectedProduct}})   
        },
        deleteProduct(id){
            //Filter out the deleted product from the view
            this.productCardDetails = this.productCardDetails.filter( product => product.id !== id);
        },
        editProduct(product){
            var productImagesEntry = this.productImagesList.filter(entry => entry.$id == product.id )
            
            //Set up the product props to setnd to the IU-Form
            this.selectedProduct = {
                image: productImagesEntry[0].fileLocation,
                name: productImagesEntry[0].fileName,
                application: productImagesEntry[0].applicationName,
                type: productImagesEntry[0].imageType,
                legendTitle: productImagesEntry[0].legendTitle,
                imageStatus: productImagesEntry[0].imageStatus
            }
            
            this.$router.push({name: 'IU-Form', params: {product:this.selectedProduct}})   
        },
        buildSearchValue(searchValue){
            this.productSearchValue = searchValue
        },
        findImages(){
            this.productCode = this.productSearchValue
            axios.get(`https://aeroproductimageswebapidev.azurewebsites.net/api/BaseImages/productimagebyproductcode/${this.productCode}`)
            .then(res => {
                this.productImagesList = res.data
                for (var i = 0; i < this.productImagesList.length; i++) {
                    this.productCardDetails.push({
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
<template>
  <div class="POC">
    <v-container>
        <v-row>
            <v-col cols="1"/>
            <v-col cols="6">
                <h1 >Original POC</h1>
            </v-col>
            <v-col cols="2">
                <SearchBar v-if="currentComponent == 'ProductDetails'" v-on:search-typeahead="filterProductList"/>
            </v-col>
            <v-col cols="1">
                <v-btn v-if="currentComponent == 'ProductDetails'" icon @click="launchUpsert_Create">
                    <v-icon large>{{ "mdi-plus" }}</v-icon>
                </v-btn>
            </v-col>
        </v-row>
      <v-row>
        <v-col cols="1"/>
        <v-col cols="10">
            <component :is="currentComponent" 
                v-bind="currentProperties"
                v-on:cancel-productForm="cancelUpsert"
                v-on:create-product="createProduct"
                v-on:edit-product="launchUpsert_Update"
                v-on:update-product="updateProduct"
                v-on:del-product="deleteProduct"
            />
        </v-col>
        <v-col cols="1"/>
      </v-row>
    </v-container>
    <Alert ref="alert"/>
  </div>
</template>

<script>
import axios from 'axios';
import ProductDetails from '@/components/Products.vue'
import UpsertForm from "@/components/ProductForm.vue";
import SearchBar from '@/components/SearchBar.vue'
import Alert from "@/components/layout/Alert.vue";
import VueSimpleSpinner from '@/components/animations/VueSimpleSpinner.vue'

export default {
    name: 'POC',
    components:{
        Alert,
        ProductDetails,
        UpsertForm,
        SearchBar,
        VueSimpleSpinner
    },
    data(){
        return{
            productList:[],
            productDetails:[],
            filteredProductDetails:[],
            selectedProduct:{},
            applications: [],
            types: [],
                        
            //Default component that should display
            currentComponent: 'ProductDetails'
        }      
    },
    computed: {
        currentProperties: function() {
            if (this.currentComponent === 'ProductDetails') {
                return { 
                    products: this.filteredProductDetails 
                }
            }
            else if(this.currentComponent === 'UpsertForm') 
            {
                return { 
                    product: this.selectedProduct,
                    applications:this.applications,
                    types:this.types
                }
            }
            else
                return {}
        }
    },   
    created(){
        this.retrieveProducts()
        //Call the API to get values for the Application dropdown
        axios
        .get(
            "https://my-json-server.typicode.com/MilesSibley/JSON-Server/application"
        )
        .then((response) => {
            var data = response.data;
            for (var i = 0; i < data.length; i++) {
            this.applications.push(data[i].name);
            }
        })
        .catch((err) => console.log(err));

        //Call the API to get values for the Type dropdown
        axios
        .get("https://my-json-server.typicode.com/MilesSibley/JSON-Server/type")
        .then((response) => {
            var data = response.data;
            for (var i = 0; i < data.length; i++) {
            this.types.push(data[i].name);
            }
        })
        .catch((err) => console.log(err));
    },
    methods: {
        //CRUD functionality
        createProduct(formValues){
            this.currentComponent = 'VueSimpleSpinner'
            axios.post(
            "https://my-json-server.typicode.com/MilesSibley/JSON-Server/products/",
            formValues
            )
            .then((res) => {
                if (res.status == 201) {
                    this.$refs.alert.displayResult("success","Product Created", "Response code: " + res.status)
                    this.currentComponent = 'ProductDetails'
                } else {
                    this.$refs.alert.displayResult("error","Something Went Wrong", "Response code: " + res.status)
                    this.currentComponent = 'UpsertForm'
                }
            })
            .catch((err) => console.log(err));
        },
        retrieveProducts()
        {
            this.currentComponent = 'VueSimpleSpinner'
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
                this.currentComponent = 'ProductDetails'      
            })
            .catch(err => console.log(err));
        },
        updateProduct(formValues){
            this.currentComponent = 'VueSimpleSpinner'
            axios.put(
                `https://my-json-server.typicode.com/MilesSibley/JSON-Server/products/${formValues.id}`,
                formValues
            )
            .then((res) => {
            if (res.status == 200) {
                this.$refs.alert.displayResult("success","Product Updated", "Response code: " + res.status)
                this.currentComponent = 'ProductDetails'
            } else {
                this.$refs.alert.displayResult("error","Something Went Wrong", "Response code: " + res.status)
                this.currentComponent = 'UpsertForm'
            }
            })
            .catch((err) => {
                console.log(err)
            });
        },
        deleteProduct(id){
            axios.delete(`https://my-json-server.typicode.com/MilesSibley/JSON-Server/products/${id}`)
                .then((res) => { 
                    console.log(res.status)
                    if(res.status == 200){
                        this.$refs.alert.displayResult("success","Product Deleted", "Response code: " + res.status)

                        //Filter out the deleted product from the view
                        this.filteredProductDetails = this.filteredProductDetails.filter( product => product.id !== id);
                    }
                    else{
                        this.$refs.alert.displayResult("error","Something Went Wrong", "Response code: " + res.status)
                    }
                })
                .catch(err => console.log(err));
        },
        //Filtering Functionality
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
        },
        //Switching Dynamic Components
        launchUpsert_Create()
        {
            this.selectedProduct = {}
            this.currentComponent = 'UpsertForm'
        },
        launchUpsert_Update(product)
        {
            //Set up the product props to send to the Product Form component
            this.selectedProduct = this.productList[product.id]
            
            this.selectedProduct.imageSrc = this.selectedProduct.image
            this.currentComponent = 'UpsertForm'

        },
        cancelUpsert(){
            this.currentComponent = 'ProductDetails'
        }
    }
}
</script>

<style scoped>
</style>
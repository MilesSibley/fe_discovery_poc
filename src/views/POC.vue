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
                    v-on:cancel-productForm="cancelUpsert"
                    v-on:create-product="createProduct"
                    v-on:edit-product="launchUpsert_Update"
                    v-on:update-product="updateProduct"
                    v-on:del-product="deleteProduct"
                    :key="componentKey" 
                />
            </v-col>
            <v-col cols="1"/>
      </v-row>
    </v-container>
    <Alert ref="alert"/>
  </div>
</template>

<script>
import Alert from "@/components/layout/Alert.vue";
import axios from 'axios';
import LoadingAnimation from '@/components/animations/VueSimpleSpinner.vue';
import {mapActions,mapGetters,mapMutations} from 'vuex';
import ProductDetails from '@/components/ProductCardDisplay.vue';
import SearchBar from '@/components/SearchBar.vue';
import UpsertForm from "@/components/UpsertForm.vue";

export default {
    name: 'POC',
    components:{
        Alert,
        ProductDetails,
        UpsertForm,
        SearchBar,
        LoadingAnimation
    },
    computed: {
        ...mapGetters([
            'getFilteredProductDetails',
            'getProductDetails',
            'getPropertySelectedProduct',
            'getSelectedProduct'
        ]),
        currentProperties: function() {
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
            let applications = response.data.map(value => value.name)
            this.setApplications(applications)
        })
        .catch((err) => console.log(err));

        //Call the API to get values for the Type dropdown
        axios
        .get(
            "https://my-json-server.typicode.com/MilesSibley/JSON-Server/type"
        )
        .then((response) => {
            let types = response.data.map(value => value.name)
            this.setTypes(types)
        })
        .catch((err) => console.log(err));
    },
    data(){
        return{
            productList:[],

            //Current component details
            componentKey: 0,
            currentComponent: 'ProductDetails'
        }      
    },
    methods: {
        ...mapMutations([
            'addToSelectedProduct',
            'setFilteredProductDetails',
            'setProductDetails',
            'setSelectedProduct'
        ]),
        ...mapActions([
            'resetProductDetails',
            'setApplications',
            'setTypes'
        ]),
        //CRUD operations
        createProduct(formValues){
            this.currentComponent = 'LoadingAnimation'
            axios.post("https://my-json-server.typicode.com/MilesSibley/JSON-Server/products/",formValues)
            .then((res) => {
                if (res.status == 201) {
                    //Show a success message, and display the ProductDetails component
                    this.$refs.alert.displayResult("success","Product Created", "Response code: " + res.status)
                    this.currentComponent = 'ProductDetails'
                    this.refreshComponent()

                } else {
                    this.$refs.alert.displayResult("error","Something Went Wrong", "Response code: " + res.status)
                    this.currentComponent = 'UpsertForm'
                }
            })
            .catch((err) => console.log(err));
        },
        retrieveProducts()
        {
            this.currentComponent = 'LoadingAnimation'
            axios.get('https://my-json-server.typicode.com/MilesSibley/JSON-Server/products')
            .then(res => {
                this.productList = res.data
                let products = res.data.map(value => {return  {
                        id: value.id,
                        image: value.image,
                        title: value.name,
                        subtitle: value.fileName,
                        details: value.legendTitle,
                        status: value.imageStatus,
                    }
                })
                this.resetProductDetails(products)
                this.currentComponent = 'ProductDetails'

            })
            .catch(err => console.log(err));
        },
        updateProduct(formValues){
            this.currentComponent = 'LoadingAnimation'
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
                    if(res.status == 200){
                        this.$refs.alert.displayResult("success","Product Deleted", "Response code: " + res.status)

                        //Filter out the deleted product from the view
                        this.setProductDetails(this.getProductDetails.filter( product => product.id !== id));
                        this.setFilteredProductDetails(this.getFilteredProductDetails.filter( product => product.id !== id));
                        this.refreshComponent();
                    }
                    else{
                        this.$refs.alert.displayResult("error","Something Went Wrong", "Response code: " + res.status)
                    }
                })
                .catch(err => console.log(err));
        },
        //Filtering
        filterProductList(filterOnValue){
            if(filterOnValue == ''){
                this.setFilteredProductDetails(this.getProductDetails)
            }
            else{
                this.setFilteredProductDetails(this.getProductDetails.filter( product => {
                    return (product.title.toLowerCase().includes(filterOnValue.toLowerCase()) ||
                            product.subtitle.toLowerCase().includes(filterOnValue.toLowerCase()))
                    }));
            }
            this.refreshComponent()
        },
        //Dynamic Components
        launchUpsert_Create()
        {
            this.setSelectedProduct({})
            this.currentComponent = 'UpsertForm'
        },
        launchUpsert_Update(product)
        {
            //Set up the product props to send to the Product Form component
            this.setSelectedProduct(this.productList[product.id])
            this.addToSelectedProduct({
                key:"imageSrc",
                value: this.getPropertySelectedProduct("image")
            })

            this.currentComponent = 'UpsertForm'

        },
        cancelUpsert(){
            this.currentComponent = 'ProductDetails'
        },
        refreshComponent() {
            this.componentKey += 1;
        }
    }
}
</script>

<style scoped>
</style>
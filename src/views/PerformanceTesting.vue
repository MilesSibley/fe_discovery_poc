<template>
  <div class="POC">
    <v-container>
        <v-row>
            <v-col cols="1"/>
            <v-col cols="6">
                <h1>Working With Large Data Sets</h1>
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
            <v-spacer/>
            <v-col cols="4">
                <v-btn @click="retrieveProductImages('https://api.mocki.io/v1/105eeeab')" elevation="2">Load 2000 Images</v-btn>
                <v-btn @click="retrieveProductImages('https://api.mocki.io/v1/43f59ddd')" elevation="2">Load 5000 Images</v-btn>
                <v-btn @click="retrieveProductImages('https://api.mocki.io/v1/f8e1698d')" elevation="2">Load 10000 Images</v-btn>    
            </v-col>
            <v-spacer/>
        </v-row>
        <v-row>
            <v-col cols="12">
                <center><b>Total Number of Visible Images: {{filteredProductDetails.length}}</b></center>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="1"/>
            <v-col cols="10">
                <component :is="currentComponent" 
                    v-bind="currentProperties"
                    :key="componentKey" 
                />
            </v-col>
            <v-col cols="1"/>
        </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios';
import LoadingAnimation from '@/components/animations/VueSimpleSpinner.vue';
import ProductDetails from '@/components/ProductCardDisplay.vue';
import SearchBar from '@/components/SearchBar.vue';

export default {
    name:'PerformanceTesting',
    components:{
        ProductDetails,
        SearchBar,
        LoadingAnimation
    },
    data () {
        return{
            productDetails:[],
            filteredProductDetails:[],
                
            //Current component details
            currentComponent: 'ProductDetails',
            componentKey: 0
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
        
    },
    methods: {
        retrieveProductImages(api)
        {
            this.currentComponent = 'LoadingAnimation'
            this.productDetails = []
            axios.get(api)
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
        //Filtering
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
            this.refreshComponent()
        },
        //Dynamic Components
        launchUpsert_Create()
        {
          
        },
        refreshComponent() {
            this.componentKey += 1;
        }
    }
}
</script>


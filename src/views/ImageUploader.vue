<template>
    <div class="imageUploader">
        <v-container>
            <v-row>
                <v-col cols="1"/>
                <v-col cols="6">
                    <h1 >Bio-Techne Image Uploader POC</h1>
                </v-col>
                <v-col cols="2">
                    <SearchBar v-if="currentComponent == 'ProductDetails'" v-on:search-typeahead="buildSearchValue" v-on:search-onchange="retrieveProductImages"/>
                </v-col>
                <v-col cols="1">
                    <v-btn v-if="currentComponent == 'ProductDetails'" @click="retrieveProductImages" elevation="2">Find Images</v-btn>
                </v-col>
                <v-col cols="2">
                    <v-btn v-if="currentComponent == 'ProductDetails' && productCode != 0" icon @click="launchUpsert_Create">
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
                        v-on:create-product="createProductImage"
                        v-on:edit-product="launchUpsert_Update"
                        v-on:update-product="updateProductImage"
                        v-on:del-product="deleteProductImage"
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
import {mapMutations} from 'vuex';
import ProductDetails from '@/components/ProductCardDisplay.vue';
import SearchBar from '@/components/SearchBar.vue';
import UpsertForm from "@/components/UpsertForm.vue";

export default {
    name: 'ProductImages',
    components:{
        Alert,
        ProductDetails,
        UpsertForm,
        SearchBar,
        LoadingAnimation
    },
    created(){
        this.setUpsertDropdowns()
    },
    data(){
        return{
            //The list of all product images currently displaying
            productImagesList:[],
            
            //Props being passed to the Products component
            productCardDetails:[],
            
            //Props being sent to the ProductForm component
            productCode: '',
            selectedProduct:{},
            
            //The search criteria being emitted from the search bar
            productSearchValue: '',
            
            //Current component details
            currentComponent: 'ProductDetails',
            componentKey: 0
        }      
    },
    computed: {
        currentProperties: function() {
            if (this.currentComponent === 'ProductDetails') {
                return { 
                    products: this.productCardDetails 
                }
            }
            else if(this.currentComponent === 'UpsertForm') 
            {
                return { 
                    product: this.selectedProduct
                }
            }
            else
                return {}
        },
    },   
    methods: {
        ...mapMutations([
            'setApplications',
            'setTypes',
        ]),
        //CRUD functionality
        createProductImage(formValues){
            this.currentComponent = 'LoadingAnimation'

            //Set required values for the baseImage sent along with the API call
            var baseImage = {}
            baseImage.applicationName = formValues.application
            baseImage.fileName = formValues.name
            baseImage.imageAltText = "Image alt text for " + formValues.name
            baseImage.imageOrder = 1
            baseImage.imageStatus = formValues.imageStatus
            baseImage.imageType = formValues.type
            baseImage.legend = formValues.application
            baseImage.legendTitle = formValues.legendTitle
            baseImage.productCode = formValues.productCode
            var encodedBaseImage = encodeURI(JSON.stringify(baseImage))
            
            //Setup the form data to send the image within the API call
            var formData = new FormData();
            formData.append("imagefile", formValues.imageFile);
        
            
            //Make the API call
            axios.post("https://aeroproductimageswebapidev.azurewebsites.net/api/BaseImages?productType=Antibody&baseImage=" + encodedBaseImage,
            formData, {
                headers: {
                'Content-Type': 'multipart/form-data'
                }
            })
            .then((res) => {
                if (res.status == 200) {
                    this.retrieveProductImages()
                    this.$refs.alert.displayResult("success","Product Created", "Response code: " + res.status)
                } else {
                    this.$refs.alert.displayResult("error","Something Went Wrong", "Response code: " + res.status)
                    this.currentComponent = 'UpsertForm'
                }
            })
            .catch((err) => console.log(err));
        },
        retrieveProductImages(){
            this.productCode = this.productSearchValue
            this.productCardDetails = [],
            this.currentComponent = 'LoadingAnimation'
            axios.get(`https://aeroproductimageswebapidev.azurewebsites.net/api/BaseImages/productimagebyproductcode/${this.productCode}`)
            .then(res => {
                this.productImagesList = res.data
                for (var i = 0; i < this.productImagesList.length; i++) {
                    
                    //From the results returned, build up the props that will be passed to the ProductDetails component
                    this.productCardDetails.push({
                        id: this.productImagesList[i].$id,
                        image: this.productImagesList[i].fileLocation,
                        title: this.productImagesList[i].productCode + " - Image " +  this.productImagesList[i].imageOrder,
                        subtitle: this.productImagesList[i].fileName,
                        details: this.productImagesList[i].legendTitle,
                        status: this.productImagesList[i].imageStatus
                    })
                }
                this.currentComponent = 'ProductDetails'      
                this.refreshComponent()
            })
            .catch(err => console.log(err));
        },
        updateProductImage(formValues){
            
            //Set required values for the baseImage sent along with the API call
            var baseImage = {}
            baseImage.applicationName = formValues.application
            baseImage.fileName = formValues.name
            baseImage.fileLocation = formValues.imageSrc
            baseImage.imageAltText = formValues.imageAltText
            baseImage.imageGuid = formValues.imageGuid
            baseImage.imageOrder = formValues.imageOrder
            baseImage.legend = formValues.application
            baseImage.productCode = formValues.productCode
            baseImage.legendTitle = formValues.legendTitle
            baseImage.imageStatus = formValues.imageStatus
            baseImage.imageType = formValues.type
            var encodedBaseImage = encodeURI(JSON.stringify(baseImage))

            axios.post("https://aeroproductimageswebapidev.azurewebsites.net/api/BaseImages?productType=Antibody&baseImage=" + encodedBaseImage)
            .then((res) => {
                if (res.status == 200) {
                    this.retrieveProductImages()
                    this.$refs.alert.displayResult("success","Product Updated", "Response code: " + res.status)
                } else {
                    this.$refs.alert.displayResult("error","Something Went Wrong", "Response code: " + res.status)
                    this.currentComponent = 'UpsertForm'
                }
            })
            .catch(err => console.log(err));
        },
        deleteProductImage(id){
            this.selectedProduct = this.productImagesList.filter(entry => entry.$id == id )

            //Filter out the deleted product from the view
            this.productCardDetails = this.productCardDetails.filter( product => product.id !== id);
            this.refreshComponent()
            
            axios.delete(`https://aeroproductimageswebapidev.azurewebsites.net/api/BaseImages?id=${this.selectedProduct[0].imageGuid}`)
                .then((res) => { 
                    if(res.status == 200){
                        this.$refs.alert.displayResult("success","Product Deleted", "Response code: " + res.status)
                    }
                    else{
                        this.$refs.alert.displayResult("error","Something Went Wrong", "Response code: " + res.status)
                    }                    
                })
                .catch(err => console.log(err));
        },
        //Search Functionality
        buildSearchValue(searchValue){
            this.productSearchValue = searchValue
        },
        //Setup states needed for Upsert Form
        setUpsertDropdowns(){
            this.setApplications(["Flow Cytometry","N/A","Western Blot"]),
            this.setTypes(["Data","Linearity"])
        },
        //Dynamic Components
        launchUpsert_Create()
        {
            this.selectedProduct = {
                productCode: this.productCode
            }

            this.currentComponent = 'UpsertForm'
        },
        launchUpsert_Update(product)
        {
            //Find the selected productImage in the list of all productImages
            var productImage = this.productImagesList.filter(entry => entry.$id == product.id )
            
            //Set up the product props to send to the Product Form component
            this.selectedProduct = {
                application: productImage[0].applicationName,
                id:productImage[0].$id,
                imageAltText:productImage[0].imageAltText,
                imageGuid:productImage[0].imageGuid,
                imageOrder:productImage[0].imageOrder,
                imageSrc: productImage[0].fileLocation,
                imageStatus: productImage[0].imageStatus,
                legend:productImage[0].legend,
                legendTitle: productImage[0].legendTitle,
                name: productImage[0].fileName,
                productCode: productImage[0].productCode,
                type: productImage[0].imageType,
                WebfileLocation: productImage[0].WebfileLocation,
            }
            
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
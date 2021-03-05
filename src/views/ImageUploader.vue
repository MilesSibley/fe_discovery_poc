<template>
    <div class="imageUploader">
        <v-container>
            <v-row>
                <v-col cols="1"/>
                <v-col cols="6">
                    <h1 >Bio-Techne Image Uploader POC</h1>
                </v-col>
                <v-col cols="2">
                    <SearchBar v-if="currentComponent == 'ProductDetails'" v-on:search-typeahead="buildSearchValue" v-on:search-onchange="retrieveProductImages(productSearchValue)"/>
                </v-col>
                <v-col cols="1">
                    <v-btn v-if="currentComponent == 'ProductDetails'" @click="retrieveProductImages(productSearchValue)" elevation="2">Find Images</v-btn>
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
                        v-on:cancel-productForm="cancelUpsert"
                        v-on:create-product="createProductImage"
                        v-on:edit-product="launchUpsert_Update"
                        v-on:update-product="updateProductImage"
                        v-on:del-product="deleteProductImage"
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
    name: 'ProductImages',
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
            'getSelectedProduct',
            'getProductImagesList'
        ])
    },   
    created(){
        this.setApplications(["Flow Cytometry","N/A","Western Blot"])
        this.setTypes(["Data","Linearity"])
        this.setupProductDetails(this.getProductImagesList)
    },
    data(){
        return{
            //Props being sent to the ProductForm component
            productCode: '',
            
            //The search criteria being emitted from the search bar
            productSearchValue: '',
            
            //Current component details
            currentComponent: 'ProductDetails'
        }      
    },
    methods: {
        ...mapMutations([
            'setFilteredProductDetails',
            'setProductDetails',
            'setProductImagesList',
            'setSelectedProduct'
        ]),
        ...mapActions([
            'resetProductDetails',
            'setApplications',
            'setTypes'
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
                    this.retrieveProductImages(formValues.productCode)
                    this.$refs.alert.displayResult("success","Product Created", "Response code: " + res.status)
                } else {
                    this.$refs.alert.displayResult("error","Something Went Wrong", "Response code: " + res.status)
                    this.currentComponent = 'UpsertForm'
                }
            })
            .catch((err) => console.log(err));
        },
        retrieveProductImages(productCode){
            console.log('searching fgor ' + productCode)
            this.currentComponent = 'LoadingAnimation'
            axios.get(`https://aeroproductimageswebapidev.azurewebsites.net/api/BaseImages/productimagebyproductcode/${productCode}`)
            .then(res => {
                
                this.setProductImagesList(res.data)
                this.setupProductDetails(res.data)
                
                this.currentComponent = 'ProductDetails'   
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
                    this.retrieveProductImages(formValues.productCode)
                    this.$refs.alert.displayResult("success","Product Updated", "Response code: " + res.status)
                } else {
                    this.$refs.alert.displayResult("error","Something Went Wrong", "Response code: " + res.status)
                    this.currentComponent = 'UpsertForm'
                }
            })
            .catch(err => console.log(err));
        },
        deleteProductImage(id){
            this.setSelectedProduct(this.getProductImagesList.find(entry => entry.$id == id ))

            //Filter out the deleted product from the view
            this.resetProductDetails(this.getProductDetails.filter( product => product.id !== id));
            
            let imageGuid = this.getPropertyselectedProduct('imageGuid')
            axios.delete(`https://aeroproductimageswebapidev.azurewebsites.net/api/BaseImages?id=${imageGuid}`)
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
        //Dynamic Components
        launchUpsert_Create()
        {
            this.setSelectedProduct({productCode: this.productCode})

            this.currentComponent = 'UpsertForm'
        },
        launchUpsert_Update(product)
        {
            //Find the selected productImage in the list of all productImages
            var productImage = this.getProductImagesList.filter(entry => entry.$id == product.id )
            
            //Set up the product props to send to the Product Form component
            this.setSelectedProduct({
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
            })
            
            this.currentComponent = 'UpsertForm'
        },
        cancelUpsert(){
            this.currentComponent = 'ProductDetails'
        },
        setupProductDetails(data) {
            let products = data.map(value => {return  {
                    id: value.$id,
                    image: value.fileLocation,
                    title: value.productCode + " - Image " +  value.imageOrder,
                    subtitle: value.fileName,
                    details: value.legendTitle,
                    status: value.imageStatus,
                }
            })
            this.resetProductDetails(products)
        }
   
    }
}
</script>

<style scoped>

</style>
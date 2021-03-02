<template>
  <div class="edit">
    <h1 class="page-title">Create and Edit Product Images</h1>
    <ProductForm
      v-bind:product="product"
      v-bind:applications="applications"
      v-bind:types="types"
      v-on:create-product="createProduct"
      v-on:update-product="updateProduct"
    />
  </div>
</template>

<script>
import ProductForm from "@/components/ProductForm.vue";
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "Edit",
  components: {
    ProductForm,
  },
  data(){
    return{
        applications: ["Flow Cytometry","N/A","Western Blot"],
        types: ["Data","Linearity"],
        baseImage: {},
        testPlaceholder: {}
    }   
  },
  created(){
  },
  methods: {
    createProduct(formValues) {
        //Set required values for the baseImage sent along with the API
        this.baseImage.applicationName = formValues.application
        this.baseImage.productCode = formValues.productCode
        this.baseImage.legend = formValues.application
        this.baseImage.legendTitle = formValues.legendTitle
        this.baseImage.imageAltText = "Image alt text for " + formValues.name
        this.baseImage.fileName = formValues.name
        this.baseImage.imageOrder = 1
        this.baseImage.imageStatus = formValues.imageStatus
        this.baseImage.imageType = formValues.type
        
        //Testing - make sure formValues are correct
        //this.testPlaceholder = formValues

        var formData = new FormData();
        formData.append("imagefile", formValues.imageFile);
        
        var encodedBaseImage = encodeURI(JSON.stringify(this.baseImage))
        console.log(encodedBaseImage)
        
        //Make Axios Call
        axios.post("https://aeroproductimageswebapidev.azurewebsites.net/api/BaseImages?productType=Antibody&baseImage=" + encodedBaseImage,
          formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        })
        .then((res) => {
          if (res.status == 200) {
            setTimeout(function () {
              Swal.fire({
                position: "top-end",
                icon: "success",
                width: 400,
                title: "Prodcut successfully created. Response code: " + res.status,
                showConfirmButton: false,
                timer: 1500,
              });
            }, 500);

            this.$router.push(-1);
          } else {
            Swal.fire({
              position: "top-end",
              icon: "error",
              title: "Something went wrong... Response code: " + res.status,
              showConfirmButton: true,
              //timer: 1500,
              width: 400,
            });
          }
        })
        .catch((err) => console.log(err));
    },
    updateProduct(formValues) {
      console.log('Update a product.' + formValues)
    },
  },
  props: {
    product: {
      default: null,
    }
  },
};
</script>
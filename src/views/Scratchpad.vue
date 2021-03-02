<template>
  <div>
    <img class="product-image" v-if="imageSrc != ''" v-bind:src="imageSrc"/>
    <FormulateInput
      type="image"
      name="headshot"
      label="Select an image to upload"
      help="Select a png, jpg or gif to upload."
      validation="mime:image/jpeg,image/png,image/gif"
      v-on:file-upload-complete="setProductImage"
    />
    <v-btn @click="uploadFile" elevation="2"> Upload</v-btn>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      imageSrc: '',
      imageFile: ''
    };
  },
  methods: {
    setProductImage(payload){
     this.imageSrc = payload.__ob__.value.previewData
     this.imageFile = payload.__ob__.value.file
    },
    uploadFile() {
      console.log("Start upload...")
      
      var formData = new FormData();
      var imagefile =  this.imageFile
      formData.append("imagefile", imagefile);
      
      axios.post('https://aeroproductimageswebapidev.azurewebsites.net/api/baseimages?productType=Antibody&baseImage=%7B%22legendTitle%22%3A%22Test%20Legeend%20Title%22%2C%0A%22imageAltText%22%3A%22Test%20Alt%20Text.%22%2C%0A%22fileName%22%3A%22Test%20File%20Name.jpg%22%2C%0A%22imageOrder%22%3A1%2C%0A%22imageStatus%22%3A%22Active%22%2C%0A%22imageType%22%3A%22Data%22%2C%0A%22productCode%22%3A%22MAB0033%22%2C%0A%22applicationName%22%3A%22Western%20Blot%22%7D', 
        formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        })
        .then((response) => console.log("response " + response))
        .catch((err) => console.log("err " + err));
    }    
  },
};
</script>
<template>
<!-- Input/Output Notes
  Input - This props takes in an object with the following properties:
            product = {
                  application: string
                  name: string
                  id: int
                  imageSrc: string
                  imageStatus: string
                  legendTitle: string
                  type: string
                }
                or
                {
                  productCode: string
                }
            applications = [id:value, id: value, id:value...]
            types = [id:value, id: value, id:value...]

  Output - Clicking Cancel will emit 'cancel-productForm'
          Clicking Submit will emit either 'create-product', 'update-product' as well as the following payload
            create-product -  { 
                                application:
                                imageFile:
                                imageStatus:
                                legendTItle:
                                name:
                                productCode:
                                type:
                              }
                              
            update-product -  { 
                                application:
                                id:
                                imageSrc:
                                imageStatus:
                                legendTItle:
                                name:
                                type:
                              }
            
  --> 
  <v-container>
      <v-row>
        <v-spacer></v-spacer>
        <v-col cols="4">
          <FormulateForm class="product-form">
            <center>
              <img class="product-image" v-if="imageSrc != ''" v-bind:src="imageSrc"/>
            </center>
            <FormulateInput
              type="image"
              name="headshot"
              label="Select an image to upload"
              help="Select a png, jpg or gif to upload."
              validation="mime:image/jpeg,image/png,image/gif"
              v-if="!editMode"
              v-on:file-upload-complete="setProductImage"
            />
            <center>
              <h4 v-if="editMode">{{this.formValues.name}}</h4>
            </center>
          </FormulateForm>          
        </v-col>
        <v-col cols="3">
          <FormulateForm class="product-form" v-model="formValues">
            <FormulateInput
              name="name"
              type="text"
              label="File Name"
              validation="required|max:100"
              v-if="!editMode"
            />
            <FormulateInput
              name="application"
              type="select"
              :options="getApplications"
              placeholder="Select an option"
              label="Application"
              validation="required"
            />
            <FormulateInput
              name="type"
              type="select"
              :options="getTypes"
              placeholder="Select an option"
              label="Type"
              validation="required"
            />
            <FormulateInput
              name="legendTitle"
              type="textarea"
              label="Legend Title"
              validation="required|max:500"
            />
            <FormulateInput
              name="imageStatus"
              :options="['Active', 'Inactive']"
              type="radio"
              label="Image Status"
              validation="required"
            />
            <div class="double-wide">
              <FormulateInput type="submit" label="Submit" @click="createOrUpdate" />
              <FormulateInput type="button" label="Cancel" @click="$emit('cancel-productForm')" />
            </div>
            <pre class="code" v-text="formValues" />
          </FormulateForm>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>
  </v-container>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  data() {
    return {
      formValues: {},
      editMode: false,
      imageSrc: '',
      imageFile:''
    };
  },
  computed: mapGetters(['getApplications','getTypes','getSelectedProduct']),
  created() {
    //Set the formvalues to the props that were passed in
    this.formValues = this.getSelectedProduct;
    
    if("imageSrc" in this.formValues){
      this.editMode = true;      
      this.imageSrc= this.formValues.imageSrc
    }    
  },
  methods: {
    createOrUpdate() {
      if (this.formValues.id == null) {
        this.formValues.imageFile = this.imageFile
        this.formValues.imageSrc = this.imageSrc
        this.$emit("create-product", this.formValues);
      } else {
        this.$emit("update-product", this.formValues);
      }
    },
    setProductImage(payload){
     this.imageSrc = payload.__ob__.value.previewData
     this.imageFile = payload.__ob__.value.file
    }
  }
};
</script>

<style scoped>
.product-form {
  padding: 2em;
  border: 1px solid #a8a8a8;
  border-radius: 0.5em;
  max-width: 500px;
  box-sizing: border-box;
}
.form-title {
  margin-top: 0;
}
.product-image{
  max-width:100%;
}
.product-form::v-deep .formulate-input .formulate-input-element {
  max-width: none;
}
@media (min-width: 420px) {
  .double-wide {
    display: flex;
  }
  .double-wide .formulate-input:first-child {
    margin-right: 0.5em;
  }
  .double-wide .formulate-input:last-child {
    margin-left: 0.5em;
  }
}
</style>
<template>
  <div class="edit">
    <h1 class="page-title">Create and Edit Products</h1>
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
      applications: [],
      types: []
    }    
  },
  created() {
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
    createProduct(formValues) {
      axios
        .post(
          "https://my-json-server.typicode.com/MilesSibley/JSON-Server/products/",
          formValues
        )
        .then((res) => {
          if (res.status == 201) {
            setTimeout(function () {
              Swal.fire({
                position: "top-end",
                icon: "success",
                width: 400,
                title:
                  "Prodcut successfully deleted. Response code: " + res.status,
                showConfirmButton: false,
                timer: 1500,
              });
            }, 500);
          } else {
            Swal.fire({
              position: "top-end",
              icon: "error",
              title: "Something went wrong... Response code: " + res.status,
              showConfirmButton: false,
              timer: 1500,
              width: 400,
            });
          }
        })
        .catch((err) => console.log(err));

        //this.$router.push("POC");
        this.$router.go(-1);
    },
    updateProduct(formValues) {
      axios
        .put(
          `https://my-json-server.typicode.com/MilesSibley/JSON-Server/products/${formValues.id}`,
          formValues
        )
        .then((res) => {
          if (res.status == 200) {
            setTimeout(function () {
              Swal.fire({
                position: "top-end",
                icon: "success",
                width: 400,
                height: 200,
                title:
                  "Prodcut successfully deleted. Response code: " + res.status,
                showConfirmButton: false,
                timer: 1500,
              });
            }, 500);

            this.$router.go(-1)
          } else {
            Swal.fire({
              position: "top-end",
              icon: "error",
              title: "Something went wrong... Response code: " + res.status,
              showConfirmButton: false,
              timer: 1500,
            });
          }
        })
        .catch((err) => console.log(err));
    },
  },
  props: {
    product: {
      default: null,
    },
  },
};
</script>
<template>
  <div class="edit">
    <h1 class="page-title">Create New Product</h1>
    <v-container>
      <v-row>
        <v-spacer></v-spacer>
        <v-col cols="8">
          <v-spacer></v-spacer>
          <ProductForm
            v-bind:product="product"
            v-on:create-product="createProduct"
            v-on:update-product="updateProduct"
          />
        </v-col>
      </v-row>
    </v-container>
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

            this.$router.push("POC");
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

            this.$router.push("POC");
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
      default: {},
    },
  },
};
</script>
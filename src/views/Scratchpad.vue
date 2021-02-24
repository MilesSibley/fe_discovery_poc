<template>
    <div class="POC">
        <h1 class="page-title">Scratchpad</h1>
        <v-app>
            <v-container class="grey lighten-5">
                <v-row>
                    <v-col v-for="n in 12" :key="n" cols="12" sm="4">
                        <v-card class="pa-2" outlined tile>
                            One of three columns
                            <v-icon large color="green darken-2">
                                mdi-domain
                            </v-icon>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-app>
        <Products v-bind:products="products"/>
    </div>
</template>

<script>
import axios from "axios";
import Products from "../components/Products.vue";
export default {
  name: "Scratchpad",
  components: {
    Products,
  },
  data() {
    return {
      products: [],
    };
  },
  created() {
    axios
      .get(
        "https://my-json-server.typicode.com/MilesSibley/JSON-Server/products"
      )
      .then((res) => (this.products = res.data))
      .catch((err) => console.log(err));
  },
};
</script>

<style scoped>
</style>
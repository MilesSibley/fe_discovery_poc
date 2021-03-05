<template>
    <v-container>
        <v-row>
          <v-col :key="product.id" v-for="product in visibleProductCards" cols="12" sm="3">
              <ProductCard :product="product" v-on:del-product="$emit('del-product', product.id)" v-on:edit-product="$emit('edit-product', product)"/>
          </v-col>
        </v-row>
        <v-row>
          <v-spacer></v-spacer>
          <v-col cols="12" sm="3">
             <v-pagination
                  v-if="Math.ceil(this.getFilteredProductDetails.length / this.perPage) > 1"
                  v-model="currentPage"
                  color="#1161A0"
                  :length="Math.ceil(this.getFilteredProductDetails.length / this.perPage)"
                  :total-visible="6"
                  v-on:input="updatePage"
                ></v-pagination>
              </v-col>
              <v-spacer></v-spacer>
        </v-row>
    </v-container>
</template>

<script>
import ProductCard from './ProductCard.vue';
import { mapGetters } from 'vuex';

export default {
  name: "Products",
  components: {
    ProductCard
  },
  computed: mapGetters([
    'getFilteredProductDetails'
  ]),
  data(){
    return{
      currentPage: 1,
      perPage: 8,
      visibleProductCards: this.getFilteredProductDetails
    }
  },
  beforeMount: function() {
    this.updateVisibleProductCards();
  },
  methods: {
    updateVisibleProductCards(){
      this.visibleProductCards = this.getFilteredProductDetails.slice((this.currentPage-1) * this.perPage, ((this.currentPage-1) * this.perPage) + this.perPage);
    },
    updatePage(pageNumber){
      this.currentPage = pageNumber;
      this.updateVisibleProductCards();
    }
  }
}
</script>

<style scoped>

</style>

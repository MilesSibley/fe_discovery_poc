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
                  v-model="currentPage"
                  color="#1161A0"
                  :length="Math.ceil(this.products.length / this.pageSize)"
                  v-on:input="updatePage"
                ></v-pagination>
              </v-col>
              <v-spacer></v-spacer>
        </v-row>
    </v-container>
</template>

<script>
import ProductCard from './ProductCard.vue';

export default {
    name: "ScratchPad Component",
    components: {
        ProductCard
    },
    data(){
      return{
        currentPage: 1,
        pageSize: 8,
        visibleProductCards: []
      }
    },
    beforeMount: function() {
      this.updateVisibleProductCards();
    },
    methods: {
      updateVisibleProductCards(){
        this.visibleProductCards = this.products.slice((this.currentPage-1) * this.pageSize, ((this.currentPage-1) * this.pageSize) + this.pageSize);

      },
      updatePage(pageNumber){
        this.currentPage = pageNumber;
        this.updateVisibleProductCards();
      }
    },
    props: ["products"]
}
</script>
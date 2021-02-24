<template>
    
    <v-card class="mx-auto" max-width="344">
        <v-img v-bind:src="product.image" height="200px"></v-img>
        <v-card-title>
            {{ product.name }}
        </v-card-title>
        <v-card-subtitle>
            {{ product.fileName }}
        </v-card-subtitle>
        <v-card-actions>
            <v-btn text> View Details </v-btn>
            <v-btn icon @click="show = !show">
                <v-icon>{{ show ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
            <v-btn icon v-on:click="$emit('edit-product', product.id)"> 
                <v-icon>{{ "mdi-pencil" }}</v-icon>
            </v-btn>
            <v-btn icon v-on:click="$emit('del-product', product.id)">
                <v-icon>{{ "mdi-delete" }}</v-icon>
            </v-btn>
        </v-card-actions>
        <v-expand-transition>
            <div v-show="show">
                <v-divider></v-divider>
                <v-card-text>
                    {{product.legendTitle}}
                </v-card-text>
            </div>
        </v-expand-transition>
    </v-card>
</template>

<script>
export default {
  name: "ProductCard",
  data: () => ({
    show: false,
  }),
  props: ["product"],
};
</script>

<style scoped>
</style>
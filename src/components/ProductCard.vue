<template>
    <v-card class="mx-auto" max-width="344" min-width="250">
        <v-img v-bind:src="product.image" height="200px"></v-img>
        <v-card-title>
            <v-icon class="active status-icon" v-if="product.status == 'Active'">{{ "mdi-check" }}</v-icon>
            <v-icon class="inactive status-icon" v-if="product.status == 'Inactive'">{{ "mdi-close-box-outline"}}</v-icon>
            {{ product.title }}
        </v-card-title>
        <v-card-subtitle>
            {{ product.subtitle }}
        </v-card-subtitle>
        <v-card-actions>
            <v-btn text> View Details </v-btn>
            <v-btn icon @click="showDetails = !showDetails">
                <v-icon>{{ showDetails ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
            <v-btn icon v-on:click="$emit('edit-product', product.id)"> 
                <v-icon class="action-icon">{{ "mdi-pencil" }}</v-icon>
            </v-btn>
            <v-btn icon v-on:click="$emit('del-product', product.id)">
                <v-icon class="action-icon">{{ "mdi-delete" }}</v-icon>
            </v-btn>
        </v-card-actions>
        <v-expand-transition>
            <div v-show="showDetails">
                <v-divider></v-divider>
                <v-card-text>
                    {{product.details}}
                </v-card-text>
            </div>
        </v-expand-transition>
    </v-card>
</template>

<script>
export default {
  name: "ProductCard",
  data: () => ({
    showDetails: false,
  }),
  props: ["product"],
};
</script>

<style scoped>
i.v-icon.v-icon.action-icon:hover{
  color: #1161A0;
}

i.v-icon.v-icon.status-icon{
    padding-right: 5px;
}

i.v-icon.v-icon.status-icon.active{
  color: green;
} 
i.v-icon.v-icon.status-icon.inactive{
  color: darkred;
}
</style>
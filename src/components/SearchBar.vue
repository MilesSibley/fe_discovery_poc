<template>
<span class="search-bar">
    <!-- <input type="text" class="search-term" placeholder="Search" v-model="searchValue" v-on:input="$emit('search',searchValue)"> -->
      <v-text-field hide-details prepend-icon="mdi-magnify" single-line placeholder="Search" v-model="searchValue" v-on:input="$emit('search',searchValue)">
      </v-text-field>
</span>
</template>

<script>
export default {
  data() {
    return {
      searchValue: "",
    };
  },
};
</script>

<style scoped>
.v-input{
  padding-top:0px;
}
</style>
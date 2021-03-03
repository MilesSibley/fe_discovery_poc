<template>
<span class="search-bar">
      <v-text-field hide-details prepend-icon="mdi-magnify" single-line placeholder="Search" v-model="searchValue" v-on:keyup.enter="$emit('search-onchange',searchValue)" v-on:input="$emit('search-typeahead',searchValue)">
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
<template>
   <div id="app">
     <Header />
     <router-view/>
  </div>
</template>

<script>
import Header from '../src/components/layout/Header.vue'

export default {
  name: 'App',
  components: {
    Header
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.page-title{
  text-align: center;
}
</style>

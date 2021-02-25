<template>
    <input type="text" v-model="searchValue" placeholder="Search" v-on:change="$emit('filter', searchValue)">
</template>

<script>
export default {
    data(){
        return{
            searchValue:''
        }
    }
}
</script>

<style scoped>

</style>
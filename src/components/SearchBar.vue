<template>
<span>
    <input type="text" class="searchTerm" placeholder="Search">
</span>
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
@import url(https://fonts.googleapis.com/css?family=Open+Sans);


.searchTerm {
  border: 1px solid black;
  padding: 5px;
  height: 24px;
  border-radius: 5px;
  outline: none;
  color: darkgray;
}

.searchTerm:focus{
  color: lightgray;
}

/*Resize the wrap to see the search bar change!*/
.wrap{
  width: 30%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
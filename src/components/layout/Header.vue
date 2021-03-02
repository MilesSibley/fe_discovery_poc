<template>
    <header class="header">
        <h1>Proof of Concept</h1>
        <div id="nav">
            <router-link to="/POC">Original POC</router-link> |
            <router-link to="/ImageUploader">Image Uploader</router-link> |
            <router-link to="/Scratchpad">Scratchpad</router-link>
        </div>
    </header>
</template>

<script>
export default {
    name: "Header"
}
</script>

<style scoped>
    .logo{
        max-height: 100px;
        float:left;
    }
    .header{
        background: #1161A0;
        color: #fff;
        text-align: center;
        padding: 10px;
    }

    .header a{
        color: #fff;
        padding-right: 5px;
        text-decoration: none;
    }
</style>
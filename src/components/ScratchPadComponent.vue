<template>
  <div>
    <h1>{{title}}</h1>
    <br/>
    <br/>
    Count: {{count}}
    <br/>
    <button @click="count++">Plus One</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: 'ScratchPad',
      count: 0
    };
  },
  methods: {
    
  },
};
</script>
<template>
  <keep-alive>
    <ScratchPadComponent/>
  </keep-alive>
</template>

<script>
import ScratchPadComponent from '../components/ScratchPadComponent.vue'
export default {
  components: { ScratchPadComponent },
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
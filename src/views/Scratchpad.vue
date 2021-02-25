<template>
  <button @click="showAlert">Hello world</button>
</template>

<script>
import Swal from "sweetalert2";
export default {
  methods: {
    showAlert() {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Your work has been saved",
        showConfirmButton: false,
        timer: 1500,
      });
    },
  },
};
</script>
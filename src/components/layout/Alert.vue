<template>
    <div></div>
</template>

<script>
import Swal from "sweetalert2";
export default {
    methods: {
        displayResult(alertType,alertTitle,alertText){
            Swal.fire({
                position: "top-end",
                icon: alertType,
                width: 350,
                title: alertTitle,
                text: alertText,
                showConfirmButton: false,
                timer:1500
            });
        }
    }
};
</script>
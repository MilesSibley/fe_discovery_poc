<template>
  <FormulateForm
    class="product-form"
    v-model="formValues"
  >
    <FormulateInput
      name="name"
      type="text"
      label="File Name"
      validation="required"
    />
    <FormulateInput
    name="application"
    type="select"
    :options="applications"
    placeholder="Select an option"
    label="Application"
    validation="required"
    />
    <FormulateInput
      name="type"
      type="select"
      :options="types"
      placeholder="Select an option"
      label="Type"
      validation="required"
    />
    <FormulateInput
    name="legendTitle"
    type="textarea"
    label="Legend Title"
    validation="required"
    />
    <FormulateInput
    name="imageStatus"
    :options="['Active','Inactive']"
    type="radio"
    label="Image Status"
    validation="required"
    />
    <div class="double-wide">
        <FormulateInput
        type="submit"
        label="Submit"
        v-on:click="$emit('create-product', formValues)"
        />
        <FormulateInput
        type="button"
        label="Cancel"
        @click="$router.push('POC')"
        />        
    </div>
    <pre
      class="code"
      v-text="formValues"
    />
  </FormulateForm>
</template>

<script>
import axios from 'axios';

export default {
  data () {
    return {
      formValues: {},
      applications:[],
      types:[]
    }
  },
    created(){
        axios.get('https://my-json-server.typicode.com/MilesSibley/JSON-Server/application')
            .then((response) => {
                var data = response.data;
                for(var i=0; i<data.length; i++)
                {
                    this.applications.push(data[i].name)
                }
            })
            .catch(err => console.log(err));
        axios.get('https://my-json-server.typicode.com/MilesSibley/JSON-Server/type')
            .then((response) => {
                var data = response.data;
                for(var i=0; i<data.length; i++)
                {
                    this.types.push(data[i].name)
                }
            })
            .catch(err => console.log(err));
    },
}
</script>

<style scoped>
.product-form {
  padding: 2em;
  border: 1px solid #a8a8a8;
  border-radius: .5em;
  max-width: 500px;
  box-sizing: border-box;
}
.form-title {
  margin-top: 0;
}
.product-form::v-deep .formulate-input .formulate-input-element {
  max-width: none;
}
@media (min-width: 420px) {
  .double-wide {
    display: flex;
  }
  .double-wide .formulate-input:first-child {
    margin-right: .5em;
  }
  .double-wide .formulate-input:last-child {
    margin-left: .5em;
  }
}
</style>
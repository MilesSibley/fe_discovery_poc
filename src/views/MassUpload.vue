<template>
    <div>
        <v-app>
            <FormulateInput
                type="file"
                name="file"
                aligh
                label="Select your documents to upload"
                help="Select a .csv file to upload"
                validation="mime:application/vnd.ms-excel"
                v-on:file-upload-complete="parseFile"
            />
            <v-data-table
                :headers="headers"
                :items="products"
                :items-per-page="25"
                class="elevation-1">
                <template v-slot:item.uploadStatus ="{ item }">
                    <v-icon class="active status-icon" v-if="item.uploadStatus== 'success'">{{ "mdi-check" }}</v-icon>
                    <v-icon class="inactive status-icon" v-if="item.uploadStatus== 'failure'">{{ "mdi-close-box-outline"}}</v-icon>
                </template>
            </v-data-table>
            <FormulateInput type="submit" label="Upload" @click="uploadProducts" />
        </v-app>
    </div>
</template>
<script>
    import { VueCsvImport } from 'vue-csv-import';
    import axios from 'axios';

    export default {
        data () {
            return {
                components: { VueCsvImport },
                headers: [
                    {
                        text: 'Category Number',
                        value: 'catnum',
                    },
                    { text: 'Description', value: 'longDescription' },
                    { text: 'Status', value: 'status' },
                    { text: 'Price (USD)', value: 'usd' },
                    { text: 'Price (GBP)', value: 'gbp' },
                    { text: 'Price (EURO)', value: 'euro' },
                    { text: 'Upload Status', value: 'uploadStatus' },
                    { text: 'Notes', value: 'uploadNotes' },
                ],
                products: [],
            }
        },
        methods: {
            parseFile(payload){
                this.papaParse(payload,this.updateProductsArray)
            },
            papaParse(payload, callBack){
                this.$papa.parse(payload.file,{
                    header: true,
                    complete: function(results) {
                        callBack(results.data)
                    }
                })       
            },
            updateProductsArray(data){
                //Default the uploadStatus and uploadNotes to empty strings
                data.map(product => {
                    product.uploadStatus = ''
                    product.uploadNotes = ''
                })

                this.products = data               
            },
            uploadProducts(){
                //For each product, validate the fields, call the API, and update the status
                this.products.map(product => {
                    //validate fields
                    
                    //Set up API arguements
                    let payload = {
                        catnum: product.catnum,
                        naPricing: product.usd,
                        euroPricing: product.euro,
                        gbpPricing: product.gbp,
                        description: product.longDescription,
                        productStatus: product.status,
                    }

                    //call API
                    axios.post("http://localhost:3000/products",payload)
                    .then((res) => {
                        if (res.status == 201) {
                            product.uploadStatus = 'success'
                        } else {
                            product.uploadStatus = 'failure'
                        }
                    })
                    .catch((err) => console.log(err));
                    //Update status and Notes
                    //product.uploadStatus = 'success'
                })

            }
        }
    }
</script>
<style scoped>
    i.v-icon.status-icon.active{
    color: green;
    } 
</style>
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
                    <v-icon class="active status-icon" v-if="item.uploadStatus== 'true'">{{ "mdi-check" }}</v-icon>
                </template>
            </v-data-table>
        </v-app>
    </div>
</template>
<script>
    import { VueCsvImport } from 'vue-csv-import';

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
                this.products = data

            }
        }
    }
</script>
<style scoped>
    i.v-icon.status-icon.active{
    color: green;
    } 
</style>
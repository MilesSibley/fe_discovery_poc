<template>
    <div>
        <v-app>
            <v-container>
                <v-row>
                    <v-col cols="6">
                        <h1 >Mass Upload</h1>
                        
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <FormulateInput
                            type="file"
                            name="file"
                            aligh
                            label="Select your data file"
                            help="Select a .csv file to upload"
                            validation="mime:application/vnd.ms-excel"
                            v-on:file-upload-complete="parseFile"
                        />
                    </v-col>
                </v-row>
                <v-row v-if="products.length > 0" >
                    <v-col cols="3">
                        <div class="double-wide">
                            <v-btn class="mr-4" color="warning" @click="validateDatatable">Validate Data</v-btn>
                            <v-btn class="mr-4" color="success" :disabled="apiIsOffline" @click="uploadProducts">Upload Data</v-btn>
                        </div>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" v-if="products.length > 0" >
                        <v-form ref="form">
                            <v-data-table
                                :headers="headers"
                                :items="products"
                                :items-per-page="10"
                                class="elevation-1"
                            >
                            
                                <template v-slot:[`item.catnum`] ="{ item }">
                                    <v-text-field
                                        ref="catnum"
                                        v-model="item.catnum"
                                        :rules = "requiredField"
                                        
                                    >
                                    </v-text-field>
                                </template>
                                <template v-slot:[`item.longDescription`] ="{ item }">
                                    <v-text-field
                                        ref="longDescription"
                                        v-model="item.longDescription"
                                        :rules = "[...requiredField, ...maxLength]"
                                    >
                                    </v-text-field>
                                </template>
                                <template v-slot:[`item.status`] ="{ item }">
                                    <v-select
                                        ref="status"
                                        v-model="item.status"
                                        :rules = "requiredField"
                                        :items="['Active','Development','Discontinued']"
                                    >
                                    </v-select>
                                </template>
                                <template v-slot:[`item.usd`] ="{ item }">
                                    <v-text-field
                                        ref="usd"
                                        v-model="item.usd"
                                        :rules = "requiredField"
                                        prefix="$"
                                    >
                                    </v-text-field>
                                </template>
                                <template v-slot:[`item.gbp`] ="{ item }">
                                    <v-text-field
                                        ref="gbp"
                                        v-model="item.gbp"
                                        :rules = "requiredField"
                                        prefix="$"
                                    >
                                    </v-text-field>
                                </template>
                                <template v-slot:[`item.euro`] ="{ item }">
                                    <v-text-field
                                        ref="euro"
                                        v-model="item.euro"
                                        :rules = "requiredField"
                                        prefix="$"
                                    >
                                    </v-text-field>
                                </template>
                                <template v-slot:[`item.uploadStatus`] ="{ item }">
                                    <v-icon ref="uploadStatus" class="active status-icon" v-if="item.uploadStatus == 'success'">{{ "mdi-check" }}</v-icon>
                                    <v-icon class="inactive status-icon" v-if="item.uploadStatus == 'failure'">{{ "mdi-close-box-outline"}}</v-icon>
                                </template>
                            </v-data-table>
                        </v-form>
                    </v-col>
                </v-row>
                <v-row>
                    <v-spacer></v-spacer>
                    <v-col cols="6">
                        <h3 v-if=apiIsOffline style="color:red">API is currently offline.</h3>
                    </v-col>
                </v-row>
            </v-container>
        </v-app>
    </div>
</template>
<script>
    import { VueCsvImport } from 'vue-csv-import';
    import axios from 'axios';

    export default {
        created(){
            axios.get("http://localhost:3000/products")
                .then((res) => {
                    if (res.status == 200) {
                        this.apiIsOffline = false
                    }
                })
                .catch((err) => console.log(err));
        },
        data () {
            return {
                apiIsOffline: true,
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
                products: [
                    // //Test Data
                    // {
                    //     catnum: 'RDP-343-025',
                    //     longDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus egestas gravida eros, volutpat pretium arcu accumsan at. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus egestas gravida eros, volutpat pretium arcu accumsan at. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus egestas gravida eros, volutpat pretium arcu accumsan at.',
                    //     status: 'Active',
                    //     usd:'',
                    //     gbp:'100',
                    //     euro: 110
                    // },
                    // {
                    //     catnum: 'RDP-ff343-025',
                    //     longDescription: 'Lorem ipsum.',
                    //     status: 'Active',
                    //     usd: '100',
                    //     gbp: '',
                    //     euro: '100'
                    // }
                ],
                requiredField: [
                    value => !!value || 'This is a required field.',
                ],
                maxLength: [
                    value => (value.length < 65) || 'Max 65 characters',
                ]
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
                    this.updateUploadStatus(product, '','')
                })

                this.products = data
            },
            uploadProducts(){
                //validate the form to give user some feed back
                this.validateDatatable()

                //For each product, validate the fields, call the API, and update the status
                this.products.map(product => {
                    //If we have already successfully uploaded the product, skip it.
                    if(product.uploadStatus != 'success')
                    {
                        //Validate the data being uploaded 
                        if(this.validateProduct(product)){
                            //Set up API arguements
                            let payload = {
                                catnum: product.catnum,
                                description: product.longDescription,
                                productStatus: product.status,
                                naPricing: product.usd,
                                euroPricing: product.euro,
                                gbpPricing: product.gbp                            
                            }
                            //call API
                            axios.post("http://localhost:3000/products",payload)
                            .then((res) => {
                                if (res.status == 201) {
                                    this.updateUploadStatus(product, 'success','')
                                } else {
                                    this.updateUploadStatus(product, 'failure','')
                                }
                            })
                            .catch((err) => {
                                console.log(err)
                                this.updateUploadStatus(product, 'failure','API call hit an error.')
                            });
                        }
                        else{

                            this.updateUploadStatus(product, 'failure','Entry did not pass validation.')
                        }
                    }
                    
                })
            },
            updateUploadStatus(product, status, notes)
            {
                product.uploadStatus = status
                product.uploadNotes = notes
            },
            validateDatatable(){
                this.$refs.form.validate()
            },
            validateProduct(product){
                let isValid = true
                
                if(product.catnum == "")
                    isValid = false
                if(product.longDescription == "")
                    isValid = false
                if(product.status == "")
                    isValid = false
                if(product.usd == "")
                    isValid = false
                if(product.gbp == "")
                    isValid = false
                if(product.euro == "")
                    isValid = false
                               
                if( product.longDescription.length > 65 ){
                    console.log(product.longDescription + "is too long")
                    isValid = false
                }
                
                return isValid                
            }
        }
    }
</script>
<style scoped>
    i.v-icon.status-icon.active{
        color: green;
    } 
    i.v-icon.status-icon.inactive{
        color: red;
    }
    .double-wide {
        display: flex;
    }
    .double-wide .formulate-input:first-child {
        margin-right: 0.5em;
    }
    .double-wide .formulate-input:last-child {
        margin-left: 0.5em;
    }
</style>
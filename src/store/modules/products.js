const state = {
    //Product Cards
    productDetails:[],
    filteredProductDetails:[],
    
    //Upsert Form
    applications: [],
    types: [],
    selectedProduct:{},
    
    //Image Uploader
    productImagesList:[]
};

const getters = {
    getProductDetails: (state) => state.productDetails,
    getFilteredProductDetails: (state) => state.filteredProductDetails,
    getApplications: (state) => state.applications,
    getTypes: (state) => state.types,
    getSelectedProduct: (state) => state.selectedProduct,
    getPropertySelectedProduct:(state) => (key) =>  {
        return state.selectedProduct[key]
    },
    getProductImagesList: (state) => state.productImagesList
};

const actions = {
    setApplications: (context, payload) => (
        context.commit('setApplications',payload)
    ),
    setTypes: (context, payload) => (
        context.commit('setTypes',payload)
    ),
    resetProductDetails: (context, payload) => {
        context.commit('setProductDetails',payload)
        context.commit('setFilteredProductDetails',payload)
    }
};

const mutations = {
    //Setters for the various states
    setProductDetails: (state, details) => (state.productDetails = details),
    setFilteredProductDetails: (state, details) => (state.filteredProductDetails = details),
    setApplications: (state, details) => (state.applications = details),
    setTypes: (state, details) => (state.types = details),
    setSelectedProduct: (state, details) => (state.selectedProduct = details),
    setProductImagesList: (state, details) => (state.productImagesList = details),

    //Add indivividual properties to state arrays
    addToApplications: (state, payload) => (state.applications.push(payload)),
    addToProductDetails: (state, payload) => (state.productDetails.push(payload)),
    addToSelectedProduct: (state, payload) => (
        state.selectedProduct[payload.key] = payload.value
    ),
    addToTypes: (state, payload) => (state.types.push(payload)),
    
    
};

export default{
    state,
    getters,
    actions,
    mutations
};
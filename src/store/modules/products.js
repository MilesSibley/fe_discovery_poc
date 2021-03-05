const state = {
    applications: [],
    filteredProductDetails:[],
    productDetails:[],
    selectedProduct:{},
    types: [],

    testvalue: 3
};

const getters = {
    getApplications: (state) => state.applications,
    getFilteredProductDetails: (state) => state.filteredProductDetails,
    getProductDetails: (state) => state.productDetails,
    getSelectedProduct: (state) => state.selectedProduct,
    getTypes: (state) => state.types,

    getPropertySelectedProduct:(state) => (key) =>  {
        return state.selectedProduct[key]
    }
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
    setApplications: (state, details) => (state.applications = details),
    setFilteredProductDetails: (state, details) => (state.filteredProductDetails = details),
    setProductDetails: (state, details) => (state.productDetails = details),
    setSelectedProduct: (state, details) => (state.selectedProduct = details),
    setTypes: (state, details) => (state.types = details),
    
    //Add indivividual properties to state arrays and objects
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
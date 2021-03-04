const state = {
    testValue: 3000,
    productDetails:[],
    filteredProductDetails:[],
    selectedProduct:{}

};

const getters = {
    getTestValue: (state) => state.testValue,
    getProductDetails: (state) => state.productDetails,
    getFilteredProductDetails: (state) => state.filteredProductDetails,
    getSelectedProduct: (state) => state.selectedProduct

};

const actions = {};

const mutations = {
    setProductDetails: (state, details) => (state.productDetails = details),
    addToProductDetails: (state, productDetailsObject) => (state.productDetails.push(productDetailsObject)),
    setFilteredProductDetails: (state, details) => (state.filteredProductDetails = details),
    setSelectedProduct: (state, details) => (state.selectedProduct = details),
    addValueToSelectedProduct: (state, payload) => (console.log(payload.key),console.log(payload.value),state.selectedProduct[payload.key] = payload.value)
};


export default{
    state,
    getters,
    actions,
    mutations
};
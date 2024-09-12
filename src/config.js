const LOCALSTORAGE_KEY = 'hardwareStoreAppUser';
const HTTPS_API_URL = 'https://localhost:7042'
const HTTPS_API_TOKEN_URL = `${HTTPS_API_URL}/api/token`;
const HTTPS_API_USER_URL = `${HTTPS_API_URL}/api/users`;
const HTTPS_API_PRODUCT_URL = `${HTTPS_API_URL}/api/products`;
const HTTPS_API_PRODUCT_TYPE_URL = `${HTTPS_API_URL}/api/product_types`;
const HTTPS_API_ADDRESS_URL = `${HTTPS_API_URL}/api/address`;
const HTTPS_API_SHIPPING_METHOD_URL = `${HTTPS_API_URL}/api/shipping_method`;
const HTTPS_API_SHOPPING_CART_URL = `${HTTPS_API_URL}/api/shopping_cart`;
const HTTPS_API_ORDER_URL = `${HTTPS_API_URL}/api/order`;


export default {
    localStorageKey: LOCALSTORAGE_KEY,
    apiURL : HTTPS_API_URL,
    tokenApiURL: HTTPS_API_TOKEN_URL,
    userApiURL: HTTPS_API_USER_URL,
    productApiURL: HTTPS_API_PRODUCT_URL,
    productTypeApiURL: HTTPS_API_PRODUCT_TYPE_URL,
    addressApiURL: HTTPS_API_ADDRESS_URL,
    shippingMethodApiURL: HTTPS_API_SHIPPING_METHOD_URL,
    shoppingCartApiURL: HTTPS_API_SHOPPING_CART_URL,
    orderApiURL: HTTPS_API_ORDER_URL
}
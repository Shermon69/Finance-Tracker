const  axios = require("axios");
 //free api key - fe90ce25de55c0ded93e82e6

 const EXCHANGE_API_KEY = process.env.EXCHANGE_API_KEY;
 const BASE_CURRENCY = "LKR";  //Default base currency

 const getExchangeRates = async(fromCurrency) => {
    try {
        const response = await axios.get(`https://v6.exchangerate-api.com/v6/${EXCHANGE_API_KEY}/latest/${BASE_CURRENCY}`);
        const rates = response.data.conversion_rates;
        return rates[fromCurrency.toUpperCase()] || 1;  //Return rate or 1 if not found
        
    } catch (error) {
        console.error("Error fetching exchange rates", error.message);
        return 1;  //Default 1 (not converted)
    }
 };

 module.exports = { getExchangeRates , BASE_CURRENCY};
 
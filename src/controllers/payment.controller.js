import axios from "axios";
import { HOST, PAYPAL_API, PAYPAL_API_CLIENT, PAYPAL_API_SECRET } from "../config.js";


export const createOrder = async (req, res) => {

    const order = {
        intent: 'CAPTURE',
        purchase_units: [{
            description: 'Compra de productos',
            amount: {
                currency_code: 'USD',
                value: 100.00
            }
        }],
        application_context: {
            brand_name: 'Mi tienda',
            landing_page: 'NO_PREFERENCE',
            user_action: 'PAY_NOW',
            return_url: `${HOST}/api/capture-order`,
            cancel_url: `${HOST}/api/cancel-order`
        }
    }

    try {
        const params = new URLSearchParams();
        params.append('grant_type', 'client_credentials');
        const { data: { access_token } } = await axios.post(`${PAYPAL_API}/v1/oauth2/token`, params, {
            auth: {
                username: PAYPAL_API_CLIENT,
                password: PAYPAL_API_SECRET
            }
        });

        const response = await axios.post(`${PAYPAL_API}/v2/checkout/orders`, order, {
            headers: {
                'Authorization': `Bearer ${access_token}`,
            }
        });
        res.json(response.data.links[1]);
    } catch (e) {
        console.log(e);
    }
};
export const captureOrder = async (req, res) => {
    const { token, orderID } = req.query;
    const response = await axios.post(`${PAYPAL_API}/v2/checkout/orders/${token}/capture`, {}, {
        auth: {
            username: PAYPAL_API_CLIENT,
            password: PAYPAL_API_SECRET
        }
    });

    res.redirect('/payed.html');
};
export const cancelOrder = async (req, res) => {
    res.redirect('/')
};

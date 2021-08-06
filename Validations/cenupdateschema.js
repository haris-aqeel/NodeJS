
const schemaPaymentEOI = {
    id: {
        type: "string",
        optional: false,
        numeric: true
    },

    pay_id: {
        type: "string",
        optional: false,
        min: 3

    }
}
const schemaPaymentEOI = {
    id: {
        type: "string",
        optional: false,
        numeric: true
    },

    payment_id: {
        type: "string",
        optional: false,
        min: 3

    }
}
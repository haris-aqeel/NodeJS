

const schemaDonationForm = {
    name: {
        type: "string",
        optional: false,
        min: 3,
        pattern: /^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/
           
    },
    phone: {
        type: "string",
        optional: false,
        min: 10,
        max: 10,
        numeric: true
    },
    email: {
        type: "email",
        optional: false,
    },
    address: {
        type: "string",
        optional: false,
    },
    amount: {
        type: "string",
        optional: false,
    },
    payment_id: {
        type: "string",
        optional: false,
    },
    website: {
        type: "string",
        optional: false,
    }
}


module.exports = schemaDonationForm; 
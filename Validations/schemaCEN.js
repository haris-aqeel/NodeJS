const schemaCEN = {
    login_mail: {
        type: "string",
        optional: false
    },
    login_pass: {
        type: "string",
        optional: false
    },
    NameofEntity: {
        type: "string",
        optional: false,
        min: 3,
        pattern: /^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/
    },
    State: {
        type: "string",
        optional: false,
        numeric: true,
    },
    Address: {
        type: "string",
        optional: false,
        min: 3,
    },
    Pincode: {
        type: "string",
        optional: false,
        alphanum: true,
        min: 3,
    },
    NameofCenterManager: {
        type: "string",
        optional: false,
        min: 3,
        pattern: /^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/
    },
    ContactofCenterManager: {
        type: "string",
        optional: false,
        min: 10,
        max: 10,
        numeric: true
    },
    EmailofCenterManager: {
        type: "email",
        optional: false,
    },
    AppID: {
        type: "string",
        optional: false,
        min: 3
    },
    REF: {
        type: "string",
        optional: false,
        min: 3
    },
    IPREF: {
        type: "string",
        optional: false,
        min: 3
    },
    partner: {
        type: "string",
        optional: false,
        min: 3,
        pattern: /^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/
    },
    COURSE: {
        type: "string",
        optional: false
    }
}
module.exports = schemaCEN;
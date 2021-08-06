

const schemaEOI = {
    NameofEntity: {
        type: "string",
        optional: false,
        min: 3,
        pattern: /^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/
    },
    TypeofEntity: {
        type: "string",
        optional: false,
        min: 3,
        pattern: /^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/
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
    Pan: {
        type: "string",
        optional: false,
        min: 3,
       
    },
    NofStaff: {
        type: "string",
        optional: false,
        numeric: false
    },
    NameofAuthorisedSig: {
        type: "string",
        optional: false,
        min: 3,
        pattern: /^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/
    },
    ContactofAuthorisedSig: {
        type: "string",
        optional: false,
        min: 10,
        max: 10,
        numeric: true
    },
    EmailofAuthorisedSig: {
        type: "email",
        optional: false,
    },
    YearsofexpinTr: {
        type: "string",
        optional: false,
        numeric: false
    },
    Turnover: {
        type: "string",
        optional: false,
        numeric: true,
    },

    State: {
        type: "string",
        optional: false,
        numeric: true,
        
    },
    NoofEntityundernetwork: {
        type: "string",
        optional: false,
        numeric: false,
    },
    ApplicationID: {
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

}


module.exports = schemaEOI;
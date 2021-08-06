

const schemaJobForm = {
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

    jobId: {
        type: "string",
        optional: false,
        numeric: true
    },

    image : {
        optional: false,
        type: "string"

    }

}


module.exports = schemaJobForm;
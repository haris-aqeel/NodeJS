const schemaCreateJobForm = {
    PostName: {
        type: "string",
        optional: false,
        min: 3,
        pattern: /^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/
    },
    
    file : {
        optional: false,
        type: "string"
    },
    
    date: {
        type: "date",
        optional: "false"
    },

    website: {
        type: "string",
        optional: false,
    }

}


module.exports = schemaCreateJobForm;
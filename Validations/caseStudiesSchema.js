 const caseStudiesSchema = {
   
    heading : {
        optional: false,
        type: "string",
    },

    description : {
        optional: false,
        type: "string",
    },
    
    image: {
        optional: true,
        type: "string"
    },

    date: {
        optional: false,
        type: "string",
        min: 3
    }
}


module.exports = caseStudiesSchema;
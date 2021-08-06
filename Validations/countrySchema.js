

 const countrySchema = {
   
    countryname : {
        optional: false,
        type: "string",
    },

    intro : {
        optional: false,
        type: "string",
    },
    
    livlihood : {
        optional: false,
        type: "string",
    },

    healthcare : {
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


module.exports = countrySchema;
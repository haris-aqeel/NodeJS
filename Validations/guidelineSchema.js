

const guidelineSchema = {
   
    subject : {
        optional: false,
        type: "string",
    },

    country : {
        optional: false,
        type: "string",
    },
    

    file: {
        optional: true,
        type: "string"
    },

    date: {
        optional: false,
        type: "string",
        min: 3
    }
}


module.exports = guidelineSchema 
const batchesSchema = {
   
    CENID : {
        optional: false,
        type: "string",
    },

    courseName : {
        optional: false,
        type: "string",
    },
    
    trainerName: {
        optional: true,
        type: "string"
    },

    trainerEmail: {
        optional: true,
        type: "string"
    },

    trainerPhone: {
        optional: true,
        type: "string"
    },

    date: {
        optional: false,
        type: "string",
        min: 3
    }
}


module.exports = batchesSchema;
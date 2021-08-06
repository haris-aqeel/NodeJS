const studentsSchema = {
   
    batchID : {
        optional: false,
        type: "string",
    },

    studentname : {
        optional: false,
        type: "string",
    },
    
    adharNo: {
        optional: false,
        type: "string"
    },

    phoneNo: {
        optional: false,
        type: "string"
    }
}


module.exports = studentsSchema;
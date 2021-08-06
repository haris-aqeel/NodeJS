const schemaCourse = {
    coursename: {
        type: "string",
        optional: false,
    },

    file_1: {
        type: "string",
        optional: false,
    },

    file_2: {
        type: "string",
        optional: false,
    },

    date: {
        type: "string",
        optional: false,
    },

    domainid: {
        type: "string",
        numeric: true
    }

}


module.exports = schemaCourse;
const mysqlConnection = require('../db/connection');
const CONFIG = require('../config/conf');
const Validator = require("fastest-validator");
const v = new Validator();
const schemaStudents = require('../Validations/studentsSchema');



exports.createstudent = function(req, res){
        const id = req.query.id;
        mysqlConnection.query(`SELECT * FROM ${CONFIG.tb_batches} where id=?`, [id], (err, data, fields) => {
            if (!err)
                res.render('student-create.ejs', {title: 'Add Student', id: req.query.id, cookies: req.cookies})
            else
                res.status(424).json({ status: false, "message": err });
        });

}



exports.poststudent = function(req, res){


    const studentObj = {
        batchID: req.query.id,
        studentname: req.body.studentname,
        adharNo: req.body.adharNo,
        phoneNo: req.body.phoneNo
    };

    
    if ((v.validate(studentObj, schemaStudents)) === true) {

       var sql = `INSERT INTO ${CONFIG.tb_students} (batchID, studentname, adharNo, phoneNo) VALUES ?`;

       var values = [[studentObj.batchID, studentObj.studentname, studentObj.adharNo, studentObj.phoneNo ]];

       mysqlConnection.query(sql, [values], function (err, result) {
           if (err);
           res.redirect(`/studentslisting?id=${studentObj.batchID}`)
        });
    }else{
        res.status(424).json({ status: false, "message": err });
    }
}



exports.studentlisting = function(req, res){

    mysqlConnection.query(`SELECT * FROM ${CONFIG.tb_students} WHERE batchID=${req.query.id}`, (err, data, fields) => {
        if (!err)
            res.render('student-listing.ejs', { title: 'Student Listing', studentData: data, cookies: req.cookies})
        else
            res.status(424).json({ status: false, "message": err });
    })
}





exports.deleteStudent = function (req, res) {
    mysqlConnection.query(`SELECT batchID FROM ${CONFIG.tb_students} WHERE id='${req.params.id}'`, function (err, data, result) {
        if (err){
            res.redirect(`/studentslisting?id=${data[0].batchID}`)
        }else{
            res.redirect(`/studentslisting?id=${data[0].batchID}`)
        }
        mysqlConnection.query(`DELETE FROM ${CONFIG.tb_students} WHERE id='${req.params.id}'`, function(err){
            
        })
    });
}


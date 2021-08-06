const mysqlConnection = require('../db/connection');
const CONFIG = require('../config/conf');
const Validator = require("fastest-validator");
const v = new Validator();
const schemaBatches = require('../Validations/batchesSchema');


exports.batchlisting = function (req, res) {
    let params = req.query;
    let searchvalues = '';
    if (params.courseName != '') {
        searchvalues += ` and courseName = '${params.courseName}'`
    }
    mysqlConnection.query(`SELECT * FROM ${CONFIG.tb_batches} WHERE 1=1 ${searchvalues}`, (err, data, fields) => {
        if (!err)
            res.render('batches-listing.ejs', { title: 'Batches Listing', batchesData: data, searchedparam: params.courseName, cookies: req.cookies })
        else
            res.status(424).json({ status: false, "message": err });
    })
}

exports.deleteBatch = function (req, res) {

    let ID = req.params.id;
    mysqlConnection.query(`SELECT * FROM ${CONFIG.tb_students} WHERE batchID='${ID}'`, (err, data, fields) => {
        if (data.length < 1){
            mysqlConnection.query(`DELETE FROM ${CONFIG.tb_batches} WHERE id='${ID}'`, (err, data, fields) => {
            if (!err)
                res.redirect('/batchlisting?courseName=')
            else
                res.redirect('/batchlisting?courseName=')
            })
        }else{
            res.redirect('/batchlisting?courseName=&success=true')
        }
    })



}

exports.createBATCH = function (req, res) {
    res.render('batches-create.ejs', { title: 'Batches Create', cookies: req.cookies })

}

exports.postBatch = function (req, res) {
    const { CENID, courseName, trainerName,	trainerEmail, trainerPhone} = req.body;
    
    

    if ((v.validate({...req.body, date: new Date().toLocaleDateString()}, schemaBatches)) === true) {
       
        

        var sql = `INSERT INTO ${CONFIG.tb_batches} 
        (
            CENID, courseName, trainerName,	trainerEmail, trainerPhone, date

        ) VALUES ?`;

        var values = [[
            CENID, courseName, trainerName,	trainerEmail, trainerPhone, new Date().toLocaleDateString()
        ]];


        mysqlConnection.query(sql, [values], function (err, result) {

            res.redirect('/batchlisting?courseName=');
            return;
        });

    } else {
        res.redirect('/batchlisting?courseName=');
    }

}

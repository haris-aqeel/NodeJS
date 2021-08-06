const mysqlConnection = require('../db/connection');
const CONFIG = require('../config/conf');
const Validator = require("fastest-validator");
const v = new Validator();
const schemaGuideline = require('../Validations/guidelineSchema');






exports.guidelineListing = function (req, res) {
    let params = req.query;
    let searchvalues = '';
    
   if (params.subject != '') {
       searchvalues += ` and subject = '${params.subject}'`
   }
   

   mysqlConnection.query(`SELECT * FROM ${CONFIG.tb_guideline} WHERE 1=1 ${searchvalues}`, (err, data, fields) => {
       if (!err)
           res.render('guideline-listing.ejs', { title: 'Guideline Listing', guidelineData: data, searchedparam: params.subject, cookies : req.cookies })
       else
           res.status(424).json({ status: false, "message": err });
   })

}

exports.createGuideline = function (req, res) {
    res.render('guideline-create.ejs', { title: 'Guideline Create', cookies : req.cookies})
}

exports.postGuideline = function (req, res) {

    const {subject, country, date} = req.body;

    try {
        var fileUpload = req.files.guidelinefile;
        var extension = req.files.guidelinefile.name.split('.').pop();
        var image = `${Math.random() * Math.random() * 10000}.${extension}`
        if (!((!image || image.match(/\.(pdf|doc|docx)$/i)))) {
            res.redirect('guidelinelisting?subject=')
            return;
        }
    } catch (err) {
        res.redirect('guidelinelisting?subject=');
    }

    const guidelineObj = {
        subject,
        country,
        date,
        image
    };

    if ((v.validate(guidelineObj, schemaGuideline)) === true) {
        fileUpload.mv('./uploads/Guideline/' + image, function (err) {
            if (err) {
                res.redirect('guidelinelisting?subject=')
                return;
            }
        });

        var sql = `INSERT INTO ${CONFIG.tb_guideline} (subject, country, date, file) VALUES ?`;
        var values = [[subject, country,  date, 'uploads/Guideline/'+image]]


        mysqlConnection.query(sql, [values], function (err, result) {
            if (err){
                res.redirect('guidelinelisting?subject=');
            }
            else{
                res.redirect('guidelinelisting?subject=');
            }
        });

    } else {

        res.redirect('guidelinelisting?subject=');
    }

}


exports.deleteGuideline= function (req, res) {
    let ID = req.params.id;

    mysqlConnection.query(`DELETE FROM ${CONFIG.tb_guideline} WHERE id='${ID}'`, (err, data, fields) => {
        if (!err)
            res.redirect('/guidelinelisting?subject=')    
        else
            res.redirect('/guidelinelisting?subject=')    
    })
}


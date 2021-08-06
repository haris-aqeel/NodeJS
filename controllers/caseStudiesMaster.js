const mysqlConnection = require('../db/connection');
const CONFIG = require('../config/conf');
const Validator = require("fastest-validator");
const v = new Validator();
const schemaCaseStudies = require('../Validations/caseStudiesSchema');






exports.caseListing = function (req, res) {
    let params = req.query;
    let searchvalues = '';
    
   if (params.heading != '') {
       searchvalues += ` and heading = '${params.heading}'`
   }
   

   mysqlConnection.query(`SELECT * FROM ${CONFIG.tb_case} WHERE 1=1 ${searchvalues}`, (err, data, fields) => {
       if (!err)
           res.render('case-listing.ejs', { title: 'Case Studies Listing', caseData: data, searchedparam: params.heading, cookies : req.cookies  })
       else
           res.status(424).json({ status: false, "message": err });
   })

}

exports.createCase = function (req, res) {
    res.render('case-create.ejs', { title: 'Case Studies Create', cookies : req.cookies})
}

exports.postCase = function (req, res) {

    const {heading, description} = req.body;

    try {
        var fileUpload = req.files.casefile;
        var extension = req.files.casefile.name.split('.').pop();
        var image = `${Math.random() * Math.random() * 10000}.${extension}`
        if (!((!image || image.match(/\.(jpg|png)$/i)))) {
            res.redirect('caselisting?heading=')
            return;
        }
    } catch (err) {
        res.redirect('caselisting?heading=');
    }

    const caseStudiesObj = {
        heading,
        description,
        date:  new Date().toLocaleDateString(),
        image
    };

    if ((v.validate(caseStudiesObj, schemaCaseStudies)) === true) {
        fileUpload.mv('./uploads/CaseStudies/' + image, function (err) {
            if (err) {
                res.redirect('caselisting?heading=')
                return;
            }
        });

        var sql = `INSERT INTO ${CONFIG.tb_case} (heading, description, date, image) VALUES ?`;
        var values = [[heading, description, caseStudiesObj.date, 'uploads/CaseStudies/'+image]]


        mysqlConnection.query(sql, [values], function (err, result) {
            if (err){
                res.redirect('caselisting?heading=');
            }
            else{
                res.redirect('caselisting?heading=');
            }
        });

    } else {
        res.redirect('caselisting?heading=');
    }

}



exports.deleteCase= function (req, res) {
    let ID = req.params.id;
    mysqlConnection.query(`DELETE FROM ${CONFIG.tb_case} WHERE id='${ID}'`, (err, data, fields) => {
        if (!err)
            res.redirect('/caselisting?heading=')    
        else
            res.redirect('/caselisting?heading=')    
    })
}


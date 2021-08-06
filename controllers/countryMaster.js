const mysqlConnection = require('../db/connection');
const CONFIG = require('../config/conf');
const Validator = require("fastest-validator");
const v = new Validator();
const schemaCountry = require('../Validations/countrySchema');






exports.countryListing = function (req, res) {
    let params = req.query;
    let searchvalues = '';
    
   if (params.countryname != '') {
       searchvalues += ` and countryname = '${params.countryname}'`
   }
   

   mysqlConnection.query(`SELECT * FROM ${CONFIG.tb_country} WHERE 1=1 ${searchvalues}`, (err, data, fields) => {
       if (!err)
           res.render('country-listing.ejs', { title: 'www Country Listing', countryData: data, searchedparam: params.countryname, cookies : req.cookies })
       else
           res.status(424).json({ status: false, "message": err });
   })

}

exports.createCountry = function (req, res) {
    res.render('country-create.ejs', { title: 'www Country Create', cookies : req.cookies})
}

exports.postCountry = function (req, res) {

    const {countryname, intro, livlihood, healthcare} = req.body;

    try {
        var fileUpload = req.files.countryfile;
        var extension = req.files.countryfile.name.split('.').pop();
        var image = `${Math.random() * Math.random() * 10000}.${extension}`
        if (!((!image || image.match(/\.(jpg|png)$/i)))) {
            res.redirect('countrylisting?countryname=')
            return;
        }
    } catch (err) {
        res.redirect('countrylisting?countryname=');
    }

    const countryObj = {
        countryname,
        intro, 
        livlihood, 
        healthcare,
        date: new Date().toLocaleDateString(),
        image
    };

    if ((v.validate(countryObj, schemaCountry)) === true) {
        fileUpload.mv('./uploads/Country/' + image, function (err) {
            if (err) {
                res.redirect('countrylisting?countryname=')
                return;
            }
        });

        var sql = `INSERT INTO ${CONFIG.tb_country} (countryname, intro, livlihood, healthcare, date, image) VALUES ?`;
        var values = [[countryname, intro, livlihood, healthcare, countryObj.date,'uploads/Country/'+image]]


        mysqlConnection.query(sql, [values], function (err, result) {
            if (err){
                res.redirect('countrylisting?countryname=');
            }
            else{
                res.redirect('countrylisting?countryname=');
            }
        });

    } else {
        res.redirect('countrylisting?countryname=');
    }

}



exports.deleteCountry= function (req, res) {
    let ID = req.params.id;

    mysqlConnection.query(`DELETE FROM ${CONFIG.tb_country} WHERE id='${ID}'`, (err, data, fields) => {
        if (!err)
            res.redirect('/countrylisting?countryname=')    
        else
            res.redirect('/countrylisting?countryname=')    
    })
}


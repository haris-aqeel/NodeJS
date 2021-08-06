const mysqlConnection = require('../db/connection');
const CONFIG = require('../config/conf');
const Validator = require("fastest-validator");
const v = new Validator();
const schemaDomain = require('../Validations/domainSchema');
exports.viewDOMAINlistingAPI = function (req, res) {
    let params = req.query;
    let searchvalues = '';
    if (params.status != '') {
        searchvalues += ` and status = '${params.status}'`
    }
    mysqlConnection.query(`SELECT * FROM ${CONFIG.tb_domain} WHERE 1=1 ${searchvalues}`, (err, data, fields) => {
        if (!err)
            res.json({ status: true, "count": data.length, "data": data });
        else
            res.status(424).json({ status: false, "message": err });
    })
}
exports.viewDOMAINlisting = function (req, res) {
    let params = req.query;
    let searchvalues = '';

    if (params.name != '') {
        searchvalues += ` and name = '${params.name}'`
    }
    mysqlConnection.query(`SELECT * FROM ${CONFIG.tb_domain} WHERE 1=1 ${searchvalues}`, (err, data, fields) => {
        if (!err)
            res.render('domain-listing.ejs', { title: 'Domain Listing', domainListingData: data , cookies : req.cookies})
        else
            res.status(424).json({ status: false, "message": err });
    })
}

exports.createDOMAIN = function (req, res) {

    res.render('domain-create.ejs', { title: 'Create Domain' , cookies : req.cookies})
}

exports.postCreateDOMAIN = function (req, res) {

    const { name } = req.body;

    try {
        var fileUpload = req.files.domainFile;
        var extension = req.files.domainFile.name.split('.').pop();
        var file = `${Math.random() * Math.random() * 10000}.${extension}`
        if (!((!file || file.match(/\.(jpg|png|jpeg)$/i)))) {
            res.redirect('domaincreate')
            return;
        }
    } catch (err) {
        res.redirect('domaincreate')

    }
    const domainObject = {
        name,
        file
    }

    if ((v.validate(domainObject, schemaDomain)) === true) {
        fileUpload.mv('./uploads/Domain/' + file, function (err) {
            if (err) {
                res.redirect('domainlisting?name=')
                return;

            }
        });

        var sql = `INSERT INTO ${CONFIG.tb_domain} (name, file) VALUES ?`;
        var values = [[domainObject.name, 'uploads/Domain/'+domainObject.file]]


        mysqlConnection.query(sql, [values], function (err, result) {
            if (err);
            console.log(err)
            res.redirect('domainlisting?name=')

        });

    } else {
        res.redirect('domainlisting?name=')
    }

}


exports.domainStatus = function (req, res) {

    const { id } = req.query;
    mysqlConnection.query(`SELECT * FROM ${CONFIG.tb_domain} WHERE id=${id}`, (err, data, fields) => {
        if (!err) {
            mysqlConnection.query(`UPDATE ${CONFIG.tb_domain} SET status=${data[0].status == 1 ? 0 : 1}  WHERE id='${id}' `, (err, data, fields) => {
                if (!err) {
                    res.redirect('domainlisting?name=');
                } else {
                    alert("Error In Changing Status...");
                    res.redirect('domainlisting?name=');
                }
            })
        }
        else
            res.redirect('domainlisting?name=');
    })

}

exports.domainStatusDelete = function (req, res) {
    const { id } = req.query;
    mysqlConnection.query(`DELETE FROM ${CONFIG.tb_domain} WHERE id=${id}`, (err, data, fields) => {
        if (!err) {
            mysqlConnection.query(`DELETE FROM ${CONFIG.tb_course} WHERE domainid=${id}`, (err, data, fields) => {
                res.redirect('domainlisting?name=');
            })
        }
        else
            res.redirect('domainlisting?name=');
    })
}





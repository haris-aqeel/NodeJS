const mysqlConnection = require('../db/connection');
const CONFIG = require('../config/conf');
const Validator = require("fastest-validator");
const v = new Validator();
const schemaNotice = require('../Validations/noticeSchema');
exports.viewNOTICElistingAPI = function (req, res) {
    let params = req.query;
    let searchvalues = '';
    if (params.status != '') {
        searchvalues += ` and status = '${params.status}'`
    }
    if (params.Website != '') {
        searchvalues += ` and Website = '${params.Website}'`
    }
    mysqlConnection.query(`SELECT * FROM ${CONFIG.tb_notice} WHERE 1=1 ${searchvalues}`, (err, data, fields) => {
        if (!err)
            res.json({ status: true, "count": data.length, "data": data });
        else
            res.status(424).json({ status: false, "message": err });
    })
}
exports.viewNOTICElisting = function (req, res) {
    let params = req.query;
    let searchvalues = '';

    if (params.Website != '') {
        searchvalues += ` and Website = '${params.Website}'`
    }
    mysqlConnection.query(`SELECT * FROM ${CONFIG.tb_notice} WHERE 1=1 ${searchvalues}`, (err, data, fields) => {
        if (!err)
            res.render('notice-listing.ejs', { title: 'Notice Listing', noticeListingData: data , cookies : req.cookies})
        else
            res.status(424).json({ status: false, "message": err });
    })
}

exports.createNOTICE = function (req, res) {

    res.render('notice-create.ejs', { title: 'Create Notice' , cookies : req.cookies})
}

exports.postCreateNOTICE = function (req, res) {

    const { subject, letter, date, website } = req.body;

    try {
        var fileUpload = req.files.noticeFile;
        var extension = req.files.noticeFile.name.split('.').pop();
        var file = `${Math.random() * Math.random() * 10000}.${extension}`
        if (!((!file || file.match(/\.(doc|pdf|docx)$/i)))) {
            res.redirect('noticecreate')
            return;
        }
    } catch (err) {
        res.redirect('noticecreate')

    }
    const noticeObject = {
        subject,
        letter,
        date,
        Website: website,
        file
    }

    if ((v.validate(noticeObject, schemaNotice)) === true) {
        fileUpload.mv('./uploads/Notice/' + file, function (err) {
            if (err) {
                res.redirect('noticelisting?Website=')
                return;

            }
        });

        var sql = `INSERT INTO ${CONFIG.tb_notice} (subject, letter, date, Website, file) VALUES ?`;
        var values = [[noticeObject.subject, noticeObject.letter,  noticeObject.date, noticeObject.Website, 'uploads/Notice/'+noticeObject.file]]


        mysqlConnection.query(sql, [values], function (err, result) {
            if (err);
            res.redirect('noticelisting?Website=')

        });

    } else {
        res.redirect('noticelisting?Website=')
    }

}


exports.noticeStatus = function (req, res) {

    const { id } = req.query;
    mysqlConnection.query(`SELECT * FROM ${CONFIG.tb_notice} WHERE id=${id}`, (err, data, fields) => {
        if (!err) {
            mysqlConnection.query(`UPDATE ${CONFIG.tb_notice} SET status=${data[0].status == 1 ? 0 : 1}  WHERE id='${id}' `, (err, data, fields) => {
                if (!err) {
                    res.redirect('noticelisting?Website=');
                } else {
                    alert("Error In Changing Status...");
                    res.redirect('noticelisting?Website=');
                }
            })
        }
        else
            res.redirect('noticelisting?Website=');
    })

}

exports.noticeStatusDelete = function (req, res) {

    const { id } = req.query;
    mysqlConnection.query(`DELETE FROM ${CONFIG.tb_notice} WHERE id=${id}`, (err, data, fields) => {
        if (!err) {
            res.redirect('noticelisting?Website=');
        }
        else
            res.redirect('noticelisting?Website=');
    })

}





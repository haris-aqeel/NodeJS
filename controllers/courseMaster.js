const mysqlConnection = require('../db/connection');
const CONFIG = require('../config/conf');
const Validator = require("fastest-validator");
const v = new Validator();
const schemaCourse = require('../Validations/courseSchema');
exports.viewCOURSElistingAPI = function (req, res) {
    let params = req.query;
    let searchvalues = '';
    if (params.status != '') {
        searchvalues += ` and status = '${params.status}'`
    }
    if (params.domainid != '') {
        searchvalues += ` and domainid = '${params.domainid}'`
    }
    mysqlConnection.query(`SELECT * FROM ${CONFIG.tb_course} WHERE 1=1 ${searchvalues}`, (err, data, fields) => {
        if (!err)
            res.json({ status: true, "count": data.length, "data": data });
        else
            res.status(424).json({ status: false, "message": err });
    })
}
exports.viewCOURSElisting = function (req, res) {
    let params = req.query;
    let searchvalues = '';

    if (params.coursename != '') {
        searchvalues += ` and coursename  = '${params.coursename}'`
    }

    if (params.domainid != '') {
        searchvalues += ` and domainid  = '${params.domainid}'`
    }


    mysqlConnection.query(`SELECT ${CONFIG.tb_course}.*, ${CONFIG.tb_domain}.name FROM ${CONFIG.tb_course} JOIN ${CONFIG.tb_domain} ON ${CONFIG.tb_course}.domainid=${CONFIG.tb_domain}.id WHERE 1=1 ${searchvalues}`, (err, dataList, fields) => {
        if (!err) {
            mysqlConnection.query(`SELECT * FROM ${CONFIG.tb_domain}`, (err, data, fields) => {
                res.render('course-listing.ejs', { title: 'Course Listing', courseListingData: dataList, options:  data, cookies : req.cookies})
            })
        }
        else
            res.status(424).json({ status: false, "message": err });
    })
}

exports.createCOURSE = function (req, res) {

    mysqlConnection.query(`SELECT id, name FROM ${CONFIG.tb_domain}`, (err, data, fields) => {
        if (!err) {
            res.render('course-create.ejs', { title: 'Create Course', domainData: data , cookies : req.cookies})
        }
        else
            res.status(424).json({ status: false, "message": err });
    })

}

exports.postCreateCOURSE = function (req, res) {

    const { coursename, domainid } = req.body;


    try {
        var fileUpload_1 = req.files.courseFile;
        var extension_1 = req.files.courseFile.name.split('.').pop();
        var file_1 = `${Math.random() * Math.random() * 10000}.${extension_1}`

        var fileUpload_2 = req.files.labFile;
        var extension_2 = req.files.labFile.name.split('.').pop();
        var file_2 = `${Math.random() * Math.random() * 10000}.${extension_2}`

        if (!((!file_1 || file_1.match(/\.(doc|pdf|docx)$/i))) && ((!file_2 || file_2.match(/\.(doc|pdf|docx)$/i)))) {
            res.redirect('coursecreate')
            return;
        }
    } catch (err) {
        res.redirect('coursecreate')

    }
    const courseObject = {
        coursename,
        file_1,
        file_2,
        date: new Date().toDateString(),
        domainid
    }

    if ((v.validate(courseObject, schemaCourse)) === true) {
        fileUpload_1.mv('./uploads/Courses/' + file_1, function (err) {
            if (err) {
                res.redirect('courselisting?coursename=&domainid=')
                return;

            }
        });

        fileUpload_2.mv('./uploads/Courses/' + file_2, function (err) {
            if (err) {
                res.redirect('courselisting?coursename=&domainid=')
                return;
            }
        });

        var sql = `INSERT INTO ${CONFIG.tb_course} (coursename, file_course, file_lab, date, domainid) VALUES ?`;
        var values = [[courseObject.coursename, 'uploads/Courses/' + courseObject.file_1, 'uploads/Courses/' + courseObject.file_2, courseObject.date, courseObject.domainid]]


        mysqlConnection.query(sql, [values], function (err, result) {
            if (err);
            res.redirect('courselisting?coursename=&domainid=')

        });

    } else {
        res.redirect('courselisting?coursename=&domainid=')
    }

}


exports.courseStatus = function (req, res) {

    const { id } = req.query;
    mysqlConnection.query(`SELECT * FROM ${CONFIG.tb_course} WHERE id=${id}`, (err, data, fields) => {
        if (!err) {
            mysqlConnection.query(`UPDATE ${CONFIG.tb_course} SET status=${data[0].status == 1 ? 0 : 1}  WHERE id='${id}' `, (err, data, fields) => {
                if (!err) {
                    res.redirect('courselisting?coursename=&domainid=');
                } else {
                    alert("Error In Changing Status...");
                    res.redirect('courselisting?coursename=&domainid=');
                }
            })
        }
        else
            res.redirect('courselisting?coursename=&domainid=');
    })

}

exports.courseStatusDelete = function (req, res) {

    const { id } = req.query;
    mysqlConnection.query(`DELETE FROM ${CONFIG.tb_course} WHERE id=${id}`, (err, data, fields) => {
        if (!err) {
            res.redirect('courselisting?coursename=&domainid=');
        }
        else
            res.redirect('courselisting?coursename=&domainid=');
    })

}





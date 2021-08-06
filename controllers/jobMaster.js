const mysqlConnection = require('../db/connection');
const CONFIG = require('../config/conf');
const Validator = require("fastest-validator");
const v = new Validator();
const schemaJobForm = require('../Validations/jobSchema');
const schemaCreateJobForm = require('../Validations/createJobSchema');
const mailservice = require('../mail');
exports.viewJOBquery = function (req, res) {
    let params = req.query;
    let searchvalues = '';
    if (params.Phone != '') {
        searchvalues += ` and Phone = '${params.Phone}'`
    }
    if (params.Website != '') {
        searchvalues += ` and Website = '${params.Website}'`
    }

    mysqlConnection.query(`SELECT * FROM ${CONFIG.tb_job_query} WHERE 1=1 ${searchvalues}`, (err, data, fields) => {
        if (!err)
            res.render('job-query.ejs', { title: 'Job Query', jobQueryData: data, cookies : req.cookies, cookies : req.cookies })
        else
            res.status(424).json({ status: false, "message": err });
    })
}

exports.postJOB = (req, res) => {
    const { name, phone, email, jobId, website } = req.body;

    try {
        var fileUpload = req.files.file;
        var extension = req.files.file.name.split('.').pop();
        var image = `${Math.floor(Math.random() * 90000000) + 10000}.${extension}`

        if (!((!image || image.match(/\.(doc|pdf|docx)$/i)))) {
            res.send(`${image} is not Allowed..`);
            return;
        }
    } catch (err) {
        res.status(422).json({ "status": 'fail', "message": "Error in Uploading Files..." + err });
        return;
    }
    if ((v.validate({ ...req.body, image }, schemaJobForm)) === true) {
        fileUpload.mv('./uploads/' + image, function (err) {
            if (err) {
                console.log(err)
            }
        });

        var sql = `INSERT INTO ${CONFIG.tb_job_query} (Name, Phone, Email, JobId, Image, Website) VALUES ?`;
        var values = [[name, phone, email, jobId, image, website]]

        mysqlConnection.query(sql, [values], function (err, result) {
            if (err) res.send("mySQL connection Error");
            res.json({ "status": 'success', "message": "Applied Successfully" });
            let mailvalues = {
                from : req.body.from,
                pass : req.body.pass,
                tomail : req.body.email,
                subject : `Job Application Confirmation.`,
                personName : req.body.name,
                logo : req.body.logo,
                content : `We have recieved your application. Soon we will get back to you.`
            }
            mailservice.MAIL(mailvalues);
        });
    } else {
        res.status(422).json({ "status": 'fail', "message": v.validate(req.body, schemaJobForm) });
    }
}
exports.viewJOBlisting = function (req, res) {
    let params = req.query;
    let searchvalues = '';

    if (params.Website != '') {
        searchvalues += ` and Website = '${params.Website}'`
    }
    mysqlConnection.query(`SELECT * FROM ${CONFIG.tb_job} WHERE 1=1 ${searchvalues}`, (err, data, fields) => {
        if (!err)
            res.render('job-listing.ejs', { title: 'Job Listing', jobListingData: data, cookies : req.cookies })
        else
            res.status(424).json({ status: false, "message": err });
    })
}

exports.viewJOBlistingAPI = function (req, res) {
    let params = req.query;
    let searchvalues = '';
    if (params.status != '') {
        searchvalues += ` and status = '${params.status}'`
    }
    if (params.Website != '') {
        searchvalues += ` and Website = '${params.Website}'`
    }
    mysqlConnection.query(`SELECT * FROM ${CONFIG.tb_job} WHERE 1=1 ${searchvalues}`, (err, data, fields) => {
        if (!err)
            res.json({ status: true, "count": data.length, "data": data });
        else
            res.status(424).json({ status: false, "message": err });
    })
}
exports.createJOB = function (req, res) {

    res.render('job-create.ejs', { title: 'Create Job' , cookies : req.cookies})
}

exports.postCreateJOB = function (req, res) {

    const { website, PostName } = req.body;

    try {
        var fileUpload = req.files.jobfile;
        var extension = req.files.jobfile.name.split('.').pop();
        var file = `${Math.random() * Math.random() * 10000}.${extension}`
        if (!((!file || file.match(/\.(doc|pdf|docx)$/i)))) {
            console.log("File with extensions .pdf, .doc & .docx are allowed only")
            res.redirect('jobcreate')
            return;
        }
    } catch (err) {
        console.log("Error in Uploading Files..." + err)

    }
    const jobObject = {
        PostName: PostName,
        file: file,
        date: new Date(),
        website: website,

    }

    if ((v.validate(jobObject, schemaCreateJobForm)) === true) {
        fileUpload.mv('./uploads/Jobs/' + file, function (err) {
            if (err) {
                console.log("Error In Uploading File");
                return;
            }
        });

        var sql = `INSERT INTO ${CONFIG.tb_job} (PostName, file, date, website) VALUES ?`;
        var values = [[jobObject.PostName, 'uploads/Jobs/'+jobObject.file, jobObject.date, jobObject.website]]


        mysqlConnection.query(sql, [values], function (err, result) {
            if (err);
            console.log("Job Form Posted Successfully")
            res.redirect('joblisting?Website=')

        });

    } else {

        console.log(v.validate(req.body, schemaCreateJobForm))

    }

}


exports.jobStatus = function (req, res) {

    const { id } = req.query;
    mysqlConnection.query(`SELECT * FROM ${CONFIG.tb_job} WHERE id=${id}`, (err, data, fields) => {
        if (!err) {
            mysqlConnection.query(`UPDATE ${CONFIG.tb_job} SET status=${data[0].status == 1 ? 0 : 1}  WHERE id='${id}' `, (err, data, fields) => {
                if (!err) {
                    res.redirect('joblisting?Website=');
                } else {
                    alert("Error In Changing Status...");
                    res.redirect('joblisting?Website=');
                }
            })
        }
        else
            res.redirect('joblisting?Website=');
    })

}

exports.jobStatusDelete = function (req, res) {

    const { id } = req.query;
    mysqlConnection.query(`DELETE FROM ${CONFIG.tb_job} WHERE id=${id}`, (err, data, fields) => {
        if (!err) {
            res.redirect('joblisting?Website=');
        }
        else
            res.redirect('joblisting?Website=');
    })

}





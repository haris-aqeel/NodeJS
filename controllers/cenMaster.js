const mysqlConnection = require('../db/connection');
const CONFIG = require('../config/conf');
const Validator = require("fastest-validator");
const v = new Validator();
const schemaCEN = require('../Validations/schemaCEN');
const schemaPaymentCEN = require('../Validations/cenupdateschema');
const invoiceservice = require('../invoice');
const mailservice = require('../mail');
var moment = require('moment');
exports.viewCEN = function (req, res) {
    let params = req.query;
    let searchvalues  = '';
    if(params.ContactofCenterManager != ''){
        searchvalues+=` and ContactofCenterManager = '${params.ContactofCenterManager}'`
    }
    if(params.State != ''){
        searchvalues+=` and State = '${params.State}'`
    }
    if(params.Status != ''){
        searchvalues+=` and Status = '${params.Status}'`
    }

    mysqlConnection.query(`SELECT ${CONFIG.tb_cen}.*, ${CONFIG.tb_state}.name  FROM ${CONFIG.tb_cen} JOIN ${CONFIG.tb_state} ON ${CONFIG.tb_cen}.State=${CONFIG.tb_state}.id WHERE  1=1 ${searchvalues}`, (err, data, fields) => {
        if (!err){
            mysqlConnection.query(`SELECT * FROM ${CONFIG.tb_state}`, (err, statedata, fields) => {
                if (!err)
                res.render('center-listing.ejs', { title: 'USER Center', regQueryData: data, state:statedata, cookies : req.cookies})
                else
                res.status(424).json({status:false, "message": err});
            })
        }else{
            res.status(424).json({status:false, "message": err});
        }   
    })
}
exports.mycenters = function (req, res) {
    let params = req.query;
    let searchvalues  = '';
    if(params.ContactofCenterManager != ''){
        searchvalues+=` and ContactofCenterManager = '${params.ContactofCenterManager}'`
    }
    if(params.Status != ''){
        searchvalues+=` and Status = '${params.Status}'`
    }

    mysqlConnection.query(`SELECT ${CONFIG.tb_cen}.*, ${CONFIG.tb_state}.name  FROM ${CONFIG.tb_cen} JOIN ${CONFIG.tb_state} ON ${CONFIG.tb_cen}.State=${CONFIG.tb_state}.id WHERE  1=1 ${searchvalues} AND IPREF='${req.cookies.REF}'`, (err, data, fields) => {
        if (!err){
            mysqlConnection.query(`SELECT * FROM ${CONFIG.tb_state}`, (err, statedata, fields) => {
                if (!err)
                res.render('mycenters.ejs', { title: 'My Centers', regQueryData: data, state:statedata, cookies : req.cookies})
                else
                res.status(424).json({status:false, "message": err});
            })
        }else{
            res.status(424).json({status:false, "message": err});
        }   
    })
}
exports.postCEN = function(req, res) {
    const  {
            login_mail,
            login_pass,
            AppID,
            pay_id,
            REF,
            IPREF,
            NameofEntity,
            State,
            Address,
            Pincode,
            NameofCenterManager,
            ContactofCenterManager,
            EmailofCenterManager,
            partner,
            COURSE
            } = req.body;

        const date = moment().format('Do MMMM, YYYY');
    if((v.validate(req.body, schemaCEN)) === true) {
        var sql = `INSERT INTO ${CONFIG.tb_cen} (login_mail,
            login_pass,
            AppID,
            pay_id,
            REF,
            IPREF,
            NameofEntity,
            State,
            Address,
            Pincode,
            NameofCenterManager,
            ContactofCenterManager,
            EmailofCenterManager,
            partner,
            COURSE,
            date) VALUES ?`;
        var values = [[login_mail,
            login_pass,
            AppID,
            pay_id,
            REF,
            IPREF,
            NameofEntity,
            State,
            Address,
            Pincode,
            NameofCenterManager,
            ContactofCenterManager,
            EmailofCenterManager,
            partner,
            COURSE,
            date]];
        mysqlConnection.query(sql, [values], function (err, result) {
            if (!err) {
                ///
                mysqlConnection.query(`SELECT * FROM ${CONFIG.tb_cen} WHERE AppID = ${AppID}`, (err, data, fields) => {
                if (!err){
                    res.json({ status: true, "count": data.length, "data": data[0] });
                    let mailvalues = {
                        from : req.body.from,
                        pass : req.body.pass,
                        tomail : req.body.EmailofCenterManager,
                        subject : `Registration ${req.body.partner} Application Confirmation.`,
                        personName : req.body.NameofCenterManager,
                        logo : req.body.logo,
                        content : `Thank you for registration as  ${req.body.partner}. Here is your Application id = ${req.body.AppID}`
                    }
                    mailservice.MAIL(mailvalues);
                }else{
                    res.status(424).json({ status: false, "message": err });
                }
                ////
            })
            }else{
                res.status(422).json("ssmySQL connection Error");
            }
        });        
    }
    else{        
        res.status(422).json({"status": 'fail', "message": v.validate(req.body, schemaCEN)});
    } 
}



exports.postPaymentCEN = (req, res) => {
    if((v.validate(req.body, schemaPaymentCEN)) === true) {

        mysqlConnection.query(`UPDATE ${CONFIG.tb_cen} SET pay_id='${req.body.pay_id}' WHERE id='${req.body.id}'`, function (err, result) {
            if (err) {
                res.status(422).json("mySQL connection Error");
            }else{
                
                mysqlConnection.query(`SELECT * FROM ${CONFIG.tb_cen} WHERE id=${req.body.id}`, (err, data, fields) => {
                    if (!err) {
                        res.json({"status": 'success', "message": "REG Payment Recieved Successfully"});
                        let record = data[0];
                        let invoicevalues = {
                            from : req.body.from,
                            pass : req.body.pass,
                            to : record.EmailofCenterManager,
                            subject : req.body.subject,
                            myORG : req.body.website,
                            personName : record.NameofCenterManager,
                            address : record.Address,
                            company_address : req.body.company_address,
                            TotalAmount : req.body.TotalAmount,
                            item : req.body.invoicedata
                        }
                        
                        invoiceservice.INVOICED(invoicevalues);
                    }
                    else
                        res.status(422).json("mySQL connection Error");
                })
            }
        });        

    }else{
        res.status(422).json({"status": 'fail', "message": v.validate(req.body, schemaPaymentEOI)});
    }

}




exports.laterCENCheck = (req, res) => {
    mysqlConnection.query(`SELECT * FROM ${CONFIG.tb_cen} WHERE AppID=${req.body.AppID} AND pay_id IS NULL`, (err, data, fields) => {
        if (!err) {
            res.json({ status: true, "count": data.length, "data": data[0] });
        }
        else
            res.status(422).json("mySQL connection Error");
    })
}

exports.cenApprove = function (req, res) {
    const { id } = req.query;
    mysqlConnection.query(`SELECT * FROM ${CONFIG.tb_cen} WHERE id=${id}`, (err, data, fields) => {
        let currentstatus = ''
        if(data[0].status == 1){
            currentstatus = 0
        }else{
            currentstatus = 1
        }
        if (!err) {
            mysqlConnection.query(`UPDATE ${CONFIG.tb_cen} SET status=${currentstatus}  WHERE id='${id}' `, (err, data, fields) => {
                if (!err) {
                    
                    res.redirect('reg-center?ContactofCenterManager=&State=&Status');
                } else {
                    alert("Error In Changing Status...");
                    res.redirect(redirectAddress);
                }
            })
        }
        else
            res.redirect(redirectAddress);
    })

}
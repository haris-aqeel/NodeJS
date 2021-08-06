const mysqlConnection = require('../db/connection');
const CONFIG = require('../config/conf');
const Validator = require("fastest-validator");
const v = new Validator();
const schemaEOI = require('../Validations/EOISchema');
const schemaPaymentEOI = require('../Validations/eoiupdateschema');
const invoiceservice = require('../invoice');
const mailservice = require('../mail');
var moment = require('moment');
exports.myEOIapplication = function (req, res) {
    let UID = req.cookies.UID;
    mysqlConnection.query(`SELECT * FROM ${CONFIG.tb_usr} WHERE id=${UID}`, (err, data, fields) => {
        if (!err) {
            //
            mysqlConnection.query(`SELECT ${CONFIG.tb_eoi}.*, ${CONFIG.tb_state}.name  FROM ${CONFIG.tb_eoi} JOIN ${CONFIG.tb_state} ON ${CONFIG.tb_eoi}.State=${CONFIG.tb_state}.id  WHERE ${CONFIG.tb_eoi}.id=${data[0].EOIid}`, (err, EOIdata, fields) => {
                if (!err) {
                    res.render('myEOIapplication.ejs', { title: 'My EOI Application', EOIdata:EOIdata[0], cookies : req.cookies})
                }
                else
                    res.status(422).json("mySQL connection Error");
            })
            //
        }
        else
            res.status(422).json("mySQL connection Error");
    })
}
exports.EOIcheck = function (req, res) {
    let payment_id = req.body.payment_id;
    if(payment_id){
        mysqlConnection.query(`SELECT * FROM ${CONFIG.tb_eoi} where payment_id = '${payment_id}' AND partner= '${req.body.type}'`, (err, data, fields) => {
            if (!err){
                if(data && data[0] && data[0].status == 0){
                    res.status(424).json({status:false, "message": 'Your EOI is not Approved Yet. Please wait for Approval.'})
                }else{
                    res.json({ status: true, "count": data.length, "data": data });
                }
            }
            else
            res.status(424).json({status:false, "message": err})
        })
    }else{
        res.status(424).json({status:false, "message": 'Payment Id Required'});
    }
    
}
exports.viewEOInp = function (req, res) {
    let params = req.query;
    let searchvalues  = '';
    if(params.ContactofAuthorisedSig != ''){
        searchvalues+=` and ContactofAuthorisedSig = '${params.ContactofAuthorisedSig}'`
    }
    if(params.State != ''){
        searchvalues+=` and State = '${params.State}'`
    }
    if(params.Status != ''){
        searchvalues+=` and Status = '${params.Status}'`
    }

    mysqlConnection.query(`SELECT ${CONFIG.tb_eoi}.*, ${CONFIG.tb_state}.name  FROM ${CONFIG.tb_eoi} JOIN ${CONFIG.tb_state} ON ${CONFIG.tb_eoi}.State=${CONFIG.tb_state}.id WHERE  1=1 ${searchvalues} AND partner='Networking Partner'  `, (err, data, fields) => {
        if (!err){
            mysqlConnection.query(`SELECT * FROM ${CONFIG.tb_state}`, (err, statedata, fields) => {
                if (!err)
                res.render('eoi-listing.ejs', { title: 'EOI Networking Partner', eoiQueryData: data, state:statedata, cookies : req.cookies})
                else
                res.status(424).json({status:false, "message": err});
            })
        }else{
            res.status(424).json({status:false, "message": err});
        }   
    })
}
exports.viewEOIip = function (req, res) {
    let params = req.query;
    let searchvalues  = '';
    if(params.ContactofAuthorisedSig != ''){
        searchvalues+=` and ContactofAuthorisedSig = '${params.ContactofAuthorisedSig}'`
    }
    if(params.State != ''){
        searchvalues+=` and State = '${params.State}'`
    }
    if(params.Status != ''){
        searchvalues+=` and Status = '${params.Status}'`
    }
    mysqlConnection.query(`SELECT ${CONFIG.tb_eoi}.*, ${CONFIG.tb_state}.name  FROM ${CONFIG.tb_eoi} JOIN ${CONFIG.tb_state} ON ${CONFIG.tb_eoi}.State=${CONFIG.tb_state}.id WHERE 1=1 ${searchvalues} AND partner='Implementing Partner'`, (err, data, fields) => {
        if (!err){
            mysqlConnection.query(`SELECT * FROM ${CONFIG.tb_state}`, (err, statedata, fields) => {
                if (!err)
                res.render('eoi-listing.ejs', { title: 'EOI Implementing Partner', eoiQueryData: data, state:statedata, cookies : req.cookies})
                else
                res.status(424).json({status:false, "message": err});
            })
        }else{
            res.status(424).json({status:false, "message": err});
        } 
    })
}


exports.eoiApprove = function (req, res) {
    var redirectAddress;
    const { id } = req.query;
    mysqlConnection.query(`SELECT * FROM ${CONFIG.tb_eoi} WHERE id=${id}`, (err, data, fields) => {
        if(data[0].partner == "Implementing Partner"){
            redirectAddress = 'eoi-ip?ContactofAuthorisedSig=&State=&Status';
        }else{
            redirectAddress = 'eoi-np?ContactofAuthorisedSig=&State=&Status';
        }
        let currentstatus = ''
        if(data[0].status == 1){
            currentstatus = 0
        }else{
            currentstatus = 1
        }
        if (!err) {
            mysqlConnection.query(`UPDATE ${CONFIG.tb_eoi} SET status=${currentstatus}  WHERE id='${id}' `, (err, data, fields) => {
                if (!err) {
                    res.redirect(redirectAddress);
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




exports.postEOI = function(req, res) {
    const  {
            NameofEntity,
            ApplicationID,
            TypeofEntity, 
            Address,
            Pincode,
            Pan,
            NofStaff,
            NameofAuthorisedSig,
            ContactofAuthorisedSig,
            EmailofAuthorisedSig,
            YearsofexpinTr,
            Turnover,
            State,
            NoofEntityundernetwork,
            partner,
            payment_id

            } = req.body;

        const date = moment().format('Do MMMM, YYYY');
    if((v.validate(req.body, schemaEOI)) === true) {
        var sql = `INSERT INTO ${CONFIG.tb_eoi} (NameofEntity,
            ApplicationID,
            TypeofEntity, 
            Address,
            Pincode,
            Pan,
            NofStaff,
            NameofAuthorisedSig,
            ContactofAuthorisedSig,
            EmailofAuthorisedSig,
            YearsofexpinTr,
            Turnover,
            State,
            NoofEntityundernetwork,
            partner,
            date) VALUES ?`;
        var values = [[NameofEntity,
            ApplicationID,
            TypeofEntity, 
            Address,
            Pincode,
            Pan,
            NofStaff,
            NameofAuthorisedSig,
            ContactofAuthorisedSig,
            EmailofAuthorisedSig,
            YearsofexpinTr,
            Turnover,
            State,
            NoofEntityundernetwork,
            partner,
            date]];
        mysqlConnection.query(sql, [values], function (err, result) {
            if (!err) {
                ///
                mysqlConnection.query(`SELECT * FROM ${CONFIG.tb_eoi} WHERE ApplicationID = ${ApplicationID}`, (err, data, fields) => {
                if (!err){
                    res.json({ status: true, "count": data.length, "data": data[0] });
                    let mailvalues = {
                        from : req.body.from,
                        pass : req.body.pass,
                        tomail : req.body.EmailofAuthorisedSig,
                        subject : `EOI ${req.body.partner} Application Confirmation.`,
                        personName : req.body.NameofAuthorisedSig,
                        logo : req.body.logo,
                        content : `We have recieved your application and payment for EOI ${req.body.partner}. Here is your Application id = ${req.body.ApplicationID}`
                    }
                    mailservice.MAIL(mailvalues);
                }else{
                    res.status(424).json({ status: false, "message": err });
                }
                ////
            })
                
            }else{
                res.status(422).json("mySQL connection Error");
            }
        });        
    }

    else{        
        res.status(422).json({"status": 'fail', "message": v.validate(req.body, schemaEOI)});
    } 
}



exports.postPaymentEOI = (req, res) => {
    if((v.validate(req.body, schemaPaymentEOI)) === true) {

        mysqlConnection.query(`UPDATE ${CONFIG.tb_eoi} SET payment_id='${req.body.payment_id}' WHERE id='${req.body.id}'`, function (err, result) {
            if (err) {
                res.status(422).json("mySQL connection Error");
            }else{
                
                mysqlConnection.query(`SELECT * FROM ${CONFIG.tb_eoi} WHERE id=${req.body.id}`, (err, data, fields) => {
                    if (!err) {
                        res.json({"status": 'success', "message": "EOI Payment Recieved Successfully"});
                        let record = data[0];
                        let invoicevalues = {
                            from : req.body.from,
                            pass : req.body.pass,
                            to : record.EmailofAuthorisedSig,
                            subject : req.body.subject,
                            myORG : req.body.website,
                            personName : record.NameofAuthorisedSig,
                            address : record.Address,
                            company_address : req.body.company_address,
                            TotalAmount : req.body.TotalAmount,
                            item : [
                                {
                                    item: "1",
                                    description: req.body.invoiceitemdescription,
                                    quantity: 1,
                                    price: parseInt(req.body.UnitCost)+.00, 
                                    tax: req.body.GST
                                }
                            ]
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




exports.laterEOICheck = (req, res) => {
    mysqlConnection.query(`SELECT * FROM ${CONFIG.tb_eoi} WHERE ApplicationID=${req.body.ApplicationID} AND partner= '${req.body.type}' AND payment_id IS NULL`, (err, data, fields) => {
        if (!err) {
            res.json({ status: true, "count": data.length, "data": data[0] });
        }
        else
            res.status(422).json("mySQL connection Error");
    })
}
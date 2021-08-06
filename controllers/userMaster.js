const mysqlConnection = require('../db/connection');
const CONFIG = require('../config/conf');
const Validator = require("fastest-validator");
const v = new Validator();
const schemaUSER = require('../Validations/USERSchema');
const schemaPaymentUSER = require('../Validations/regupdateschema');
const invoiceservice = require('../invoice');
const mailservice = require('../mail');
var moment = require('moment');
exports.myUSERapplication = function (req, res) {
    let UID = req.cookies.UID;
    mysqlConnection.query(`SELECT * FROM ${CONFIG.tb_usr} WHERE id=${UID}`, (err, data, fields) => {
        if (!err) {
            res.render('myUSERapplication.ejs', { title: 'My Registration Application', USERdata: data[0], cookies : req.cookies})
        }
        else
            res.status(422).json("mySQL connection Error");
    })
    
}
exports.changePassword = function (req, res) {
    res.render('changePassword.ejs', { title: 'Change Password', cookies : req.cookies})
}

exports.POSTchangePassword = function(req, res) {

    const {current_password, password1} = req.body;
    const getUID = req.cookies.UID;

    mysqlConnection.query(`UPDATE ${CONFIG.tb_usr} SET login_pass = '${password1}' WHERE id=${getUID} AND login_pass = '${current_password}'`, (err, data, fields) => {
        
        if (!err) {
            data.changedRows != 1 ? res.redirect('/changePassword?passwordnotmatch=true') : res.redirect('/changePassword?success=true');
        }
        else{
            res.redirect('/changePassword?failure=true')
        }
    })

    

    // res.redirect('/changePassword')

}
exports.viewREGnp = function (req, res) {
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

    mysqlConnection.query(`SELECT ${CONFIG.tb_usr}.*, ${CONFIG.tb_state}.name  FROM ${CONFIG.tb_usr} JOIN ${CONFIG.tb_state} ON ${CONFIG.tb_usr}.State=${CONFIG.tb_state}.id WHERE  1=1 ${searchvalues} AND partner='Networking Partner'  `, (err, data, fields) => {
        if (!err){
            mysqlConnection.query(`SELECT * FROM ${CONFIG.tb_state}`, (err, statedata, fields) => {
                if (!err)
                res.render('user-listing.ejs', { title: 'USER Networking Partner', regQueryData: data, state:statedata, cookies : req.cookies})
                else
                res.status(424).json({status:false, "message": err});
            })
        }else{
            res.status(424).json({status:false, "message": err});
        }   
    })
}
exports.viewREGip = function (req, res) {
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
    mysqlConnection.query(`SELECT ${CONFIG.tb_usr}.*, ${CONFIG.tb_state}.name  FROM ${CONFIG.tb_usr} JOIN ${CONFIG.tb_state} ON ${CONFIG.tb_usr}.State=${CONFIG.tb_state}.id WHERE 1=1 ${searchvalues} AND partner='Implementing Partner'`, (err, data, fields) => {
        if (!err){
            mysqlConnection.query(`SELECT * FROM ${CONFIG.tb_state}`, (err, statedata, fields) => {
                if (!err)
                res.render('user-listing.ejs', { title: 'USER Implementing Partner', regQueryData: data, state:statedata, cookies : req.cookies})
                else
                res.status(424).json({status:false, "message": err});
            })
        }else{
            res.status(424).json({status:false, "message": err});
        } 
    })
}
exports.myippartners = function (req, res) {
    let params = req.query;
    let searchvalues  = '';
    if(params.ContactofAuthorisedSig != ''){
        searchvalues+=` and ContactofAuthorisedSig = '${params.ContactofAuthorisedSig}'`
    }
    if(params.Status != ''){
        searchvalues+=` and Status = '${params.Status}'`
    }
    mysqlConnection.query(`SELECT ${CONFIG.tb_usr}.*, ${CONFIG.tb_state}.name  FROM ${CONFIG.tb_usr} JOIN ${CONFIG.tb_state} ON ${CONFIG.tb_usr}.State=${CONFIG.tb_state}.id WHERE 1=1 ${searchvalues} AND partner='Implementing Partner' AND NPREF='${req.cookies.REF}'`, (err, data, fields) => {
        if (!err){
            mysqlConnection.query(`SELECT * FROM ${CONFIG.tb_state}`, (err, statedata, fields) => {
                if (!err)
                res.render('my-ip.ejs', { title: 'My Implementing Partners', regQueryData: data, state:statedata, cookies : req.cookies})
                else
                res.status(424).json({status:false, "message": err});
            })
        }else{
            res.status(424).json({status:false, "message": err});
        } 
    })
}
exports.postREG = function(req, res) {
    const  {
            login_mail,
            login_pass,
            EOIid,
            EOIpayment_id,
            AppID,
            pay_id,
            REF,
            NPREF,
            NameofEntity,
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
            GST,
            bankname,
            acno,
            acname,
            ifsc
            } = req.body;

        const date = moment().format('Do MMMM, YYYY');
    if((v.validate(req.body, schemaUSER)) === true) {
        var sql = `INSERT INTO ${CONFIG.tb_usr} (login_mail,
            login_pass,
            EOIid,
            EOIpayment_id,
            AppID,
            pay_id,
            REF,
            NPREF,
            NameofEntity,
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
            GST,
            bankname,
            acno,
            acname,
            ifsc,
            date) VALUES ?`;
        var values = [[login_mail,
            login_pass,
            EOIid,
            EOIpayment_id,
            AppID,
            pay_id,
            REF,
            NPREF,
            NameofEntity,
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
            GST,
            bankname,
            acno,
            acname,
            ifsc,
            date]];
        mysqlConnection.query(sql, [values], function (err, result) {
            if (!err) {
                ///
                mysqlConnection.query(`SELECT * FROM ${CONFIG.tb_usr} WHERE AppID = ${AppID}`, (err, data, fields) => {
                if (!err){
                    res.json({ status: true, "count": data.length, "data": data[0] });
                    let mailvalues = {
                        from : req.body.from,
                        pass : req.body.pass,
                        tomail : req.body.EmailofAuthorisedSig,
                        subject : `Registration ${req.body.partner} Application Confirmation.`,
                        personName : req.body.NameofAuthorisedSig,
                        logo : req.body.logo,
                        content : `Thank you for registration as  ${req.body.partner}. Here is your Application id = ${req.body.AppID} and your Unique Ref Code is ${req.body.REF}`
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
        res.status(422).json({"status": 'fail', "message": v.validate(req.body, schemaUSER)});
    } 
}



exports.postPaymentREG = (req, res) => {
    if((v.validate(req.body, schemaPaymentUSER)) === true) {

        mysqlConnection.query(`UPDATE ${CONFIG.tb_usr} SET pay_id='${req.body.pay_id}' WHERE id='${req.body.id}'`, function (err, result) {
            if (err) {
                res.status(422).json("mySQL connection Error");
            }else{
                
                mysqlConnection.query(`SELECT * FROM ${CONFIG.tb_usr} WHERE id=${req.body.id}`, (err, data, fields) => {
                    if (!err) {
                        res.json({"status": 'success', "message": "REG Payment Recieved Successfully"});
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




exports.laterREGCheck = (req, res) => {
    mysqlConnection.query(`SELECT * FROM ${CONFIG.tb_usr} WHERE AppID=${req.body.AppID} AND partner= '${req.body.type}' AND pay_id IS NULL`, (err, data, fields) => {
        if (!err) {
            res.json({ status: true, "count": data.length, "data": data[0] });
        }
        else
            res.status(422).json("mySQL connection Error");
    })
}


exports.regApprove = function (req, res) {
    var redirectAddress;
    const { id } = req.query;
    mysqlConnection.query(`SELECT * FROM ${CONFIG.tb_usr} WHERE id=${id}`, (err, data, fields) => {
        if(data[0].partner == "Implementing Partner"){
            redirectAddress = 'reg-ip?ContactofAuthorisedSig=&State=&Status';
        }else{
            redirectAddress = 'reg-np?ContactofAuthorisedSig=&State=&Status';
        }
        let currentstatus = ''
        if(data[0].status == 1){
            currentstatus = 0
        }else{
            currentstatus = 1
        }
        if (!err) {
            mysqlConnection.query(`UPDATE ${CONFIG.tb_usr} SET status=${currentstatus}  WHERE id='${id}' `, (err, data, fields) => {
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
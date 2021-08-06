const mysqlConnection = require('../db/connection');
const CONFIG = require('../config/conf');
const Validator = require("fastest-validator");
const v = new Validator();
const schemaContactForm = require('../Validations/contactSchema');
const mailservice = require('../mail');
exports.postCONTACT  = (req, res) => {
    try{
        const { name, organization, phone, email, subject, message, website } = req.body;
        if((v.validate(req.body, schemaContactForm)) === true) {
            
            var sql = `INSERT INTO ${CONFIG.tb_contact_query} (Name, Organization, Phone, Email, Subject, Message, Website) VALUES ?`;
            var values = [[name, organization, phone, email, subject, message, website]]
            mysqlConnection.query(sql, [values], function (err, result) {
                if (err) console.log(err)
                res.json({"status": 'success', "message": "Contact Form Posted Successfully"});
                let mailvalues = {
                    from : req.body.from,
                    pass : req.body.pass,
                    tomail : req.body.email,
                    subject : `Query Posted Successfully.`,
                    personName : req.body.name,
                    logo : req.body.logo,
                    content : `We have recieved your application. Soon we will get back to you.`
                }
                mailservice.MAIL(mailvalues);
            });
            
        }else{
            res.status(422).json({"status": 'fail', "message": v.validate(req.body, schemaContactForm)}); 
        } 
    }catch(err){
        res.status(422).json({"status": 'fail', "message": err});
        return ;

    }
}
exports.viewCONTACTquery = (req, res) => {
    let params = req.query;
    let searchvalues  = '';
    if(params.Phone != ''){
        searchvalues+=` and Phone = '${params.Phone}'`
    }
    if(params.Website != ''){
        searchvalues+=` and Website = '${params.Website}'`
    }
    mysqlConnection.query(`SELECT * FROM ${CONFIG.tb_contact_query} WHERE 1=1 ${searchvalues}`, (err, data, fields) => {
        if (!err)
        res.render('contact-query.ejs', { title: 'Contact Query', contactQueryData: data, search:params, cookies : req.cookies })
        else
            res.status(424).json({status:false, "message": err});
    })
}



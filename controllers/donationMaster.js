const mysqlConnection = require('../db/connection');
const CONFIG = require('../config/conf');
const Validator = require("fastest-validator");
const v = new Validator();
const schemaDonationForm = require('../Validations/donationSchema');
exports.postDONATION  = (req, res) => {
    try{
        const { name, phone, email, address, pan, amount, payment_id, website } = req.body;
        if((v.validate(req.body, schemaDonationForm)) === true) {
            
            var sql = `INSERT INTO ${CONFIG.tb_donation} (name, phone, email, address, pan, amount, payment_id, website, date) VALUES ?`;
            var values = [[name, phone, email, address, pan, amount, payment_id, website, new Date()]]
            mysqlConnection.query(sql, [values], function (err, result) {
                if (err) console.log(err)
                res.json({"status": 'success', "message": "Donation Form Posted Successfully"});
          
            });
            
        }else{
            res.status(422).json({"status": 'fail', "message": v.validate(req.body, schemaDonationForm)}); 
        } 
    }catch(err){
        res.status(422).json({"status": 'fail', "message": err});
        return ;

    }
}
exports.viewDONATION = (req, res) => {
    let params = req.query;
    let searchvalues  = '';
    if(params.Phone != ''){
        searchvalues+=` and phone = '${params.Phone}'`
    }
    if(params.Website != ''){
        searchvalues+=` and website = '${params.Website}'`
    }
    mysqlConnection.query(`SELECT * FROM ${CONFIG.tb_donation} WHERE 1=1 ${searchvalues}`, (err, data, fields) => {
        if (!err)
        res.render('donation-listing.ejs', { title: 'Donation Listing', donationData: data, search:params , cookies : req.cookies})
        else
            res.status(424).json({status:false, "message": err});
    })
}



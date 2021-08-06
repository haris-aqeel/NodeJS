const mysqlConnection = require('../db/connection');
const CONFIG = require('../config/conf');
exports.getSTATE = function (req, res) {
    mysqlConnection.query(`SELECT * FROM ${CONFIG.tb_state}`, (err, data, fields) => {
        if (!err)
        res.json({status:true,"count": data.length ,"data":data});
        else
            res.status(424).json({status:false, "message": err});
    })
}
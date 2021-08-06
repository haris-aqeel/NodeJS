const mysqlConnection = require('../db/connection');
const CONFIG = require('../config/conf');
const jwt = require('jsonwebtoken');
exports.loginPage = (req, res) => {
    try {
        const token = req.cookies.jwt;
        if (token) {
            jwt.verify(token, 'net ninja secret', (err, decodedToken) => {
                if (err) {
                    res.render('login.ejs');
                } else {
                    res.redirect('/dashboard')
                }
            });
        } else {
            res.render('login.ejs');
        }
    } catch (err) {
        res.render('login.ejs');
    }
}
var createToken = (id) => {
    return jwt.sign({ id }, 'net ninja secret');
};

exports.postLogin = (req, res) => {
    const { login_mail, login_pass, partnercoming } = req.body;
    let partner = partnercoming.split(',')[0]
    let checktable = partnercoming.split(',')[1];
    let sql = `SELECT * FROM ${checktable}`
    console.log(sql)
    mysqlConnection.query(sql, (err, data, fields) => {
        if (!err) {
            if (data[0].login_mail == login_mail && data[0].login_pass == login_pass && data[0].partner == partner) {
                const token = createToken(login_mail);
                res.cookie('jwt', token, { httpOnly: true });
                res.cookie('login_mail', login_mail, { httpOnly: true });
                res.cookie('partner', partner, { httpOnly: true });
                res.cookie('UID', data[0].id, { httpOnly: true });
                res.cookie('REF', data[0].REF, { httpOnly: true });
                res.redirect('/dashboard');
                return true;
            } else {
                res.cookie('jwt', undefined, { httpOnly: true });
                res.cookie('login_mail', undefined, { httpOnly: true });
                res.cookie('partner', undefined, { httpOnly: true });
                res.cookie('UID', undefined, { httpOnly: true });
                res.cookie('REF', undefined, { httpOnly: true });
                res.redirect('/?success=true');
                return null;
            }
        }
        else {
            res.redirect('/?success=true');
            return null;
        }
    })
}
exports.logout = (req, res) => {
    res.cookie('jwt', undefined, { httpOnly: true });
    res.cookie('login_mail', undefined, { httpOnly: true });
    res.cookie('partner', undefined, { httpOnly: true });
    res.cookie('UID', undefined, { httpOnly: true });
    res.cookie('REF', undefined, { httpOnly: true });
    res.redirect('/')
}


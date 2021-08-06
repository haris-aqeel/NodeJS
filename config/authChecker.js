const jwt = require('jsonwebtoken');
const authChecker = (req, res, next) => {

   try{     
         const token = req.cookies.jwt;
         if (token) {
           jwt.verify(token, 'net ninja secret', (err, decodedToken) => {
             if (err) {
               res.redirect('/');
               return false;
             } else {
               next();
               return true;
             }
           });
         } else {
            res.redirect('/');
            return false;
         }
   }catch(err){
      res.redirect('/');
      return false;
   }   
};

module.exports = authChecker ;
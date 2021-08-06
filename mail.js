const nodemailer = require('nodemailer');
exports.MAIL = async(mailvalues) => {
  const emailerbody = `<table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td width="100%" align="center" valign="top" bgcolor="#eeeeee" height="20"></td></tr><tr><td bgcolor="#eeeeee" align="center" style="padding:0px 15px 0px 15px" class="m_7164643622599031317section-padding"><table bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px" class="m_7164643622599031317responsive-table"><tbody><tr><td><table width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td align="center" style="padding:40px 40px 0px 40px"> <img src="${mailvalues.logo}" width="70" border="0" style="vertical-align:middle" class="CToWUd"></td></tr><tr><td align="center" style="font-size:18px;color:#0e0e0f;font-weight:700;font-family:Helvetica Neue;line-height:28px;vertical-align:top;text-align:center;padding:35px 40px 0px 40px"> <strong>Thank you for Application</strong></td></tr><tr><td align="center" bgcolor="#ffffff" height="1" style="padding:40px 40px 5px" valign="top" width="100%"><table cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td style="border-top:1px solid #e4e4e4"></td></tr></tbody></table></td></tr><tr><td class="m_7164643622599031317content" style="font:16px/22px 'Helvetica Neue',Arial,'sans-serif';text-align:left;color:#555555;padding:40px 40px 0 40px"><p>Hi ${mailvalues.personName},</p><p>${mailvalues.content}</p><p>Thanks</p></td></tr><tr><td></td></tr></tbody></table></td></tr><tr><td width="100%" align="center" valign="top" bgcolor="#ffffff" height="45"></td></tr></tbody></table></td></tr><tr><td bgcolor="#eeeeee" align="center" style="padding:20px 0px"><table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" style="max-width:600px" class="m_7164643622599031317responsive-table"><tbody><tr></tr><tr><td bgcolor="#eeeeee" align="center"></td></tr></tbody></table></td></tr></tbody></table>`
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: mailvalues.from,
                pass: mailvalues.pass
            }
        });
        var mailOptions = {
          to: mailvalues.tomail,
          subject: mailvalues.subject,
          html: emailerbody
        };
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
}
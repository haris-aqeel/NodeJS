const niceInvoice = require("nice-invoice");
const nodemailer = require('nodemailer');
var moment = require('moment');
exports.INVOICED = async(invoiceoptions) => {
  const invoiceDetail = {
    shipping: {
      name: invoiceoptions.personName,
      address: invoiceoptions.address,
      city: "--",
      state: "--",
      country: "--",
      postal_code: 94111
    },
    items: invoiceoptions.item,
    total: parseInt(invoiceoptions.TotalAmount),
    order_number: Math.floor(Math.random() * 90000) + 10000,
    header:{
        company_name: invoiceoptions.myORG,
        company_logo: "logo.png",
        company_address: invoiceoptions.company_address,
    },
    footer:{
      text: "--"
    },
    currency_symbol:"Rs ", 
    date: {
      billing_date: moment(new Date()).format('Do MMMM, YYYY'),
      due_date: "No Due Date",
    }
};


niceInvoice(invoiceDetail, 'your-invoice-priti.pdf')
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: invoiceoptions.from,
        pass: invoiceoptions.pass  
    }
  });
  
  var mailOptions = {
    to: invoiceoptions.to,
    subject: invoiceoptions.subject,
    text: 'Please find your attached invoice.',
    attachments: [
        {
            filename: 'invoice.pdf', 
            path: __dirname + "/your-invoice-priti.pdf",
        }]
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
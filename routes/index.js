const router = require('express').Router();
const master = require('../controllers/Master')
const masterJOB = require('../controllers/jobMaster')
const masterCONTACT = require('../controllers/contactMaster')
const mastereoi = require('../controllers/eoiMaster');
const masterusr = require('../controllers/userMaster');
const mastercen = require('../controllers/cenMaster');
const masterDONATION = require('../controllers/donationMaster');
const masterNOTICE = require('../controllers/noticeMaster');
const masterDOMAIN = require('../controllers/domainMaster');
const masterCOURSE = require('../controllers/courseMaster');
const base = "/api/v1/";
router.post(`${base}POSTdonation`, masterDONATION.postDONATION);
router.post(`${base}POSTcontact`, masterCONTACT.postCONTACT);
router.post(`${base}POSTjob`, masterJOB.postJOB);
router.get(`${base}State`, master.getSTATE);
router.get(`${base}GETjoblistings`, masterJOB.viewJOBlistingAPI);
router.get(`${base}GETdomainlistings`, masterDOMAIN.viewDOMAINlistingAPI);
router.get(`${base}GETnoticelistings`, masterNOTICE.viewNOTICElistingAPI);
router.get(`${base}GETcourselistings`, masterCOURSE.viewCOURSElistingAPI);


router.post(`${base}POSTeoi`, mastereoi.postEOI);
router.post(`${base}EOICheck`, mastereoi.EOIcheck);
router.post(`${base}UPDATEeoi`, mastereoi.postPaymentEOI);
router.post(`${base}LATEReoiCheck`, mastereoi.laterEOICheck);

router.post(`${base}POSTreg`, masterusr.postREG);
router.post(`${base}LATERegCheck`, masterusr.laterREGCheck);
router.post(`${base}UPDATEreg`, masterusr.postPaymentREG);


router.post(`${base}POSTcen`, mastercen.postCEN);
router.post(`${base}LATECenCheck`, mastercen.laterCENCheck);
router.post(`${base}UPDATECen`, mastercen.postPaymentCEN);

module.exports = router;

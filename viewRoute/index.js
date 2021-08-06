const router = require('express').Router();
const masterCONTACT = require('../controllers/contactMaster')
const masterJOB = require('../controllers/jobMaster')
const masterEOI = require('../controllers/eoiMaster')
const masterDONATION = require('../controllers/donationMaster');
const masterNOTICE = require('../controllers/noticeMaster');
const masterDOMAIN = require('../controllers/domainMaster');
const masterCOURSE = require('../controllers/courseMaster');
const masterusr = require('../controllers/userMaster');
const mastercen = require('../controllers/cenMaster');
const masterStudiesCase = require('../controllers/caseStudiesMaster');
const countryMaster = require('../controllers/countryMaster');
const guidelineMaster = require('../controllers/guidelineMaster');
const studentMaster = require('../controllers/studentMaster');
const batchesMaster = require('../controllers/batchesMaster');


const login = require('../controllers/login')
const dashboard = require('../controllers/dashboardMaster')
const auth = require('../config/authChecker');


router.get("/", login.loginPage);
router.post("/", login.postLogin);
router.get("/logout",auth, login.logout); 
router.get("/dashboard",auth, dashboard.dashboardPage);

router.get("/studentsadd",auth,studentMaster.createstudent);
router.post("/studentsadd",auth,studentMaster.poststudent);
router.get("/studentslisting",auth, studentMaster.studentlisting);
router.get("/studentslisting/:id",auth, studentMaster.deleteStudent);

router.get("/batchlisting", auth , batchesMaster.batchlisting);
router.get("/batchcreate",auth, batchesMaster.createBATCH);
router.get("/batchlisting/:id",auth, batchesMaster.deleteBatch);
router.post("/batchcreate",auth, batchesMaster.postBatch);


router.get("/caselisting", auth , masterStudiesCase.caseListing);
router.get("/casecreate",auth, masterStudiesCase.createCase);
router.post("/casecreate",auth, masterStudiesCase.postCase);
router.get("/caselisting/:id",auth, masterStudiesCase.deleteCase);

router.get("/countrylisting", auth , countryMaster.countryListing);
router.get("/countrycreate",auth, countryMaster.createCountry);
router.post("/countrycreate",auth, countryMaster.postCountry);
router.get("/countrylisting/:id",auth, countryMaster.deleteCountry);

router.get("/guidelinelisting", auth , guidelineMaster.guidelineListing);
router.get("/guidelinecreate",auth, guidelineMaster.createGuideline);
router.post("/guidelinecreate",auth, guidelineMaster.postGuideline);
router.get("/guidelinelisting/:id",auth, guidelineMaster.deleteGuideline);


router.get("/contact",auth, masterCONTACT.viewCONTACTquery);
router.get("/donation",auth, masterDONATION.viewDONATION);
router.get("/job",auth, masterJOB.viewJOBquery);
router.get("/joblisting",auth, masterJOB.viewJOBlisting);
router.get("/jobcreate",auth, masterJOB.createJOB);
router.post("/jobcreate",auth, masterJOB.postCreateJOB);





router.get("/eoi-np",auth, masterEOI.viewEOInp);
router.get("/eoi-ip",auth, masterEOI.viewEOIip);
router.get("/eoiApprove",auth, masterEOI.eoiApprove);
router.get("/myEOIapplication",auth, masterEOI.myEOIapplication);



router.get("/reg-np",auth, masterusr.viewREGnp);
router.get("/reg-ip",auth, masterusr.viewREGip);
router.get("/regApprove",auth, masterusr.regApprove);
router.get("/myUSERapplication",auth, masterusr.myUSERapplication);
router.get("/myippartners",auth, masterusr.myippartners);



router.get("/reg-center",auth, mastercen.viewCEN);
router.get("/cenApprove",auth, mastercen.cenApprove);
router.get("/mycenters",auth, mastercen.mycenters);

router.get("/joblistings",auth, masterJOB.jobStatus);
router.get("/joblistingsdelete",auth, masterJOB.jobStatusDelete);



router.get("/noticelisting",auth, masterNOTICE.viewNOTICElisting);
router.get("/noticecreate",auth, masterNOTICE.createNOTICE);
router.get("/noticelistings",auth, masterNOTICE.noticeStatus);
router.get("/noticelistingsdelete",auth, masterNOTICE.noticeStatusDelete);
router.post("/noticecreate",auth, masterNOTICE.postCreateNOTICE);


router.get("/domainlisting",auth, masterDOMAIN.viewDOMAINlisting);
router.get("/domaincreate",auth, masterDOMAIN.createDOMAIN);
router.get("/domainlistings",auth, masterDOMAIN.domainStatus);
router.get("/domainlistingsdelete",auth, masterDOMAIN.domainStatusDelete);
router.post("/domaincreate",auth, masterDOMAIN.postCreateDOMAIN);

router.get("/courselisting",auth, masterCOURSE.viewCOURSElisting);
router.get("/coursecreate",auth, masterCOURSE.createCOURSE);
router.get("/courselistings",auth, masterCOURSE.courseStatus);
router.get("/courselistingsdelete",auth, masterCOURSE.courseStatusDelete);
router.post("/coursecreate",auth, masterCOURSE.postCreateCOURSE);



router.get("/changePassword",auth, masterusr.changePassword);
router.post("/changePassword",auth, masterusr.POSTchangePassword);


module.exports = router;
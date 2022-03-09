const express = require('express');
const Router = express.Router();
const membersController = require('../controllers/membersController');
const contributionsController = require('../controllers/contributionsController');
const officialsController = require('../controllers/officialsController');

//HANDLERS FOR GET AND POST REQUESTS
Router.get('/',membersController.getLoginPage);
Router.get('/resetPassword',membersController.getPasswordResetPage);
Router.post('/resetPassword',membersController.changeUserPassword);
Router.post('/dashboard',membersController.loginFunction);
Router.get('/request',membersController.joinRequestFunction);
Router.post('/request',membersController.savingJoinRequest);
Router.get('/logout',membersController.loggedInChecker,membersController.logoutFunction);

//HANDLING PAGE REQUEST FOR THE MAINBODY FUNCTIONALITY
Router.get('/dashboard',membersController.loggedInChecker,membersController.getDashboardFunction);
Router.get('/loans',membersController.loggedInChecker,membersController.getLoansPage);
Router.post('/loanApplications',membersController.loggedInChecker,membersController.recordLoanApplication);
Router.post('/loans/approvals',membersController.loggedInChecker,membersController.recordApproval);  
Router.post('/editLoan',membersController.loggedInChecker,membersController.editLoan);  
Router.post('/loans/:decliner',membersController.loggedInChecker,membersController.guarantorDeclineFunction);  
Router.get('/loanWithGuarantors',membersController.loggedInChecker,membersController.getLoanApplications);
Router.get('/alerts',membersController.loggedInChecker,membersController.getAlertsPage);
Router.get('/committeeApproval/:loanId',membersController.loggedInChecker,membersController.committeeStageLoans);

//HANDLING THE CONTRIBUTION PAGE REQUESTS.
Router.get('/contributions',membersController.loggedInChecker,officialsController.authorizedChecker,contributionsController.getContributionPage);
Router.get('/checkLoanPresence/:loaneePhone',membersController.loggedInChecker,contributionsController.checkLoanPresence);
Router.post('/postContribution',membersController.loggedInChecker,contributionsController.postContribution);


 
module.exports=Router;
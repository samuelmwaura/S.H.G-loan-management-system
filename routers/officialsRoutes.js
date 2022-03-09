const express = require('express');
const Router = express.Router();
const officialsController = require('../controllers/officialsController');
const membersController = require('../controllers/membersController');

Router.get('/createUser',membersController.loggedInChecker,officialsController.authorizedChecker,officialsController.getUserCreationpage);
Router.post('/registerUser',membersController.loggedInChecker,officialsController.authorizedChecker,officialsController.creatingNewUser);
Router.post('/postingLoan',membersController.loggedInChecker,officialsController.postLoan);
Router.post('/decliningLoan',membersController.loggedInChecker,officialsController.declineLoan);
Router.post('/createOfficial',membersController.loggedInChecker,officialsController.authorizedChecker,officialsController.createOfficial);
Router.post('/editOfficial',membersController.loggedInChecker,officialsController.authorizedChecker,officialsController.editOfficial);

//REPORT REQUEST HANDLERS
Router.get('/reports',membersController.loggedInChecker,officialsController.getReportsPage);
module.exports=Router;
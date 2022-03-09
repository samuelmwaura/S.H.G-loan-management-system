const express= require('express');
const Router= express.Router()
const membersController=require('../controllers/membersController');
const membersPageController=require('../controllers/membersPageController');


Router.get('/fetchExistingUser/:firstName',membersController.loggedInChecker,membersPageController.getExistingMember);
Router.get('/fetchExistingRequest/:firstName',membersController.loggedInChecker,membersPageController.getExistingRequest);
Router.post('/createMember',membersController.loggedInChecker,membersPageController.createMember);
Router.post('/editMember',membersController.loggedInChecker,membersPageController.editMember);
Router.post('/deleteMember',membersController.loggedInChecker,membersPageController.deleteMember);
Router.get('/errorPage',membersController.loggedInChecker,membersPageController.getErrorPage);



//HANDLING THE MEMBERSPANEL  PAGE REQUESTS
Router.get('/memberspanel',membersController.loggedInChecker,membersPageController.getMembersPage);

module.exports=Router;
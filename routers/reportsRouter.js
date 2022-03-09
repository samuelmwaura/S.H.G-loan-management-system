const express= require('express');
const Router= express.Router()
const reportsController=require('../controllers/reportsController');

Router.get('/outstandingLoansReport',reportsController.outstandingLoansReportFunction);
Router.get('/declinedLoansReport',reportsController.declinedLoansReportFunction);
Router.get('/loansInProgressReport',reportsController.LoansInProgressReportFunction);
Router.get('/memberFinancesReport',reportsController.memberFinancesReportFunction);

module.exports=Router;
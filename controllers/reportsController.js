const {request, member, user,outstandingLoan,official,loan,approval}= require('../models/databaseModels');
const pdfMakerController=require('./pdfMakerController');

//GETTING THE OUTSTANDING LOANS REPORT
const outstandingLoansReportFunction=(req,res)=>{
    const stream = res.writeHead(200,{
        'Content-Type':'application/pdf',
        'Content-Disposition':'attachment;filename=Outstanding_Loans.pdf'
    });
    pdfMakerController.buildOutstandingLoansPdf((chunk)=>stream.write(chunk), ()=>stream.end());
}

//DECLINED LOANS REPORT
const declinedLoansReportFunction=(req,res)=>{
    const stream = res.writeHead(200,{
        'Content-Type':'application/pdf',
        'Content-Disposition':'attachment;filename=Declined_Loans.pdf'
    });
    pdfMakerController.buildDeclinedLoansPdf((chunk)=>stream.write(chunk), ()=>stream.end());
}


//LOANS IN PROGRESS REPORT
const LoansInProgressReportFunction=(req,res)=>{
    const stream = res.writeHead(200,{
        'Content-Type':'application/pdf',
        'Content-Disposition':'attachment;filename=Loans_in_progress_Report.pdf'
    });
    pdfMakerController.buildLoansInProgresspdf((chunk)=>stream.write(chunk), ()=>stream.end());
}


const memberFinancesReportFunction=(req,res)=>{

    const stream = res.writeHead(200,{
        'Content-Type':'application/pdf',
        'Content-Disposition':'attachment;filename=Member_Finances_Report.pdf'
    });
    pdfMakerController.buildMemberFinancespdf((chunk)=>stream.write(chunk), ()=>stream.end());
}

module.exports = {
    outstandingLoansReportFunction,
    declinedLoansReportFunction,
    LoansInProgressReportFunction,
    memberFinancesReportFunction

}


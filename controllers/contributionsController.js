const {user,request,loan, member,approval, official,outstandingLoan}= require('../models/databaseModels');
const sequelize = require('../database/connection');
const req = require('express/lib/request');

const getContributionPage =(req,res)=>{
    member.findAll({
        attributes:[[sequelize.fn('sum',sequelize.col('savings')),'totalSavings'],[sequelize.fn('sum',sequelize.col('welfare')),'totalWelfare']]
    }).then(summationResults=>{
        console.log(summationResults);
        summationResults=summationResults.map(a=>a.dataValues);
        outstandingLoan.findAll({attributes:[[sequelize.fn('sum',sequelize.col('amount')),'totalLoans']]}).then(totalLoans=>{
            totalLoans=totalLoans.map(a=>a.dataValues);
            console.log(totalLoans)
            member.findAll().then(members=>{
                res.render('./membersFiles/contributions',{member:req.session.loggedInUser,summations:summationResults,totalLoans:totalLoans,members});
            }).catch(err=>{console.log(err)});

    //  res.render('./membersFiles/dashboard',{member:req.session.loggedInUser,figures:systemUser,borrower:borrower,summations:summationResults,totalLoans:totalLoans});
        }).catch(err=>console.log(err));
    }).catch(err=>console.log(err));

}


const checkLoanPresence=(req,res)=>{    
    console.log(req.params.loaneePhone);
  outstandingLoan.findOne({where:{loaneePhone:req.params.loaneePhone}}).then(result=>{
      if(result){
          res.json({loanPresenceIndicator:`Has a loan of ${result.amount}`})
      }else{
        res.json({loanPresenceIndicator:`Has no loan`});
      }
  }).catch();
}


const postContribution=(req,res)=>{
console.log(req.body);
member.findOne({where:{phone:req.body.member}}).then(member=>{
    
    let savings=parseInt(req.body.savings);
    let welfare=parseInt(req.body.welfare);

    savings+=member.savings;
    welfare+=member.welfare;
member.update({savings:savings,welfare},{where:{phone:req.body.member}}).then(()=>{
if(req.body.loan){
outstandingLoan.findOne({where:{loaneePhone:req.body.member}}).then(loan=>{
    let amount=parseInt(req.body.loan);
    amount+=loan.amount;
    outstandingLoan.update({amount},{where:{loaneePhone:req.body.member}}).then(()=>{
        res.redirect('/dashboard');
    }).catch(err=>console.log(err));
}).catch(err=>console.log(err));
}
}).catch(err=>console.log(err));
}).catch(err=>console.log(err));
}

module.exports={
getContributionPage,
checkLoanPresence,
postContribution
}
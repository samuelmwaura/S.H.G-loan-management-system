const {user,request,loan, member,approval, official,outstandingLoan}= require('../models/databaseModels');
const bcrypt = require('bcryptjs');
const sequelize = require('../database/connection');
const {newMessage} = require('../atMessaging');

//RENDERING THE LOGGEDINPAGE
const getLoginPage=(req,res)=>res.render('./loginandOutfiles/login',{message:''});

//RENDERING THE PASSWORD RESET PAGE
const getPasswordResetPage=(req,res)=>{
    res.render('./loginandOutfiles/passwordResetPage.ejs',{message:''});

}

const changeUserPassword=(req,res)=>{
  user.findOne({where:{userName:req.body.userName}}).then(async result=>{
     if(await bcrypt.compare(req.body.password,result.password)){
         const newPassword= await bcrypt.hash(req.body.newPassword,10);
         user.update({password:newPassword},{where:{userName:req.body.userName}}).then(()=>{
    res.render('./loginandOutfiles/passwordResetPage.ejs',{message:'<p class="error" style="color:green;font-size:18px;">Password Changed Successfully.</p> '});
         }).catch(err=>console.log(err));
     }else{

     }
  }).catch(err=>console.log(err));
}


//ChECKING THAT A USER IS LOGGED IN
const loggedInChecker=(req,res,next)=>{
    if(req.session.loggedInUser){
        next();
    }else{
res.render('./loginandOutfiles/login',{message:''});
    }
}

//HANDLING THE LOGIN FUNCTIONALITY
const loginFunction=(req,res)=>{
    const userName=req.body.userName;
    const password=req.body.password;
    user.findOne({where:{userName:userName}}).then( async result=>{//we are using the user model here  user.user
        if(result){
            if(await bcrypt.compare(password,result.password)){
       req.session.loggedInUser=result;
       console.log(req.session);
       res.redirect('/dashboard');
       
      // res.render('index',{member:req.session.loggedInUser}); 
       //res.render('./membersFiles/dashboard',{member:req.session.loggedInUser.userName});
        } else{
       res.render('./loginandOutfiles/login',{message:'Username or Password incorrect!'});
        }
        }else{
        res.render('./loginandOutfiles/login',{message:'Username or Password incorrect!'});
    }
    }).catch(error=>console.log(error));  
    }

const joinRequestFunction=(req,res)=>{
    res.render('./loginandOutfiles/request',{message:'',confirmation:''});
}

//HANDLER FOR SENDING THE JOINING REQUEST
const savingJoinRequest=(req,res)=>{
    request.findOne({where:{phone:req.body.phone}}).then((result)=>{
    if(result){
    res.render('./loginandOutfiles/request',{message:"<small class='error' style='font-weight:900'>A request by that number is already in.</small>",confirmation:''});
    }else{
    request.create(req.body).then(result=>{
        console.log(result)
        res.render('./loginandOutfiles/request',{message:'',confirmation:'<span class="material-icons" style="color:green">check_circle</span>Request Submitted Successfully.Please wait to be contacted.<br><small>Already a member?</small><a href="/">Login.</a>'});
    }).catch(error=>console.log(error));
    }
    }).catch(error=>console.log(error));
    }


//GETTING THE DASHBOARD
const getDashboardFunction=(req,res)=>{
    member.findOne({where:{phone:req.session.loggedInUser.memberPhone}}).then(systemUser=>{
        outstandingLoan.findOne({where:{loaneePhone:req.session.loggedInUser.memberPhone}}).then(borrower=>{
          member.findAll({
              attributes:[[sequelize.fn('sum',sequelize.col('savings')),'totalSavings'],[sequelize.fn('sum',sequelize.col('welfare')),'totalWelfare']]
          }).then(summationResults=>{
              console.log(summationResults);
              summationResults=summationResults.map(a=>a.dataValues);
              outstandingLoan.findAll({attributes:[[sequelize.fn('sum',sequelize.col('amount')),'totalLoans']]}).then(totalLoans=>{
                  totalLoans=totalLoans.map(a=>a.dataValues);
                  console.log(totalLoans)
                res.render('./membersFiles/dashboard',{member:req.session.loggedInUser,figures:systemUser,borrower:borrower,summations:summationResults,totalLoans:totalLoans});
              }).catch(err=>console.log(err));
          }).catch(err=>console.log(err));
        }).catch(err=>console.log(err));
       }).catch(err=>console.log(err)); 
  // res.render('./membersFiles/dashboard',{member:req.session.loggedInUser});   
   //res.render('index',{member:req.session.loggedInUser}); 
}


//GETTING THE LOANS PAGE
const getLoansPage=(req,res)=>{
loan.findOne({where:{memberPhone:req.session.loggedInUser.memberPhone}}).then(hasLoan=>{
if(hasLoan){
    member.findAll().then(guarantors=>res.render('./membersFiles/loans',{member:req.session.loggedInUser,validation:'',guarantors:guarantors,hasLoan:hasLoan})).catch(err=>console.log(err));
}else{
    member.findAll().then(guarantors=>res.render('./membersFiles/loans',{member:req.session.loggedInUser,validation:'',guarantors:guarantors,hasLoan:{}})).catch(err=>console.log(err));
}
}).catch(err=>console.log(err));
}

//SAVING A MEMBERS LOAN APPLICATION
const recordLoanApplication =(req,res)=>{
   console.log(req.body);
   if(req.body.guarantor1!==req.body.guarantor2&&req.body.guarantor1!==req.body.guarantor3&&req.body.guarantor2!==req.body.guarantor3){
   user.findOne({where:{userName:req.body.applicant}}).then(applicant=>{
       member.findOne({where:{phone:applicant.memberPhone}}).then(borrower=>{
        if(borrower.savings<=(req.body.amount/3)){        
        member.findAll().then(guarantors=>{
            res.render('./membersFiles/loans',{member:req.session.loggedInUser,validation:`<small style="color:red">Request amount maximum is three times your Savings.<br>Your savings are Kshs:${borrower.savings}!!</small><br>`,guarantors:guarantors,hasLoan:{}});
        }).catch(err=>console.log(err));
           }else{
            loan.findOne({where:{memberPhone:applicant.memberPhone}}).then(result=>{
            if(result){
            member.findAll().then(guarantors=>{
                res.render('./membersFiles/loans',{member:req.session.loggedInUser,validation:'<small style="color:red">You Already have a loan applied!!</small><br>',guarantors:guarantors,hasLoan:{}});
            }).catch(err=>console.log(err));
            }else{
            const newLoan={loan_type:req.body.loan_type,Amount:req.body.amount,purpose:req.body.purpose,chartels:req.body.chartels,guarantor1:req.body.guarantor1,guarantor2:req.body.guarantor2,guarantor3:req.body.guarantor3,memberPhone:borrower.phone}; 
           loan.create(newLoan).then(result=>{

            //SENDING NOTIFICATIONS TO ALL THE MEMBERS TO APPROVE THE LOAN
               member.findAll().then(allMmembers=>{
                const notification ="There is a new Loan applied by' "+ borrower.firstName +" "+ borrower.lastName + "'.Please login and approve the Loan.";
                allMmembers.forEach(member=>{
                if(member.firstName===req.body.guarantor1||member.firstName===req.body.guarantor2||member.firstName===req.body.guarantor3){
                const receiptNumber ="+254"+member.phone;
                const messageObject ={to:receiptNumber,message:notification,from:"Joymakers"};                
                newMessage.SMS.send(messageObject).then(()=>console.log(`Messages sent to ${member.lastName}.`)).catch(err=>console.log(err));;
                }
                   });
                res.render('./membersFiles/loans',{member:req.session.loggedInUser,validation:'<small style="color:green">Loan applied successfully.<br>Please wait for your gurantors to approve.</small>',guarantors:allMmembers,hasLoan:{}});
               }).catch(err=console.log(err));
            
        }).catch(err=>console.log(err=>{
            res.render('./membersFiles/loans',{member:req.session.loggedInUser,validation:'<small style="color:red">Guarantor has Guranteed too many Loans<br>Please wait for your guarantors to approve.</small>',guarantors:[],hasLoan:{}});

        }));
        }
            }).catch(err=>console.log(err));
        }
       })
   })
}else{
    member.findAll().then(guarantors=>{
        res.render('./membersFiles/loans',{member:req.session.loggedInUser,validation:'<small style="color:red">You cannot choose the same guarantors or<br> choose yourself as your guarantor.</small>',guarantors:guarantors});
    }
    ).catch(err=>conskole.log(err));
}
}
//GETTING ALL LOAN APPLICATIONS WAITING TO GET APPROVALS
const getLoanApplications=(req,res)=>{
loan.findAll().then(allLoans=>{
approval.findOne({where:{approver:req.session.loggedInUser.userName}}).then(result=>{   
    if(result){
    res.json({applications:allLoans,loggedInUser:req.session.loggedInUser.userName,alreadyApprover:result});    
    }
    else{
        res.json({applications:allLoans,loggedInUser:req.session.loggedInUser.userName,alreadyApprover:{}});
    }
}).catch(err=>console.log(err));
}).catch(err=> console.log(err));

}

//RECORDING A LOAN APPROVAL
const recordApproval=(req,res)=>{
   console.log(req.method);
   console.log(req.body);
    approval.findOne({where:{approver:req.body.approver,loanLoanId:req.body.loanId}}).then(result=>{
        if(result){
         res.json({result:result,alert:`You already have approved loan of  Id ${req.body.loanId}.`,redirect:'/dashboard'});
        }else{
          const newApproval={approver:req.body.approver,loanLoanId:req.body.loanId};
          approval.create(newApproval).then((result)=>{
            res.json({result:result,alert:`Loan of Id ${req.body.loanId}. approved successfully`,redirect:'/dashboard'});
          }).catch(err=>console.log(err));
          
        }
    }
    ).catch(err=>console.log(err));  
}
//HANDLING A DECLINE BY A LOAN GUARANTOR
const guarantorDeclineFunction=(req,res)=>{
    console.log(req.body);
    loan.update({[req.body.guarantorColumn]:'declined',declined:'yes'},{where:{[req.body.guarantorColumn]:req.params.decliner}}).then(result=>{
        console.log(result);
        const receiptNumber ="+254"+req.body.applicant;
        const notification =req.body.decliner+ ' refuted being your '+req.body.guarantorColumn+ ' for the loan of Ksh. '+ req.body.amount+'.PLease Login and choose another '+ req.body.guarantorColumn+'.';
        const messageObject ={to:receiptNumber,message:notification,from:"Joymakers"};  
        newMessage.SMS.send(messageObject).then(()=>console.log(`Messages sent to Applicant edit the Loan Guarantor.`)).catch(err=>console.log(err));
        res.json({message:`You are no longer a guarantor of the ${req.body.amount} loan.`})
    }).catch(err=>console.log(err));
}

//EDITING A LOAN APPLICATION
const editLoan =(req,res)=>{
console.log(req.body);
loan.update({guarantor1:req.body.guarantor1,guarantor2:req.body.guarantor2,guarantor3:req.body.guarantor3,declined:'no'},{where:{memberPhone:req.session.loggedInUser.memberPhone}}).then(()=>{
const guarantorsArray =[req.body.guarantor1,req.body.guarantor2,req.body.guarantor3];
guarantorsArray.forEach(guarantor=>{
    user.findOne({where:{userName:guarantor}}).then(user=>{
        const receiptNumber ="+254"+user.memberPhone;
        const notification ='You have been selected as a guarantor for a loan of Ksh '+req.body.amount+' applied by '+req.session.loggedInUser.userName+".Please login to the system and Approve the loan.";
        const messageObject ={to:receiptNumber,message:notification,from:"Joymakers"};  
        newMessage.SMS.send(messageObject).then(()=>console.log(`Messages sent to ${user} .`)).catch(err=>console.log(err));
    }).catch(err=>console.log(err))
});
member.findAll().then(guarantors=>res.render('./membersFiles/loans',{member:req.session.loggedInUser,validation:'<small style="color:green">Guarantor updated successfully.<br>Please wait for them to approve.</small>',guarantors:guarantors,hasLoan:{}})).catch(err=>console.log(err));    
}).catch(err=>console.log(err));
}

//GETTING THE ALERTS PAGE
const getAlertsPage=(req,res)=>{
    loan.findAll().then(results=>{
    approval.findAll({attributes:['loanLoanId',[sequelize.fn('COUNT',sequelize.col('loanLoanId')),'approvalCount']],group:'loanLoanId'}).then(approvals=>{
    console.log(approvals);
    approvals = approvals.map(a => a.dataValues);    
    res.render('./membersFiles/alerts',{member:req.session.loggedInUser,applications:results,approvals:approvals});
    }).catch(err=>console.log(err));    
     }).catch(err=>console.log(err));
};


//GETTING lOANS AT APPROVAL STAGE
const committeeStageLoans=(req,res)=>{
  const loanId= req.params.loanId;
  const authorisedUser = req.session.loggedInUser.userName;
  user.findOne({where:{userName:authorisedUser}}).then(result=>{
    official.findOne({where:{memberPhone:result.memberPhone}}).then(official=>{
        if(official){
            approval.findAll({attributes:['loanLoanId',[sequelize.fn('COUNT',sequelize.col('loanLoanId')),'approvalCount']],group:'loanLoanId'}).then( async approvals=>{
            approvals = approvals.map(a => a.dataValues);
            const arrayResult=[];

             for(var approval of approvals){
               if(approval.approvalCount==3){ 
                    console.log(approval);
                   const committeeStageLoan =  await loan.findOne({where:{loan_Id:approval.loanLoanId}});
                    arrayResult.push(committeeStageLoan);               
                }
            }
            const result={result:arrayResult,official:official,loanProgressedOwner:req.session.loggedInUser};
            console.log(arrayResult);
            res.send(result);              
            }).catch(err=>console.log(err));


///////////////////////////////////////////////////////////////////
            // loan.findAll().then(arrayResult=>{
            //     console.log(arrayResult);   
            //     const result={result:arrayResult,official:official};
            //     res.send(result)}).catch(err=>console.log(err));
          }else{
                 const result={result:"notOfficial",loanProgressedOwner:req.session.loggedInUser};
                 res.send(result);
          }
    }).catch(err=>console.log(err));
  }).catch(err=>console.log(err));
  console.log(loanId);
        
}

//LOGGING OUT OF THE 
const logoutFunction=(req,res)=>{
req.session.destroy();
res.redirect('/');    
}

module.exports={
    getLoginPage,
    getPasswordResetPage,
    changeUserPassword,
    loggedInChecker,
    loginFunction,
    joinRequestFunction,
    savingJoinRequest,
    getDashboardFunction,
    getLoansPage,
    recordLoanApplication,
    getLoanApplications,
    editLoan,
    recordApproval,
    guarantorDeclineFunction,
    committeeStageLoans,
    logoutFunction,
    getAlertsPage
}

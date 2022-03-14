                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   const bcrypt=require('bcryptjs');
const {member, user,outstandingLoan,declinedLoan,official,loan,approval}= require('../models/databaseModels');
const {newMessage} = require('../atMessaging');


function getUserCreationpage(req,res){
    member.findAll().then(async result=>{
        let admin='';        
        if(req.session.loggedInUser.memberPhone==789467598){
            admin='yes';
        }else{
            admin='no';
        }
    res.render('./officialsFiles/chairmanPages/createUser.ejs',{member:req.session.loggedInUser,message:'',confirmation:'',options:result,admin});
    }).catch(error=>console.log(error));    
}


//FUNCTION FOR CHECKING IF THE USER IS AUTHORISED TO ACCESS A ROUTE
const authorizedChecker=(req,res,next)=>{
    user.findOne({where:{userName:req.session.loggedInUser.userName}}).then(result=>{
    official.findOne({where:{memberPhone:result.memberPhone}}).then(official=>{
    if(official){
        next();
    }else{
        console.log("Unauthorised access attempt");
        res.redirect('/errorPage');
        //res.json({Message:'You are not allowed to access This page'});
    };
    }).catch(err=>console.log(err));
    }).catch(err=> console.log(err));
}


//HANDLING THE A USER CREATION PROCEDURES
const creatingNewUser =(req,res)=>{
    try{
    console.log(req.body.submittedRequest);
    console.log(req.session);
    if(req.body.password!==req.body.confirmPassword)
    {   member.findAll().then(result=>{
        res.render('./officialsFiles/chairmanPages/createUser.ejs',{message:'<small>The passwords do not match!</small>',confirmation:'',member:req.session.loggedInUser,options:result,admin:'no'});
        }).catch(error=>console.log(error));
    }else{
    user.findAll({where:{userName:req.body.userName}}).then( async result=>{
    if(result.length>0)
    {   member.findAll().then(result=>{
        res.render('./officialsFiles/chairmanPages/createUser.ejs',{message:'Username is already in use!',confirmation:'',member:req.session.loggedInUser,options:result,admin:'no'});
    }).catch(error=>console.log(error));    
    }else{
      const password=await bcrypt.hash(req.body.password,10);   
      const userName= req.body.userName;
      member.findOne({where:{firstName:userName}}).then(member1=>{
    if(member1){
      console.log(member1);
      const newUser = new user({userName:userName,password:password,createdBy:req.session.loggedInUser.userName, memberPhone:member1.phone});
      newUser.save().then(()=>{
            member.findAll().then((result)=>{

                //SENDING MESSAGE TO THE NEWLY REGISTERED MEMBER
                const receiptNumber ="+254"+member1.phone;
                const notification =`Dear ${member1.firstName},Your have been created as  new Joymakers S.H.G system user.Your default username is ${userName} and the password is ${req.body.password}.Go to the Login page and Click forgotpassword immediately to reset the password.`;
                const messageObject ={to:receiptNumber,message:notification,from:"Joymakers"};
                newMessage.SMS.send(messageObject).then(()=>console.log(`Messages sent to ${member1.firstName}.`)).catch(err=>console.log(err));

                 res.render('./officialsFiles/chairmanPages/createUser.ejs',{message:'',confirmation:'<span class="material-icons">check_circle</span><small style="color:green">New User created Successfully.</small>',member:req.session.loggedInUser.userName,options:result,admin:'no'});
             }).catch(err=>console.log(err));
            }).catch(err=>console.log(err));    
        }else{
            member.findAll().then((result)=>{
                res.render('./officialsFiles/chairmanPages/createUser.ejs',{message:'Not an Existing Group Member!!',confirmation:'',member:req.session.loggedInUser,options:result,admin:'no'});
            }).catch(err=>console.log(err));
    }    
        }).catch(err=>console.log(err));         
    }
}).catch(error=>console.log(error));
}  
}catch(err){err=>console.log(err)};
}

const postLoan=(req,res)=>{
    console.log(req.body);
    member.findOne({where:{phone:req.body.applicant}}).then(loanee=>{
     applicant=loanee.firstName+" "+ loanee.lastName;
     loaneePhone=loanee.phone;
     finalLoan={
         loanId:req.body.loanId,
         applicant:applicant,
         loaneePhone:loaneePhone,
         loanType:req.body.loanType,
         amount:req.body.amount,
         purpose:req.body.purpose,
         chartels:req.body.chartels,
         guarantor1:req.body.guarantor1,
         guarantor2:req.body.guarantor2,
         guarantor3:req.body.guarantor3
     }
     console.log(req.body.consent);

     outstandingLoan.create(finalLoan).then(result=>{
        const receiptNumber ="+254"+loaneePhone;
        const notification =`Dear ${applicant},Your application process is complete and the loan has been approved.Please login into the system to see the amount credited`;
        const messageObject ={to:receiptNumber,message:notification,from:"Joymakers"};
        newMessage.SMS.send(messageObject).then(()=>console.log(`Messages sent to ${applicant}.`)).catch(err=>console.log(err));
        approval.destroy({where:{loanLoanId:req.body.loanId}}).then(()=>{
            loan.destroy({where:{loan_Id:req.body.loanId}}).then(()=>console.log("loan record deleted in all the preceding tables.")).catch(err=>console.log(err))
        }).catch(err=>console.log(err));
         res.json({finalLoan:result});
     }).catch(err=>console.log(err));
    }).catch(err=>console.log(err));
    
}

const declineLoan=(req,res)=>{
    console.log(req.body);
    member.findOne({where:{phone:req.body.applicant}}).then(loanee=>{
     applicant=loanee.firstName+" "+ loanee.lastName;
     loaneePhone=loanee.phone;
     finalLoan={
         loanId:req.body.loanId,
         applicant:applicant,
         loaneePhone:loaneePhone,
         loanType:req.body.loanType,
         amount:req.body.amount,
         purpose:req.body.purpose,
         chartels:req.body.chartels,
         guarantor1:req.body.guarantor1,
         guarantor2:req.body.guarantor2,
         guarantor3:req.body.guarantor3
     }


     declinedLoan.create(finalLoan).then(result=>{
        const receiptNumber ="+254"+loaneePhone;
        const notification =`Dear ${applicant}, Your loan of amount Kshs. ${req.body.amount} has been declined by the approval committee.A reason shall be availed during the weekly meeting.`;
        const messageObject ={to:receiptNumber,message:notification,from:"Joymakers"};
        newMessage.SMS.send(messageObject).then(()=>console.log(`Messages sent to ${applicant}.`)).catch(err=>console.log(err));
        approval.destroy({where:{loanLoanId:req.body.loanId}}).then(()=>{
            loan.destroy({where:{loan_Id:req.body.loanId}}).then(()=>console.log("loan record deleted in all the preceding tables.")).catch(err=>console.log(err))
        }).catch(err=>console.log(err));
         res.json({finalLoan:result});
     }).catch(err=>console.log(err));
    }).catch(err=>console.log(err));
}

//GETTING THE REPORTS PAGE
const getReportsPage=(req,res)=>{
outstandingLoan.findAll().then(result=>{
loan.findAll().then(loansInProgress=>{
declinedLoan.findAll().then(declinedLoans=>{
    official.findAll().then(officials=>{
        let allowedPdfGenerator="";
        officials.forEach(official => {
            if(official.memberPhone==req.session.loggedInUser.memberPhone){
                allowedPdfGenerator='allowed';
             };
        });
        member.findAll().then(members=>{
            res.render('./officialsFiles/chairmanPages/reports.ejs',{member:req.session.loggedInUser,members,allOutstandingLoans:result,loansInProgress:loansInProgress,declinedLoans:declinedLoans,allowedPdfGenerator});
        }).catch(err=>console.log(err));
    }).catch(err=>console.log(err));
}).catch(err=>(err));
}).catch(err=>(err));
}).catch(err=>console.log(err));
}


//CREATING  A GROUP OFFICIAL
const createOfficial=(req,res)=>{
console.log(req.body);
official.findOne({where:{role:req.body.role}}).then(result=>{
    if(result){
    res.json({validation:'That Official Role is already set!!',done:''})
    }else{
let id=0;
id+=1;
official.create({officialId:id,role:req.body.role,memberPhone:req.body.memberPhone}).then(()=>{
res.json({validation:'',done:'Official Created Successfully.'})
}).catch(err=>console.log(err));
    }
}).catch(err=>console.log(err));
}


//EDITING AN OFFICIAL
const editOfficial=(req,res)=>{
console.log(req.body);
official.update({memberPhone:req.body.memberPhone},{where:{role:req.body.role}}).then(()=>{
    res.json({validation:'',done:`Group ${req.body.role} Updated Successfully.`});
}).catch(err=>console.log(err));
}
module.exports={
    getUserCreationpage,
    authorizedChecker,
    creatingNewUser,
    postLoan,
    getReportsPage,
    declineLoan,
    createOfficial,
    editOfficial
}
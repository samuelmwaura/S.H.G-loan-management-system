
const {member, request, user,outstandingLoan,declinedLoan,official,loan,approval}= require('../models/databaseModels');
const { getLoansPage } = require('./membersController');


///GETTING THE MEMBERSPAGE
const getMembersPage=async (req,res)=>{
    official.findAll().then(async results=>{
        let officials=[];
          for(let i=0;i<results.length;i++){
             await member.findOne({where:{phone:results[i].memberPhone}}).then(official=>{   //Na ni kama nimeiva sana kucode
                 officials.push(official);
     }).catch(err=>console.log(err));
        } 
       await member.findAll().then(members=>{
            request.findAll().then(async requests=>{
                let allowed ="";
                
        await official.findOne({where:{memberPhone:req.session.loggedInUser.memberPhone}}).then(result=>{
             if(result){
                 allowed='yes'
             }else{
                    allowed='no';
                }
         }).catch(err=>console.log(err));
                res.render('./membersFiles/members.ejs',{member:req.session.loggedInUser,officials,members,requests,allowed});
            }).catch(err=>console.log(err));
        }).catch(err=>console.log(err));
    }).catch(err=>console.log(err));
}

//GETTIING AN EXISTING REQUEST
const getExistingRequest=(req,res)=>{
   const firstName=req.params.firstName;
   request.findOne({where:{firstName:firstName}}).then(result=>{
       res.json({result});
   }).catch(err=>console.log(err));
 

}

//CREATING A NEW MEMBER
const createMember=async (req,res)=>{
    console.log(req.body);
   await member.create({firstName:req.body.firstName,lastName:req.body.lastName,phone:req.body.phone,idNumber:req.body.idNumber,business:req.body.business,residence:req.body.residence,businessLocation:req.body.businessLocation,savings:0,welfare:0}       
    ).then(()=>{
        request.destroy({where:{phone:req.body.phone}}).then(()=>{
        res.redirect('/memberspanel')}).catch(err=>console.log(err));
        }).catch(err=>console.log);
}


//GETTING AND EXISITING MEMBER 
const getExistingMember=(req,res)=>{
    const firstName = req.params.firstName;
    member.findOne({where:{firstName}}).then(result=>{
        res.json({result})
    }).catch(err=>console.log(err))
}

//EDITTING A MEMBER DETAILS
const editMember=async (req,res)=>{
    console.log(req.body);
   await member.update(
       {firstName:req.body.firstName,lastName:req.body.lastName,phone:req.body.phone,business:req.body.business,residence:req.body.residence,businessLocation:req.body.businessLocation},
       {where:{idNUmber:req.body.idNumber}}       
    ).then(()=>res.redirect('/memberspanel')).catch(err=>console.log(err));
}

//DELETE MEMBER AND USER TOO.
const deleteMember=(req,res)=>{
    console.log(req.body.member);
    outstandingLoan.findOne({where:{loaneePhone:req.body.member}}).then(result=>{
        if(result){
      res.render('error',{validation:`User has an existing loan of ${result.amount}`});
        }else{
    user.destroy({where:{memberPhone:req.body.member}}).then(()=>{
     member.destroy({where:{phone:req.body.member}}).then(()=>res.redirect('/memberspanel')).catch(err=>console.log(err));
      }).catch(err=>console.log(err));     
        }
    }).catch(err=>console.log(err));
    
}


const getErrorPage=(req,res)=>{

res.render('./errorPage',{member:req.session.loggedInUser});
}


module.exports={
    getMembersPage,
    getExistingRequest,
    getExistingMember,
    createMember,
    editMember,
    deleteMember,
    getErrorPage
}
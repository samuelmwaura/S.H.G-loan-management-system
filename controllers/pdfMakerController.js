const pdfKitTable = require('pdfkit-table');
const fs = require("fs");
const {outstandingLoan,loan, declinedLoan,member}=require('../models/databaseModels');

//CREATING THE OUTSTANDING LOAN REPORT PDF.
const buildOutstandingLoansPdf=async (dataCallback,endCallback)=>{
const pdfdocument = new pdfKitTable({ margin: 30,width:800,height:400});
pdfdocument.on('data',dataCallback);
pdfdocument.on('end',endCallback);

let allLoans=[];
   await outstandingLoan.findAll().then(result=>
    result.forEach(loan=>allLoans.push(loan))
    ).catch(err=>console.log(err));

    const table={
        headers:[
          {label:'loan Id',property:'loanId',render:null},
          {label:'Applicant',property:'applicant',render:null},
          {label:'Unique Id',property:'loaneePhone',render:null},
          {label:'loan Type',property:'loanType',render:null},
          {label:'Amount',property:'amount',render:null},
          {label:'Purpose',property:'purpose',render:null},
          {label:'Chartels',property:'chartels',render:null},
          {label:'Guarantor 1',property:'guarantor1',render:null},
          {label:"Guarantor 2",property:'guarantor2',render:null},
          {label:"Guarantor 3",property:'guarantor3',render:null} 
        ],
 
        //rows
        datas:allLoans      
     }

     //logo definition area
     pdfdocument.fontSize(25);
     pdfdocument.image('//home/corazon/Cs/Year 4/Mwaura Ace/controllers/JoyMakersLogo.jpg',165,39,{width:80,height:50});
     pdfdocument.text('JOYMAKERS',250,45,10,30);
     pdfdocument.text('S.H.G',250,69,10,30);
    pdfdocument.fontSize(12);
    pdfdocument.text('JOYMAKERS SELF HELP GROUP OUTSTANDING LOANS.',150,137,10,10);
    pdfdocument.fill('black');
    pdfdocument.underline(150, 139, 325, 10, { color: '#0000FF' })
    pdfdocument.fontSize(17);
    pdfdocument.text(' ',50,135,0,0);
    
     //table creation
    await pdfdocument.table( table,{width:500}); // is a Promise to async/await function 
    pdfdocument.fontSize(11);
    if(allLoans.length==0){
    pdfdocument.text('There are no Outstanding Loans at the moment!!',155);
     }    
     pdfdocument.fontSize(9);
    pdfdocument.text('@Joymakers S.H.G',240);    
   
  
    // done!
    pdfdocument.end();
}


//CREATING THE DECLINED LOAN REPORT PDF.
const buildDeclinedLoansPdf=async (dataCallback,endCallback)=>{
    const doc = new pdfKitTable({ margin: 30,width:800,height:400});
    doc.on('data',dataCallback);
    doc.on('end',endCallback);
    
    // table
   let allLoans=[];
   await declinedLoan.findAll().then(result=>
    result.forEach(loan=>allLoans.push(loan))
    ).catch(err=>console.log(err));

//table definition
    const table={
       headers:[
        {label:'loan Id',property:'loanId',render:null},
        {label:'Applicant',property:'applicant',render:null},
        {label:'Unique Id',property:'loaneePhone',render:null},
        {label:'Loan Type',property:'loanType',render:null},
        {label:'Amount',property:'amount',render:null},
        {label:'Purpose',property:'purpose',render:null},
        {label:'Chartels',property:'chartels',render:null},
        {label:'Guarantor 1',property:'guarantor1',render:null},
        {label:"Guarantor 2",property:'guarantor2',render:null},
        {label:"Guarantor 3",property:'guarantor3',render:null}       
       ],

       //rows
       datas:allLoans
      
    }

    //logo definition area
    doc.fontSize(25);
    doc.image('//home/corazon/Cs/Year 4/Mwaura Ace/controllers/JoyMakersLogo.jpg',165,39,{width:80,height:50});
    doc.text('JOYMAKERS',250,45,10,30);
    doc.text('S.H.G',250,69,10,30);
    doc.fontSize(12);
    doc.text('JOYMAKERS SELF HELP GROUP DECLINED LOANS.',150,137,10,10);
    doc.fill('black');
    doc.underline(150, 139, 325, 10, { color: '#0000FF' })
    doc.fontSize(17);
    doc.text(' ',50,135,0,0);
    
     //table creation
    await doc.table( table,{width:500}); // is a Promise to async/await function 
    doc.fontSize(11);
    if(allLoans.length==0){
    doc.text('There are no declined Loans at the moment!!',155);
     }    
    doc.fontSize(9);
    doc.text('@Joymakers S.H.G',240);  
  
    // done!
    doc.end();
}

//CREATING THE LOANS IN PRONGRESS REPORT
const buildLoansInProgresspdf=async (dataCallback,endCallback)=>{
  const doc = new pdfKitTable({ margin: 30,width:800,height:400});
  doc.on('data',dataCallback);
  doc.on('end',endCallback);
  
  // table
 let allLoans=[];
 await loan.findAll().then(result=>
  result.forEach(loan=>allLoans.push(loan))
  ).catch(err=>console.log(err));

//table definition
  const table={
     headers:[
       {label:'loan Id',property:'loan_Id',render:null},
       {label:'loan Type',property:'loan_type',render:null},
       {label:'Amount',property:'Amount',render:null},
       {label:'Purpose',property:'purpose',render:null},
       {label:'Chartels',property:'chartels',render:null},
       {label:'Guarantor 1',property:'guarantor1',render:null},
       {label:'Guarantor 2',property:'guarantor2',render:null},
       {label:'Guarantor 3',property:'guarantor3',render:null},
       {label:"Applicant Id",property:'memberPhone',render:null}        
     ],

     //rows
     datas:allLoans    
  }

  //logo definition area
  doc.fontSize(25);
  doc.image('//home/corazon/Cs/Year 4/Mwaura Ace/controllers/JoyMakersLogo.jpg',165,39,{width:80,height:50});
  doc.text('JOYMAKERS',250,45,10,30);
  doc.text('S.H.G',250,69,10,30);
  doc.fontSize(12);
  doc.text('JOYMAKERS SELF HELP LOANS IN PROGRESS.',150,137,10,10);
  doc.fill('black');
  doc.underline(150, 139, 325, 10, { color: '#0000FF' })
  doc.fontSize(17);
  doc.text(' ',50,135,0,0);
  
   //table creation
  await doc.table( table,{width:500}); // is a Promise to async/await function 
  doc.fontSize(11);
    if(allLoans.length==0){
    doc.text('There are no Loans in progress at the moment!!',155);
     }    
    doc.fontSize(9);
    doc.text('@Joymakers S.H.G',240);  
  
  // done!
  doc.end();
}

//CREATING THE MEMBER FINANCES TABLE

const buildMemberFinancespdf=async (dataCallback,endCallback)=>{
  const doc = new pdfKitTable({ margin: 30,width:800,height:400});
  doc.on('data',dataCallback);
  doc.on('end',endCallback);
  
  // table
 let allMembers=[];
 await member.findAll().then(result=>
  result.forEach(member=>allMembers.push(member))
  ).catch(err=>console.log(err));

//table definition
  const table={
     headers:[
       {label:'First Name',property:'firstName',render:null},
       {label:'LastName',property:'lastName',render:null},
       {label:'Id Number',property:'idNumber',render:null},
       {label:'Phone',property:'phone',render:null},
       {label:'Business',property:'business',render:null},
       {label:'Savings',property:'savings',render:null},
       {label:'Welfare',property:'welfare',render:null}
     ],

     //rows
     datas:allMembers    
  }

  //logo definition area
  doc.fontSize(25);
  doc.image('//home/corazon/Cs/Year 4/Mwaura Ace/controllers/JoyMakersLogo.jpg',165,39,{width:80,height:50});
  doc.text('JOYMAKERS',250,45,10,30);
  doc.text('S.H.G',250,69,10,30);
  doc.fontSize(12);
  doc.text('JOYMAKERS SELF HELP GROUP MEMBER FINACNCES.',150,137,10,10);
  doc.fill('black');
  doc.underline(150, 139, 325, 10, { color: '#0000FF' })
  doc.fontSize(17);
  doc.text(' ',50,135,0,0);
  
   //table creation
  await doc.table( table,{width:500}); // is a Promise to async/await function 
  doc.fontSize(11);
    if(allMembers.length==0){
    doc.text('There are members at the moment!!',155);
     }    
    doc.fontSize(9);
    doc.text('@Joymakers S.H.G',240);  
  
  // done!
  doc.end();
}

module.exports={
    buildOutstandingLoansPdf,
    buildDeclinedLoansPdf,
    buildLoansInProgresspdf,
    buildMemberFinancespdf
}
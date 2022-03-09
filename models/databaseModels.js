const Sequelize = require('sequelize');
const sequelize = require("../database/connection");

//SCHEMA FOR SYSTEM USERS TABLE
const userSchema= {
    id:{
        type:Sequelize.INTEGER(20),
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    userName:{
        type:Sequelize.STRING(20),
        allowNull:false,
        unique:true
    },
    password:{
        type:Sequelize.STRING(70),
        allowNull:false
    },
    createdBy:{
        type:Sequelize.STRING(20),
        allowNull:false
    }
}




//SCHEMA FOR JOYMAKERS MEMBERS TABLE
const memberSchema ={
    firstName:{
        type:Sequelize.STRING(20),
        allowNull:false
    },
    lastName:{
        type:Sequelize.STRING(20),
        allowNull:false
    },
    idNumber:{
        type:Sequelize.INTEGER(20),
        allowNull:false
    },
    phone:{
        type:Sequelize.INTEGER(20),
        allowNull:false,
        primaryKey:true
    },
    business:{
        type:Sequelize.STRING(30),
        allowNull:false
    },
    residence:{
        type:Sequelize.STRING(20),
        allowNull:false
    },
    businessLocation:{
        type:Sequelize.STRING(20),
        allowNull:false
    },
    savings:{
        type:Sequelize.INTEGER(10),
        allowNull:false
    },
    welfare:{
        type:Sequelize.INTEGER(10),
        allowNull:false
    }
}



//SCHEMA FOR JOIN REQUESTS
const requestSchema={
    firstName:{
        type:Sequelize.STRING(20),
        allowNull:false},
    lastName:{
        type:Sequelize.STRING(20),
        allowNull:false
    },
    phone:{
        type:Sequelize.INTEGER(20),
        allowNull:false,
        primaryKey:true
    },
    
    residence:{
        type:Sequelize.STRING(20),
        allowNull:false
    },
    business:{
        type:Sequelize.STRING(20),
        allowNull:false
    },
    businessLocation:{
        type:Sequelize.STRING(20),
        allowNull:false
    }
}

const loanSchema={
    loan_Id:{
        type:Sequelize.INTEGER(10),
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    loan_type:{
        type:Sequelize.STRING(50),
        allowNull:false
    },
    Amount:{
        type:Sequelize.INTEGER(20),
        allowNull:false
    },
    purpose:{
        type:Sequelize.STRING(100),
        allowNull:false,
    },  
    chartels:{
        type:Sequelize.STRING(500),
        allowNull:false
    },
    guarantor1:{
        type:Sequelize.STRING(30),
        allowNull:false
        
    },
    guarantor2:{
        type:Sequelize.STRING(30),
        allowNull:false
    },
    guarantor3:{
        type:Sequelize.STRING(30),
        allowNull:false
    },
    declined:{
        type:Sequelize.STRING(10),
        allowNull:true
    }


}

const approvalSchema={
    approvalId:{
      type:Sequelize.INTEGER(10),
      autoIncrement:true,
      primaryKey:true    
    },
    approver:{
        type:Sequelize.STRING(20),
        allowNull:false
    }
    
}


const officialsSchema = {
    officialId:{
        type:Sequelize.INTEGER(10),
        primaryKey:true,
        allowNull:false
    },

    role:{
       type:Sequelize.STRING(20),
       allowNull:false
    }
}


const outstandingLoanSchema ={
    loanId:{
        type:Sequelize.INTEGER(10),
        allowNull:false,
        primaryKey:true,
    },
applicant:{
    type:Sequelize.STRING(50),
    allowNull:false
},
loaneePhone:{
    type:Sequelize.INTEGER(20),
    allowNull:false
},

    loanType:{
        type:Sequelize.STRING(50),
        allowNull:false
    },
    amount:{
        type:Sequelize.INTEGER(20),
        allowNull:false
    },
    purpose:{
        type:Sequelize.STRING(100),
        allowNull:false,
    },  
    chartels:{
        type:Sequelize.STRING(500),
        allowNull:false
    },
    guarantor1:{
        type:Sequelize.STRING(30),
        allowNull:false,
        unique:true
    },
    guarantor2:{
        type:Sequelize.STRING(30),
        allowNull:false,
        unique:true
    },
    guarantor3:{
        type:Sequelize.STRING(30),
        allowNull:false,
        unique:true
    }
}


const declinedLoansSchema ={
    loanId:{
        type:Sequelize.INTEGER(10),
        allowNull:false,
        primaryKey:true,
    },
applicant:{
    type:Sequelize.STRING(50),
    allowNull:false
},
loaneePhone:{
    type:Sequelize.INTEGER(20),
    allowNull:false
},

    loanType:{
        type:Sequelize.STRING(50),
        allowNull:false
    },
    amount:{
        type:Sequelize.INTEGER(20),
        allowNull:false
    },
    purpose:{
        type:Sequelize.STRING(100),
        allowNull:false,
    },  
    chartels:{
        type:Sequelize.STRING(500),
        allowNull:false
    },
    guarantor1:{
        type:Sequelize.STRING(30),
        allowNull:false,
        unique:true
    },
    guarantor2:{
        type:Sequelize.STRING(30),
        allowNull:false,
        unique:true
    },
    guarantor3:{
        type:Sequelize.STRING(30),
        allowNull:false,
        unique:true
    }
}








const user=sequelize.define('user',userSchema,{timestamps:true});
const request=sequelize.define('request',requestSchema,{timestamps:true});
const member=sequelize.define('member',memberSchema,{timestamps:true});
const loan= sequelize.define('loan',loanSchema,{timestamps:true});
const approval = sequelize.define('approval',approvalSchema,{timestamps:true});
const official=sequelize.define('official',officialsSchema,{timestamps:true});
const outstandingLoan=sequelize.define('outstandingLoan',outstandingLoanSchema,{timestamps:true});
const declinedLoan = sequelize.define('declinedLoan',declinedLoansSchema,{timestamps:true});

loan.hasMany(approval);
member.hasOne(user);
member.hasOne(loan);
member.hasOne(official);

module.exports={
   user,
   request,
   member,
   loan,
   approval,
   official,
   outstandingLoan,
   declinedLoan   
};
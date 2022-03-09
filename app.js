const express= require('express');
const morgan = require('morgan');
const dotenv= require('dotenv');
const session= require('express-session');
const memberRouter= require('./routers/memberRoutes');
const officialsRouter= require('./routers/officialsRoutes');
const reportsRouter = require('./routers/reportsRouter');
const membersPageRouter = require('./routers/membersPageRouter');
const sequelize = require('./database/connection');

//FIRING THE EXPRESS APP
const app=express();

//SETTING THE VIEW ENGINE AND THE VIEW ENGINE FOLDER FOR ALL VIEWS
app.set('view engine','ejs');

//SETTING THE STATICS FOLDER
app.use(express.static('public'));

//SETTING THE SERVER TO BE ABLE TO UNDERSTAND JSON DATA INCOMING
app.use(express.json({limit:'1mb'}));

//JSONATING THE DATA FROM THE FRONTED FOR USE IN THE SERVER
app.use(express.urlencoded({extended:true}));

//USING MORGAN LOGGER
app.use(morgan('tiny'));

//SETTING THE ENVIRONMENT VARIABLES
dotenv.config();//secure file that holds all the environmental variables.
const port=process.env.PORT;

//SETTING EXPRESS SESSION TO HELP IN MAINTAINING SESSION DATA
app.use(session({
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:false
}));

//SETTING THE DATABASE CONNECTION 
sequelize.sync().then(()=>console.log('The database is connected')).catch(err=>console.log(err));

//HANDLING THE GET AND POST REQUESTS
app.use(memberRouter);//for all the requests involving members
app.use(officialsRouter);//for all the request made by the officials.
app.use(reportsRouter);//Handler for all report requests.
app.use(membersPageRouter);

//ANYPAGE NOT PRESENT IN THE SYSTEM
app.use((req,res,next)=>{
    res.render('./errorPage',{member:{userName:'Rogue'}});
});


//SETTING THE SERVER TO BE ATTENTIVE
app.listen(port,()=>{
    console.log(`The server is on:${port}`);
});


const express = require('express')
const { db } = require('./firebase')
const app = express()
const cors = require('cors')

require('dotenv').config();


const userRoutes = require('./Routes/UserAuthRoutes');
const userInfoRoute = require('./Routes/UserInfoRoutes')

app.use(express.json({limit: '50mb'}));
// app.use(express.urlencoded({limit: '50mb'}));
app.use(cors({
    origin: '*'
}));

app.listen(8001,()=>{
    console.log("Begining to listen on port: 8001") 
})
app.use('/user/info',userInfoRoute);
app.use('/user',userRoutes) ;
// app.post('/set-user',async(req,res)=>{
//     console.log(req.body)
//     const userRef = db.collection('User_Accounts')
//     userRef.add({First_Name:"Tahj", Last_Name:"Serieux"})
//     .then((docRef)=>{
//         res.status(200).json({userId:docRef._path.segments[1],mssg:'Successfully Added'})
//     })
//     .catch((error)=>{
//         res.status(500).json({error})
//     })

// })

app.post('/test-ml-call', async(req,res)=>{

    console.log(req.body)
    
})


app.use('*', (req, res) => {
    res.status(404).json({error:"Resource not found"});
  });
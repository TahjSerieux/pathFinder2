const {db} = require('../firebase')
const jwt = require('jsonwebtoken')
require('dotenv').config();

const requireAuth = async (req, res, next) =>{
    const userRef = db.collection('User_Accounts');
    const {authorization} = req.headers;
    // console.log('authorization', authorization)
    
    if(!authorization)
    {
        return res.status(401).json({error:'Authorization token required'})
        
    }
    
    const token = authorization.split(' ')[1]
   
    try {
        const {_id} = jwt.verify(token,process.env.SECRET)
        // console.log(_id);
        const querySnapshot = await userRef.doc(_id).get();
        // console.log(querySnapshot)
        // console.log(querySnapshot.data())

        const documentData = querySnapshot.data()
        // console.log("token")
        req.user =  {_id,...documentData}
        // console.log(req.user);
        next()
    } catch (error) {
        res.status(401).json({error:'Request not authorized'})
    }


}

module.exports = requireAuth
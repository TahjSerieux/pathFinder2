const {db} = require('../firebase')

const getSavedRoutes = async(req,res)=>{
    const userRef = db.collection('User_Accounts');
    try {
        const userDocReference = await userRef.doc(req.user._id)
        const userDocSnapshot = await (await userDocReference.get()).data()
        console.log("hereeerewrewrwrewr")
        const savedWaypoints = [...userDocSnapshot.savedWaypoints];
        return(res.status(200).json({mssg:"successfully saved", savedWaypoints}))
    } catch (error) {
        return(res.status(400).json({mssg:"Failed to retrieve"}))
        
    }
}
const deleteSavedRoutes = async(req,res)=>{
    const {index} = req.body
    const userRef = db.collection('User_Accounts');
    try {
        const userDocReference = await userRef.doc(req.user._id)
        const userDocSnapshot = await (await userDocReference.get()).data()
        // const savedWaypoints = [...userDocSnapshot.savedWaypoints];
        const savedWaypoints = userDocSnapshot.savedWaypoints.filter((_,currentindex)=> currentindex != index);
        await userDocReference.update({savedWaypoints})
        return(res.status(200).json({mssg:"successfully deleted", savedWaypoints}))
    } catch (error) {
        return(res.status(400).json({mssg:"Failed to retrieve"}))
        
    }
}
const saveFavoritedRoutes = async(req, res) =>{
    const {route,endPointInfo} = req.body;
    const userRef = db.collection('User_Accounts');
    try {
        const userDocReference = await userRef.doc(req.user._id)
        const userDocSnapshot = await (await userDocReference.get()).data()
        console.log("route, endPointInfo")
        console.log(userDocSnapshot  )
        const routeExists = userDocSnapshot.savedWaypoints.some(obj =>
            obj.route.geocoded_waypoints &&
            obj.route.geocoded_waypoints[0]?.place_id === route.geocoded_waypoints[0]?.place_id &&
            obj.route.geocoded_waypoints[1]?.place_id === route.geocoded_waypoints[1]?.place_id
            );
        const route2 = route
        // console.log("ARRAY", userDocSnapshot.savedWaypoints[userDocSnapshot.savedWaypoints.length -1])
        // console.log(userDocSnapshot.savedWaypoints[userDocSnapshot.savedWaypoint.length-1])
        if(userDocSnapshot.savedWaypoints.length > 0 && routeExists){
            return (res.status(200).json({mssg:"Route is already saved"}))
        }else{
            // console.log("CHECK", route)
            const savedWaypoints = [...userDocSnapshot.savedWaypoints,{route,endPointInfo}];
            // console.log(savedWaypoints[savedWaypoints.length-1])

            await userDocReference.update({savedWaypoints})

            return(res.status(200).json({mssg:"successfully saved"}))

        }
    } catch (error) {
        return(res.status(400).json({mssg:"Failed to save"}))
        
    }



}
module.exports = {getSavedRoutes,saveFavoritedRoutes,deleteSavedRoutes};
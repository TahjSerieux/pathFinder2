const FavoriteRoutes = ({routeInfo,onClickFunction,index,setFavoriteRoutesArray,deleteRoute,favoriteRoutesArray}) => {
    const handleClick = () =>{
        onClickFunction()
    }
    const handleDeletion = () =>{
    //    alert("DELETED")
       deleteRoute()
 
    // console.log(index,favoriteRoutesArray[index])
    // setFavoriteRoutesArray([])
    }
    return ( 
        <div>
        <div className="SearchResult" onClick={()=>handleClick()}>
            <img className="SearchResult-img" src={routeInfo.photos} alt="" />
            <div className="SearchResult-detail">
                <label htmlFor="">{routeInfo.name}</label> 
                <label htmlFor="">{routeInfo.address}</label>
                <label htmlFor="">Rating: {routeInfo.rating}</label> 
                {/* <label htmlFor="">Attributes: {routeInfo.atributes[0]}</label> */}
                {/* <label htmlFor="">{routeInfo}</label> */}
                </div>
            </div>
            <div onClick={()=>handleDeletion()} className='save-button-div'><label className='save-button' htmlFor="">Delete</label></div>
        </div>
     );
}
 
export default FavoriteRoutes;
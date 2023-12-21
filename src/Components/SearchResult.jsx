import { useEffect } from 'react';
import '../Styles/SearchResult.css'
const SearchResult = ({endPoint,onClickFunction,saveRoute,isMidPointSearchResult,isOriginalRoute,midPoint}) =>{
    const handleClick = () =>{
        onClickFunction()
    }
    const handleSave = () =>{
        // console.log(endPoint.photos[0].html_attributions[0])
        saveRoute()
    }

    //    { const htmlString = endPoint.photos[0].html_attributions[0];
    //     const parser = new DOMParser();
    //     const htmlDoc = parser.parseFromString(htmlString, 'text/html');
    //     const anchorTag = htmlDoc.querySelector('a');
    //     const googleUserLink = anchorTag.href;
// }
  

    return (
        <div>
            {!isMidPointSearchResult && (
                <div className="SearchResult" onClick={() => handleClick()}>
                    <img className="SearchResult-img" src={endPoint.photos} alt="" />
                    <div className="SearchResult-detail">
                        <label htmlFor="">{endPoint.name}</label>
                        <label htmlFor="">{endPoint.address}</label>
                        <label htmlFor="">Rating: {endPoint.rating}</label>
                    </div>
                    <div onClick={() => handleSave()} className='save-button-div'>
                        <label className='save-button' htmlFor="">save</label>
                    </div>
                </div>
            )}

            {isMidPointSearchResult && (
                <div className="SearchResult" onClick={() => handleClick()}>
                    <img className="SearchResult-img" src={midPoint.photo} alt="" />
                    <div className="SearchResult-detail">
                        <label htmlFor="">{midPoint.name}</label>
                        <label htmlFor="">{midPoint.address}</label>
                        <label htmlFor="">Rating: {midPoint.rating}</label>
                    </div>
                    <div onClick={() => handleSave()} className='save-button-div'>
                        <label className='save-button' htmlFor="">save</label>
                    </div>
                </div>
            )}
        </div>
    );
};


export default SearchResult
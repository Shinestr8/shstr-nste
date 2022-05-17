import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Histogram } from "../Charts/Histogram";
import { GenreRadarChart } from "../Charts/GenreRadarChart";
import { LoadingIcon } from "../General/Icons/LoadingIcon";
import { CircleCheck } from "../General/Icons/CircleCheck";
import { CircleXMark } from "../General/Icons/CircleXMark";

export function Prediction(){

    const {id} = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);


    useEffect(()=>{
        async function fetchLatestData(){
            setLoading(true);
            const response = await fetch(`/api/feedback/id/${id}`);
            const result = await response.json();
            setData(result);
            setLoading(false);
        }
        fetchLatestData()
    }, [id])


    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    if(loading){
        return(
            <div style={{textAlign:"center", padding: "1rem"}}>
                <LoadingIcon/>
            </div>
            
        )
    }

    if(data && data.data.rawData.length === 0){
        return(
            <div id="predict">
                <div id="no-data-prediction">
                predicted <strong>&nbsp;{data.predictedLabel}</strong>, was <strong>&nbsp;{data.trueLabel}</strong> {data.success ? <CircleCheck/> : <CircleXMark/>}&nbsp;
                <a
                    tabIndex="0"
                    href={`https://www.youtube.com/watch?v=${data.videoID}`}
                    target='_blank'
                    rel="noreferrer"
                    title={`https://www.youtube.com/watch?v=${data.videoID}`}
                >
                    Listen on youtube
                </a>
                <br/>
                <br/>
                <div>Sorry, no more data to show for this song</div>
                </div>
                
            </div>
        )
    }

    if(data && data.data.rawData.length !== 0){
        return(
            <div id="predict">
                <div id="prediction">
                    <div className="top">
                        predicted <strong>&nbsp;{data.predictedLabel}</strong>, was <strong>&nbsp;{data.trueLabel}</strong>.&nbsp;<a
                        tabIndex="0"
                        href={`https://www.youtube.com/watch?v=${data.videoID}`}
                        target='_blank'
                        rel="noreferrer"
                        title={`https://www.youtube.com/watch?v=${data.videoID}`}
                    >
                    Listen on youtube
                </a>
                    </div>
                    <div className="top-left">
                        <ul>
                            {data.data.guess.map(function(genre, index){
                                return(
                                <li key={`genre-${index}`} className={`genre top-${index}`}>
                                    { capitalizeFirstLetter(genre.name)} {Math.round(10000*genre.count/data.data.total)/100}%
                                </li>
                                )
                            })}
                        </ul>
                        <div>
                            <img 
                                className="genre-icon"
                                src={`${process.env.PUBLIC_URL}/images/genres/${data.data.higherGuess}.svg`} 
                                alt={data.data.higherGuess}
                                title={data.data.higherGuess}
                            />
                            <div>{capitalizeFirstLetter(data.data.higherGuess)}</div>
                        </div>  
                    </div>
                    <div className="top-right">
                             {/*Comes from radar Error: <path> attribute d: Expected number, "M NaN,NaNL NaN,NaN…". */}
                        <GenreRadarChart data={data.data}/>
                    </div>
                    <div className="bottom">
                        <Histogram rawData={data.data.rawData}/>
                    </div>
                </div>
            </div>
        )
    }

    else{
        return(<div>No data super sorry</div>)
    }
    
}
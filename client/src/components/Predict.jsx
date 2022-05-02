import {useState, useEffect} from "react";
import '../App.css';
import { Histogram } from "./Histogram";
import { GenreRadarChart } from "./GenreRadarChart";
import { Modal } from "./Modal";
import { Toaster } from "./Toaster";


function ImprovementModalBody(props){

    const [isGoodGuess, setIsGoodGuess] = useState(null);
    const [realGenre, setRealGenre] = useState(null);
    const [disabled, setDisabled] = useState(true);
    const [genreProposition, setGenreProposition] = useState("");

    const genres = ["Blues", "Classical", "Country", "Disco", "Hiphop", "Jazz", "Metal", "Pop", "Reggae", "Rock"];


    function onValueChange(e){
        // console.log(e.target.value);
        setRealGenre(null);
        setGenreProposition(null);
        if(e.target.value === "Yes"){
            setIsGoodGuess(true);
            setDisabled(false);
        } else {
            setIsGoodGuess(false);
            setDisabled(true);
        }
    }

    function handleSubmit(e){
        e.preventDefault();
        if(isGoodGuess){
            console.log(
                {
                    "guessed": props.guess,
                    "true": props.guess
                }
            )
            
        }
        if(!isGoodGuess && realGenre && realGenre !== "Other"){
            console.log(
                {
                    "guessed": props.guess,
                    "true": realGenre.toLowerCase()
                }
            )
        }
        if(!isGoodGuess && realGenre && realGenre === "Other"){
            console.log(
                {
                    "guessed": props.guess,
                    "true": genreProposition.toLowerCase()
                }
            )
        }
        props.toggleShow();
        props.showAlert();
    }

    function onGenreValueChange(e){
        // console.log(e.target.value);
        setRealGenre(e.target.value);
        setGenreProposition("");
        if(e.target.value !== "Other"){
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }

    function handlePropositionChange(e){
        setGenreProposition(e.target.value);
        if(e.target.value !== ""){
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }
    

    return(
        <form>
            
            <section onChange={onValueChange}>
                <p>Is {props.guess} a good guess ?</p>
                <input type="radio" id="Yes" name="guess-quality" value="Yes"/>
                <label htmlFor="Yes">Yes</label>

                <input type="radio" name="guess-quality" value="No" id="No"/>
                <label htmlFor="No">No</label>
            </section>
            {isGoodGuess === false && (
                <section onChange={onGenreValueChange}>
                    <p>What is the real genre ?</p>
                    {genres.map(function(genre, index){
                        return (
                        <div key={`real-genre-${genre}`}>
                            <input type="radio" name="real-genre" value={genre} id={genre}/>
                            <label htmlFor={genre}>{genre}</label>
                        </div>
                        )
                    })}
                    <div>
                            <br/>
                            <input type="radio" name="real-genre" value="Other" id="other"/>
                            <label htmlFor="other">Other</label>
                    </div>
                </section>
            )}
            {isGoodGuess === false && realGenre === "Other" && (
                <section>
                    <p>What is your proposition ?</p>
                    <input type="text" name="proposition" value={genreProposition} onChange={handlePropositionChange}/>
                    
                </section>
                
            )}
            <footer>
                <button disabled={disabled} onClick={handleSubmit}>Submit</button>
            </footer>
            
        </form>
    )
}


export function Predict(){
    const [youtubeURL, setYoutubeURL] = useState("");
    const [data, setData] = useState({"guess":[{"name":"hiphop","count":134},{"name":"pop","count":44},{"name":"classical","count":31},{"name":"jazz","count":17},{"name":"reggae","count":8},{"name":"country","count":3},{"name":"disco","count":2},{"name":"metal","count":2},{"name":"blues","count":1}],"higherGuess":"hiphop","higherCount":134,"total":242,"message":"success","rawData":[5,5,5,5,5,5,5,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,8,4,4,8,7,4,4,7,7,7,4,7,4,8,4,8,4,4,4,4,4,4,7,8,7,4,4,4,7,4,4,4,4,4,4,4,4,4,4,7,4,7,7,7,8,2,8,7,4,4,4,4,4,4,4,7,7,4,7,4,7,7,4,7,4,4,4,4,2,4,7,7,4,4,4,4,7,4,4,4,4,4,4,7,4,4,4,4,4,4,7,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,7,7,4,4,7,4,5,5,5,5,5,7,5,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,1,1,4,6,4,4,6,4,4,2,4,4,0,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,4,4,7,8,4,7,7,7,7,7,7,7,7,7,4,7,7,4,7,7,7,7,1,4,5,5,1,1,1,1]})
    const [loading, setLoading] = useState(false);
    const [isModalShowing, setShowModal] = useState(false);
    const [showToaster, setShowToaster] = useState(false);


    useEffect(function(){
        let timer;
        if(showToaster){
            timer = setTimeout(function(){
                setShowToaster(false);
            }, 5000);
        }
        return(function(){
            window.clearTimeout(timer)
        })
    }, [showToaster])

    function toggleShowModal(){
        setShowModal(prev => !prev);
    }

    function handleValueChange(e){
        setYoutubeURL(e.target.value);
    }
    
    async function submitLink(e){
        e.preventDefault();
        if(!youtubeURL.includes("watch?v=")){
            setData({message: "invalid URL"});
            return
        }
        setData(null);
        setLoading(true);
        const response = await fetch("/predict?url="+youtubeURL);
        const newData = await response.json();
        setData(newData);
        setLoading(false);
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return(
    <div id="predict">
        
            <form>
                <input placeholder="youtube link" type="text" value={youtubeURL} onChange={handleValueChange}/>
                <button type="submit" onClick={submitLink}>Submit</button>
            </form>
            {loading && (
                    <div>Processing your song...</div>
                )}

                {data && data.message!=="success" &&(
                    <div>{data.message}</div>
                )}
                {data && data.message==="success" &&(
                <div id="prediction">
                    
                        <div className="top">
                            <span>
                                is <strong>{data.higherGuess}</strong> a good guess ?
                            </span> 
                            <button onClick={toggleShowModal}>Help us improve</button>
                            <Modal 
                                isShowing={isModalShowing} 
                                toggleShow={toggleShowModal}
                                modalTitle="Help us improve"
                            >
                                <ImprovementModalBody showAlert={()=>setShowToaster(true)} guess={data.higherGuess} toggleShow={toggleShowModal}/>
                            </Modal>
                            <Toaster 
                                isShowing={showToaster}
                                message="Thanks for your feedbacks ❤️"
                                style={{backgroundColor:"#C3F3D7", border:"1px solid #2FD573"}}
                            />
                        </div>
                        <div className="top-left">
                            <ul>
                            {data.guess.map(function(genre, index){
                                return(
                                <li key={`genre-${index}`} className={`genre top-${index}`}>
                                    { capitalizeFirstLetter(genre.name)} {Math.round(10000*genre.count/data.total)/100}%
                                </li>
                                )
                            })}
                            </ul>
                            <div>
                                <img 
                                    className="genre-icon"
                                    src={`${process.env.PUBLIC_URL}/images/genres/${data.higherGuess}.svg`} 
                                    alt={data.higherGuess}
                                    title={data.higherGuess}
                                />
                                <div>{capitalizeFirstLetter(data.higherGuess)}</div>
                            </div>    
                            
                        </div>
                        <div className="top-right">
                             {/*Comes from radar Error: <path> attribute d: Expected number, "M NaN,NaNL NaN,NaN…". */}
                            <GenreRadarChart data={data}/>
                        </div>
                        <div className="bottom">
                            <Histogram rawData={data.rawData}/>
                        </div>

                
            </div>
            )}
    </div>
    )
}
import { useEffect, useState } from 'react';

export default function Facts() {
    const [facts, setFacts] = useState([]);
    const [display, setDisplay] = useState([]);
    const [page, setPage] = useState(1);
    const handleFetch = async () => {
        try{
            const response = await fetch('https://uselessfacts.jsph.pl/random.json?language=en');
            const data = await response.json();
            console.log(data);
            if(data.text){
                setFacts(prevFacts => [...prevFacts, data]);
            }
        }catch(error){
            console.log(error);
        }
    }

    const handlePrev = () => {
        if(page > 1){
            setPage(page - 1);
        }
    }

    const handleNext = () => {
        if(page < Math.ceil(facts.length/5)){
            setPage(page + 1);
        }
    }

    useEffect(async () => {
        for(let i = 0; i < 10; i++){
            handleFetch();
        }
    }, []);

    useEffect(() => {
        setDisplay(facts.slice((page-1)*5, page*5));
    }, [facts, page]);

    return(
        <>
            <h1>Fun facts</h1>
            {display.map((fact) => (
                <div key={fact.id}>
                    <p>{fact.text}</p>
                    <a href={fact.source_url}>Link to the original source</a>
                </div>
            ))}
            {/* <button onClick={handleFetch}>More...</button> */}
            <button onClick={handlePrev}>Prev</button>
            <button onClick={handleNext}>Next</button>
        </>
    );
}
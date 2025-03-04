import { useEffect, useState } from "react";

export default function Details({userId}) {
    const [spends, setSpends] =  useState([]);
    const [searchText, setSearchText] = useState('');
    const handleFetch = async () => {
        try{
            const id = userId || '67a28b8829f3ba8beda0e216';
            const startDate = new Date();
            startDate.setUTCMonth(0, 1); // Set to January 1st
            startDate.setUTCHours(0, 0, 0, 0); // Set time to 00:00:00.000
            startDate.toUTCString();
            const endDate =  new Date().toUTCString();
            console.log(startDate, endDate);
    
            const response = await fetch(`http://localhost:5000/spend?userId=${id}&startDate=${startDate}&endDate=${endDate}`);
            const data = await response.json();
            if(data){
                setSpends(data);
            }else{
                console.log('No data found');
            }
        }catch(error){
            console.log(error);
        }
    }
    useEffect(() =>{
        handleFetch();
    },[]);

    const handleSearch = async () => {
        const targets = spends.filter((spend) => (spend.category === searchText));
        console.log(targets);
        if(targets.length > 0){
            setSpends(targets);
        }
        
    }
    
    useEffect(() => {
        if(searchText === ''){
            handleFetch();
        }else{
            handleSearch();
        }
       
    }, [searchText])

    return(
        <>  
            <label htmlFor="search">Search: </label>
            <input type="text" id="search" 
                value={searchText}
                onChange={e => setSearchText(e.target.value)}/>
            {/* <button onClick={handleSearch}>Find</button> */}
            <button onClick={handleFetch}>Reset</button>
            <table>
                <thead>
                    <tr>
                        <td>Category</td>
                        <td>Amount</td>
                        <td>Date</td>
                        <td>Details</td>
                    </tr>
                </thead>
                <tbody>
                    {spends.map((spend) => (
                        <tr key={spend._id}>
                            <td>{spend.category}</td>
                            <td>{spend.amount}</td>
                            <td>{spend.date.split("T")[0]}</td>
                            <td>{spend.details}</td>
                        </tr>    
                    ))}
                </tbody>
            </table>
        </>
    )
}
import { use } from "react";
import { useState, useEffect } from "react";

const Details = () => {
    const URL = `http://3.89.31.205:5000/workout`;
    const [record, setRecord] = useState();
    const [details, setDetails] = useState([]);
    const detailsId = localStorage.getItem('detailsId');

    const fetchDetails = async () => {
        try{
            const res = await fetch(`${URL}/getrecord?detailsId=${detailsId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();
            setRecord(data);
            setDetails(data.details);
            console.log(data);
        } catch (error) {
            console.error('Error fetching details:', error);
        }
    }

    const analyzeDetails = () => {
        const totalWeight = details.reduce((acc, detail) => acc + detail.weight, 0);
        const totalWorkoutTime = details.reduce((acc, detail) => acc + detail.duration, 0);
        // console.log(details.endTime, details.startTime);
        const totalTime = Math.floor((new Date(record.endTime) - new Date(record.startTime)) / 1000);
        const trainingPercentage = (totalWorkoutTime / totalTime) * 100;
        console.log('Total Weight:', totalWeight);
        console.log('Total Workout Time:', totalWorkoutTime);
        console.log('Total Time:', totalTime);
        console.log('Training Percentage:', trainingPercentage);
    }

    useEffect(() => {
        fetchDetails();
    },[]);

    useEffect(() => {
        if(details.length > 0 && record){
            analyzeDetails();
        }
        
    },[details, record]);

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Portion</th>
                        <th>Exercise</th>
                        <th>Weight</th>
                        <th>Replication</th>
                        <th>Duration</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {details.length > 0 && details.map((detail) => (
                        <tr>
                            <td>{detail.portion}</td>
                            <td>{detail.exercise}</td>
                            <td>{detail.weight}</td>
                            <td>{detail.replication}</td>
                            <td>{detail.duration}</td>
                            <td><button>Edit</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            
        </div>
    )
}

export default Details;
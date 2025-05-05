import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


const Recording = () => {
    const [workouts, setWorkouts] = useState([]);
    const [selectedWorkout, setSelectedWorkout] = useState('');
    const [exercises, setExercises] = useState([]);
    const [selectedExercise, setSelectedExercise] = useState('');
    const [weight, setWeight] = useState(0);
    const [duration, setDuration] = useState(0);
    const [replication, setReplication] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [currentSet, setCurrentSet] = useState(null);

    const navigate = useNavigate();

    const recordId = localStorage.getItem('recordId');
    const URL = `http://3.89.31.205:5000/workout`;
    const userId = useSelector((state) => state.auth.userId);
    ///---Selection Logic---///
    // Fetching workouts from JSON file
    const fetchSesions = async () => {
        try{
            const res = await fetch('/workouts.json');
            const data = await res.json();
            // console.log(data);
            setWorkouts([{portion: 'SELECT PORTION'}, ...data]);
        } catch (error) {
            console.error('Error fetching sessions:', error);
        }
    }
    // set workouts
    useEffect(() => {
        fetchSesions();
        setSelectedWorkout(workouts[0]?.portion || '');
    },[]);

    // set exercises
    useEffect(() => {
        if(!selectedWorkout || selectedWorkout === 'SELECT PORTION') return;
        // console.log('Selected session changed:', selectedWorkout);
        const selected = workouts.find((workout) => workout.portion === selectedWorkout);
        if(selected){
            console.log('Selected workout:', selected);
            setExercises([{name: "SELECT EXERCISE"}, ...selected.exercises]);
            setSelectedExercise(exercises[0]?.name || '');
            // setExercises(selected.exercises);
        }
    },[selectedWorkout]);


    ////---Timer logic---////
    // useEffect(() => {
    //     console.log(selectedWorkout, selectedExercise);
    //     if(selectedWorkout !== 'SELECT PORTION' && selectedExercise !== 'SELECT EXERCISE' && selectedWorkout !== '' && selectedExercise !== ''){
    //         console.log('timer started');
    //         setIsRunning(true);
    //     }
        
    // },[selectedWorkout, selectedExercise]);

    useEffect(() => {
        let timer = null;
        if(isRunning){
            timer = setInterval(() => {
                setDuration((second) => second + 1);
            }, 1000);
        }
        return () => clearInterval(timer); 
    },[isRunning]);

    
    ///---Recording logic---///
    const handleRecording = async () => {
        // finishing the current set, update the detailed record
        if(isRunning){
            setIsRunning(false);
            // setSelectedExercise('SELECT EXERCISE');
            setDuration(0);

            // upload the deatiled record
            try{
                const newRecord = {
                    "recordId": recordId,
                    "portion": selectedWorkout,
                    "exercise": selectedExercise,
                    "duration": duration,
                    "weight": weight,
                    "replication": replication
                }
                const res = await fetch(`${URL}/updaterecord`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newRecord)
                });
                if(res.ok){
                    console.log('Record updated successfully!');
                }
            } catch (error) {
                console.error('Error updating set:', error);
            }

        }
        // resume the recording
        else
        {
            if(selectedWorkout === 'SELECT PORTION' || selectedExercise === 'SELECT EXERCISE'){
                alert('Please select a portion and an exercise first!');
                return;
            }
            setDuration(0);
            setIsRunning(true);
            // update this set logic

        }
        
    }

    const endRecording = async () => {
        try{ 
            const endTime = new Date().toISOString();
            const data = {
                "userId": userId,
                "recordId": recordId,
                "endTime": endTime,
                "portion": selectedWorkout
            }
            const res = await fetch(`${URL}/endrecord`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if(res.ok){
                alert('Record uploaded successfully!');
                navigate('/calendar');
            }
        } catch(error){
            console.error('Error ending record:', error);
        }
    }
    

    return(
        <div className="flex flex-col bg-teal-300/50  p-2 rounded-lg gap-2">
            <p className="font-bold">Portion</p>
            <select 
                className="bg-teal-100/80 border-1 rounded-md p-1 hover:bg-teal-100 cursor-pointer"
                onChange={(e) => setSelectedWorkout(e.target.value)} value={selectedWorkout}
            >
                {workouts.map((workout, index) => (
                    <option value={workout.portion} key={index}>{workout.portion}</option>
                ))}
                {/* <option>Add More</option> */}
            </select>

            <p className="font-bold">Exercise</p>
            <select 
                className="bg-teal-100/80 border-1 rounded-md p-1 hover:bg-teal-100 cursor-pointer"
                value={selectedExercise} onChange={(e) => setSelectedExercise(e.target.value)}
            >
                {exercises && exercises.map((exercise, index) => (
                    <option value={exercise.name} key={index}>{exercise.name}</option>
                ))}
            </select>

            <p className="font-bold">Weight</p>
            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)}
                className="bg-teal-100/80 border-1 rounded-md p-1 hover:bg-teal-100 cursor-pointer"
            />

            <p className="font-bold">Duration this set</p>
            <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)}
                className="bg-teal-100/80 border-1 rounded-md p-1 hover:bg-teal-100 cursor-pointer"
            />
            <p className="font-bold">Replications</p>
            <input type="number" value={replication} onChange={(e) => setReplication(e.target.value)}
                className="bg-teal-100/80 border-1 rounded-md p-1 hover:bg-teal-100 cursor-pointer"
            />
            <div className="flex flex-row gap-2 justify-center">
                <button className="bg-white p-2 rounded-md" onClick={() => handleRecording()}>
                    {isRunning? 'Stop' : 'Start'}
                </button>
                {/* <button className="bg-white p-2 rounded-md">Next Formation</button> */}
                <button className="bg-red-600 text-white p-2 rounded-md 
                    disabled={!isRunning}
                    disabled:bg-gray-200 disabled:text-black disabled:cursor-not-allowed" 
                    onClick={() => endRecording()}
                >
                    {isRunning ? 'End This Set First' : 'Finished'}
                </button>
            </div>
            
        </div>
    )
}

export default Recording;
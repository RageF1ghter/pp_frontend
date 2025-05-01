import { useState, useEffect } from "react";


const Recording = () => {
    const [workouts, setWorkouts] = useState([]);
    const [selectedWorkout, setSelectedWorkout] = useState('');
    const [exercises, setExercises] = useState([]);
    const [selectedExercise, setSelectedExercise] = useState('');
    const [weight, setWeight] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [currentSet, setCurrentSet] = useState(null);

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
    useEffect(() => {
        console.log(selectedWorkout, selectedExercise);
        if(selectedWorkout !== 'SELECT PORTION' && selectedExercise !== 'SELECT EXERCISE' && selectedWorkout !== '' && selectedExercise !== ''){
            console.log('timer started');
            setIsRunning(true);
        }
        
    },[selectedWorkout, selectedExercise]);

    useEffect(() => {
        let timer = null;
        if(isRunning){
            timer = setInterval(() => {
                setDuration((second) => second + 1);
            }, 1000);
        }
        return () => clearInterval(timer); 
    },[isRunning]);

    
    ///---Switching logic---///

    const handleNextSet = () => {
        if(isRunning){
            console.log('cool down');
            setIsRunning(false);
        }else{
            setDuration(0);
            setIsRunning(true);
            // update this set logic

        }
        
    }

    const updateSet = async () => {
        try{ 

        } catch(error){

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
            <input type="number"
                className="bg-teal-100/80 border-1 rounded-md p-1 hover:bg-teal-100 cursor-pointer"
            />
            <div className="flex flex-row gap-2 justify-center">
                <button className="bg-white p-2 rounded-md" onClick={() => handleNextSet()}>
                    {isRunning? 'Set Done' : 'Next Set'}
                </button>
                <button className="bg-white p-2 rounded-md">Next Formation</button>
                <button className="bg-red-600 text-white p-2 rounded-md 
                    disabled:bg-gray-200 disabled:text-black disabled:cursor-not-allowed" 
                    disabled={!isRunning}>
                    {isRunning ? 'End This Set First' : 'Finished'}
                </button>
            </div>
            
        </div>
    )
}

export default Recording;
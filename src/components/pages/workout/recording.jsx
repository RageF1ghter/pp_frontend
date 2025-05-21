import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


const Recording = () => {
    const [workouts, setWorkouts] = useState([{ portion: 'SELECT PORTION' }]);
    const [selectedWorkout, setSelectedWorkout] = useState('');
    const [exercises, setExercises] = useState([{ name: "SELECT EXERCISE" }]);
    const [selectedExercise, setSelectedExercise] = useState('');
    const [weight, setWeight] = useState(0);
    const [duration, setDuration] = useState(0);
    const [replication, setReplication] = useState(0);
    const [coolingTime, setCoolingTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [finishedSets, setFinishedSets] = useState([]);

    const navigate = useNavigate();

    const recordId = localStorage.getItem('recordId');
    const URL = `http://3.89.31.205:5000/workout`;
    const userId = useSelector((state) => state.auth.userId);




    ///---Selection Logic---///
    // Fetching workouts from JSON file
    const fetchSesions = async () => {
        try {
            const res = await fetch('/workouts.json');
            const data = await res.json();
            // console.log(data);
            setWorkouts([...workouts, ...data]);
        } catch (error) {
            console.error('Error fetching sessions:', error);
        }
    }
    // set workouts
    useEffect(() => {
        fetchSesions();
        setSelectedWorkout(workouts[0]?.portion || '');
    }, []);
    // set exercises
    useEffect(() => {
        if (!selectedWorkout || selectedWorkout === 'SELECT PORTION') return;
        // console.log('Selected session changed:', selectedWorkout);
        const selected = workouts.find((workout) => workout.portion === selectedWorkout);
        if (selected) {
            console.log('Selected workout:', selected);
            setExercises([...exercises, ...selected.exercises]);
            setSelectedExercise(exercises[0]?.name || '');
            // setExercises(selected.exercises);
        }
    }, [selectedWorkout]);


    ////---Timer logic---////
    useEffect(() => {
        let timer = null;
        if (isRunning) {
            setCoolingTime(0);
            timer = setInterval(() => {
                setDuration((second) => second + 1);
            }, 1000);
        } else {
            timer = setInterval(() => {
                setCoolingTime((second) => second + 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isRunning]);

    const timeDisplay = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }



    ///---Recording logic---///
    const handleRecording = async () => {

        // finishing the current set, update the detailed record
        if (isRunning) {
            setIsRunning(false);
            // setSelectedExercise('SELECT EXERCISE');
            setDuration(0);

            // upload the deatiled record
            try {
                const newRecord = {
                    "recordId": recordId,
                    "portion": selectedWorkout,
                    "exercise": selectedExercise,
                    "duration": duration,
                    "weight": weight,
                    "replication": replication
                }
                setFinishedSets((prevSets) => [...prevSets, newRecord]);

                const res = await fetch(`${URL}/updaterecord`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newRecord)
                });
                if (res.ok) {

                    console.log('Record updated successfully!');
                }
            } catch (error) {
                console.error('Error updating set:', error);
            }

        }
        // resume the recording
        else {
            console.log(selectedWorkout, selectedExercise);
            if (selectedWorkout === 'SELECT PORTION' || selectedExercise === 'SELECT EXERCISE') {

                alert('Please select a portion and an exercise first!');
                return;
            }
            setDuration(0);
            setIsRunning(true);
            // update this set logic

        }

    }

    const endRecording = async () => {
        try {
            const endTime = new Date().toISOString();
            const data = {
                "userId": userId,
                "recordId": recordId,
                "endTime": endTime,
                "portion": selectedWorkout
            }
            // const test = 'http://localhost:5000/workout'
            const res = await fetch(`${URL}/endrecord`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                alert('Record uploaded successfully!');
                localStorage.removeItem('recordId');
                navigate('/calendar');
            }
        } catch (error) {
            console.error('Error ending record:', error);
        }
    }


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg space-y-6">

                {/* Timer */}
                <h1 className="text-2xl font-bold text-center">
                    {isRunning ? (
                        <>Recording: <span className="text-sky-500">{timeDisplay(duration)}</span></>
                    ) : (
                        <>Cooling Down: <span className="text-red-500">{timeDisplay(coolingTime)}</span></>
                    )}
                </h1>
                
                {/* Portion and Exercise Selection */}
                <div className="space-y-4">
                    <div>
                        <label className="font-semibold">Portion</label>
                        <select
                            className="w-full mt-1 p-2 bg-teal-100 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
                            value={selectedWorkout}
                            onChange={(e) => setSelectedWorkout(e.target.value)}
                        >
                            {workouts.map((workout, index) => (
                                <option value={workout.portion} key={index}>{workout.portion}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="font-semibold">Exercise</label>
                        <select
                            className="w-full mt-1 p-2 bg-teal-100 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
                            value={selectedExercise}
                            onChange={(e) => setSelectedExercise(e.target.value)}
                        >
                            {exercises && exercises.map((exercise, index) => (
                                <option value={exercise.name} key={index}>{exercise.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="font-semibold">Weight</label>
                        <input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(parseInt(e.target.value))}
                            className="w-full mt-1 p-2 bg-teal-100 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
                        />
                    </div>
                    <div>
                        <label className="font-semibold">Repetitions</label>
                        <input
                            type="number"
                            value={replication}
                            onChange={(e) => setReplication(parseInt(e.target.value))}
                            className="w-full mt-1 p-2 bg-teal-100 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
                        />
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-between gap-4">
                    <button
                        onClick={handleRecording}
                        className="flex-1 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                        {isRunning ? 'Stop' : 'Start'}
                    </button>
                    <button
                        onClick={endRecording}
                        disabled={isRunning}
                        className={`flex-1 py-2 rounded-md transition ${isRunning
                            ? 'bg-gray-200 text-black cursor-not-allowed'
                            : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                    >
                        {isRunning ? 'End This Set First' : 'Finished'}
                    </button>
                </div>

                {/* Finished Info */}
                <div className="pt-4 border-t">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Already Finished:</p>
                    {finishedSets.length === 0 ? (
                        <p className="text-sm text-gray-500">No sets completed yet.</p>
                    ) : (
                        <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
                            {finishedSets.map((set, index) => (
                                <li key={index} className="text-sm bg-teal-100 p-2 rounded-md shadow-sm">
                                    <p><span className="font-medium">Portion:</span> {set.portion}</p>
                                    <p><span className="font-medium">Exercise:</span> {set.exercise}</p>
                                    <p><span className="font-medium">Weight:</span> {set.weight} lbs</p>
                                    <p><span className="font-medium">Reps:</span> {set.replication}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>

    )
}

export default Recording;
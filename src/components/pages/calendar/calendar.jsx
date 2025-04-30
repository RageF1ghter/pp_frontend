import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Modal from 'react-modal'
import { useNavigate } from "react-router-dom";

const Calendar = () => {
    const userId = useSelector(state => state.auth.userId);
    const URL = `http://3.89.31.205:5000/workout`
    const today = new Date();
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [currentDay, setCurrentDay] = useState(new Date().getDate());
    const [currentDayOfWeek, setCurrentDayOfWeek] = useState(today.getDay());
    const [cells, setCells] = useState([]);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    // const [records, setRecords] = useState([]);


    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const prevMonth = () => {
        if (currentMonth === 1) {
            setCurrentYear(currentYear - 1);
            setCurrentMonth(12);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    }

    const nextMonth = () => {
        if (currentMonth === 12) {
            setCurrentYear(currentYear + 1);
            setCurrentMonth(1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    }

    const getRecords = async () => {
        try {
            // prepare the cells for the current month
            const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1);
            const firstDayOfWeek = firstDayOfMonth.getDay();
            const totalDays = new Date(currentYear, currentMonth, 0).getDate();
            let cellsOfMonth = [];
            for (let i = 0; i < firstDayOfWeek; i++) {
                cellsOfMonth.push({});
            }
            for (let i = 1; i <= totalDays; i++) {
                cellsOfMonth.push({ day: i, records: [] });
            }
            // console.log(cellsOfMonth);
            // setCells(cellsOfMonth);

            // get the records for the current month
            const date = `${currentYear}-${currentMonth}-${currentDay}`;
            const res = await fetch(`${URL}?userId=${userId}&date=${date}`);
            const data = await res.json();
            // setRecords(data);
            // console.log(data);
            // const tempCells = [...cells];
            for (let record of data) {
                const day = parseInt(record.date.split("-")[2].split("T")[0]);
                cellsOfMonth.find(cell => cell.day === day).records.push(record);
            }
            setCells([...cellsOfMonth]);
        } catch (error) {
            console.log(error);
        }
    }

    const addRecord = async () => {
        try {
            const res = await fetch(`${URL}/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(selectedRecord)
            });
            if ( res.ok ){
                console.log('Record added successfully');
                closeModal();
                getRecords();
            } else {
                console.log('Failed to add record');
            }

        } catch (error) {
            console.log(error, 'Error adding record');
        }

    }

    const updateRecord = async () => {
        try{
            const res = await fetch(`${URL}/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({record: selectedRecord})
            });
            if (res.ok) {
                console.log('Record edited successfully');
                closeModal();
                getRecords();
            } else {
                console.log('Failed to edit record');
            }
        } catch(error) {
            console.log(error, 'Error editing record');
        }
    }

    const deleteRecord = async () => {
        try{
            const res = await fetch(`${URL}/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({_id : selectedRecord._id})
            });
            if (res.ok) {
                console.log('Record deleted successfully');
                closeModal();
                getRecords();
            } else {
                console.log('Failed to delete record');
            }
        } catch(error) {
            console.log(error, 'Error deleting record');
        }
    }

    // open the modal and init the selected record
    const openModal = (day, record) => {
        console.log(day, record);
        setOpen(true);
        if (!record) {
            const date = `${currentYear}-${currentMonth}-${day}`;
            const emptyRecord = {
                userId: userId,
                category: '',
                duration: '',
                date: date,
                note: ''
            }
            setSelectedRecord(emptyRecord);
        } else {
            setSelectedRecord(record);
        }
    }

    const closeModal = () => {
        setOpen(false);
        setSelectedRecord(null);
    }

    const startRecord = () => {
        navigate('/recording')
        console.log('start record');
    }

    useEffect(() => {
        getRecords();
    }, [currentMonth, currentYear, currentDay]);

 
    return (
        <>
            <div>
                <h1>Calendar</h1>
                <div className="calendar">
                    <div className="dayOfWeek grid grid-cols-7 text-center font-bold">
                        {daysOfWeek.map((day, index) => (
                            <div key={index} className="py-2">{day}</div>
                        ))}
                    </div>

                    <div className="days grid grid-cols-7 auto-rows-[100px]">
                        {cells.map((cell, index) => (
                            <div key={index}
                                onClick={() => (openModal(cell.day, null))}
                                className="pb-8 border border-gray-200 text-left align-top"
                            >
                                {cell.day===today.getDate() && currentMonth===today.getMonth()+1 && currentYear===today.getFullYear() ? 
                                   <div>
                                        {cell.day}
                                        <button
                                            className="bg-rose-400 text-white px-2 py-1 rounded-sm hover:cursor-pointer"
                                            onClick={(e) => (e.stopPropagation(), startRecord())}
                                        >
                                            Start Record
                                        </button>
                                   </div>
                                   
                                : 
                                (<div>
                                    {cell.day || ""}
                                    {cell.records && cell.records.map(record =>
                                        <p key={record._id}
                                            onClick={(e) => {
                                                openModal(cell.day, record);
                                                e.stopPropagation();
                                            }}
                                            className="hover:bg-gray-200 cursor-pointer"
                                        >
                                            {`${record.category} ${record.duration} mins`}
                                        </p>
                                    )}
                                </div>)
                                
                                }
                                
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-row justify-center">
                    <button className="m-3 px-3 py-1 rounded-xl bg-blue-300 hover:bg-blue-500" onClick={prevMonth}>Prev</button>
                    <button className="m-3 px-3 py-1 rounded-xl bg-blue-300 hover:bg-blue-500" onClick={nextMonth}>Next</button>
                </div>
            </div>

            <div>
                {selectedRecord && (
                    <Modal
                        isOpen={open}
                        onRequestClose={closeModal}
                        className="bg-emerald-200 rounded-lg p-10
                        flex flex-col gap-2
                        absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    >
                        <h2>{selectedRecord.date.split('T')[0]}</h2>
                        <div className="flex flex-col gap-0.5">
                            <label htmlFor="category" className="text-xs">Category:</label>
                            <input type="text" id="category"
                                className="bg-emerald-50 rounded-sm px-2 py-1"
                                value={selectedRecord.category}
                                onChange={(e) => setSelectedRecord({ ...selectedRecord, category: e.target.value })}
                            />
                        </div>

                        <div className="flex flex-col gap-0.5">
                            <label htmlFor="duration" className="text-xs">Duration:</label>
                            <input type="text" id="duration"
                                className="bg-emerald-50 rounded-sm px-2 py-1"
                                value={selectedRecord.duration}
                                onChange={(e) => setSelectedRecord({ ...selectedRecord, duration: e.target.value })}
                            />
                        </div>

                        <div className="flex flex-col gap-0.5">
                            <label htmlFor="note" className="text-xs">Note:</label>
                            <input type="text" id="note"
                                className="bg-emerald-50 rounded-sm px-2 py-1"
                                value={selectedRecord.note}
                                onChange={(e) => setSelectedRecord({ ...selectedRecord, note: e.target.value })}
                            />
                        </div>

                        
                        {selectedRecord._id ? (
                            <div className="flex flex-row gap-2">
                                <button
                                    className="bg-emerald-700 text-white px-2 py-1 rounded-sm hover:cursor-pointer"
                                    onClick={() => (updateRecord())}
                                >
                                    Edit
                                </button>
                                <button
                                    className="bg-red-700 text-white px-2 py-1 rounded-sm hover:cursor-pointer"
                                    onClick={() => deleteRecord()}
                                >
                                    Delete
                                </button>
                                <button
                                    className="bg-amber-500 text-white px-2 py-1 rounded-sm hover:cursor-pointer"
                                    onClick={() => (closeModal())}
                                >
                                    Close
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-row gap-2">
                                <button
                                    className="bg-emerald-700 text-white px-2 py-1 rounded-sm hover:cursor-pointer"
                                    onClick={() => (addRecord())}
                                >
                                    Add
                                </button>
                                <button
                                    className="bg-amber-500 text-white px-2 py-1 rounded-sm hover:cursor-pointer"
                                    onClick={() => (closeModal())}
                                >
                                    Close
                                </button>
                            </div>
                        )}


                        

                    </Modal>
                )}
            </div>
        </>


    )
}

export default Calendar;
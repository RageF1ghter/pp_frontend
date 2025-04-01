import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from '@fullcalendar/interaction';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Modal from 'react-modal'

Modal.setAppElement('#root'); // For accessibility, set the app element for the modal

function FullCalendarComponent() {
    const [records, setRecords] = useState([]);
    const userId = useSelector(state => state.auth.userId);
    const [open, setOpen] = useState(false);
    const [newRecord, setNewRecord] = useState({
        userId: userId,
        category: '',
        duration: '',
        date: null,
        note: ''
    });
    const [startDate, setStartDate] = useState(new Date());



    const fetchRecords = async () => {
        try {
            
            const dateString = startDate.toISOString().split('T')[0].split('-'); // Format the date as YYYY-MM-DD
            const date = dateString[0] + '-' + dateString[1] + '-' + '01'; // YYYY-MM-DD format
            console.log(date)
            const res = await fetch(`http://localhost:5000/workout/?userId=${userId}&date=${date}`);
            const data = await res.json();
            setRecords(data);

        } catch (error) {
            console.log(error, 'Error fetching records');
        }
    }


    useEffect(() => {
        fetchRecords();
    }, [userId, startDate]);
    // useEffect(() => {
    //     console.log(records);
    // }, []);

    const closeModal = () => {
        setOpen(false);
        setNewRecord({
            userId: userId,
            category: '',
            duration: '',
            date: null,
            note: ''
        }); // Reset the newRecord state when closing the modal
    };

    const handleAdd = async () => {
        console.log(newRecord)
        try {
            const res = await fetch(`http://localhost:5000/workout/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newRecord)
            });
            if (res.ok) {
                console.log('Record added successfully');
                closeModal(); // Close the modal after adding the record
                fetchRecords(); // Refresh the records to show the newly added one
            } else {
                console.log('Failed to add record');
            }
        } catch (error) {
            console.log(error, 'Error adding record');
        }
    }

    return (
        <div>

            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={
                    records.map(record => {
                        return {
                            title: record.category,
                            date: record.date.split('T')[0],
                            extendedProps: {
                                duration: record.duration
                            },
                        }
                    })
                }
                eventContent={(eventInfo) => (
                    <>
                        <b>{eventInfo.event.title}</b>
                        <i> ({eventInfo.event.extendedProps.duration} mins)</i>
                    </>
                )}
                dateClick={(info) => {
                    if (!open) {
                        console.log('Date clicked:', info.dateStr);
                        setOpen(true);
                        
                        const [year, month, day] = info.dateStr.split('-');
                        const localDate = new Date(year, month - 1, day);
                        console.log('Local date:', localDate);
                        const record = records.find(record => record.date.split('T')[0] === info.dateStr);
                        if(record){
                            setNewRecord(record);
                        }else{
                            setNewRecord({ ...newRecord, date: localDate });
                        }
                        
                    } else {
                        console.log('overlapping')
                    }
                }}
                datesSet={(dateInfo) => {
                    setStartDate(dateInfo.view.currentStart);
                    console.log('Start date:', dateInfo.view.currentStart);
                }}
            />



            <Modal
                isOpen={open}
                onRequestClose={closeModal}
                shouldCloseOnEsc={true}
                overlayClassName="fixed inset-0 flex justify-center items-center z-1"
                className="bg-cyan-300 rounded-lg shadow-xl w-96 p-6"
            >
                <div className="p-4">
                    <label htmlFor="type" className="block mb-2">Category</label>
                    <input
                        value={newRecord.category}
                        onChange={(e) => setNewRecord({ ...newRecord, category: e.target.value })}
                        type="text" id="type" className="w-full mb-4 p-2 rounded bg-white"
                    />
                    <label htmlFor="time">Duration</label>
                    <input
                        value={newRecord.duration}
                        onChange={(e) => setNewRecord({ ...newRecord, duration: parseInt(e.target.value) })}
                        type="text" id="time" className="w-full mb-4 p-2 rounded bg-white"
                    />
                    <label htmlFor="note">Note</label>
                    <input
                        value={newRecord.note}
                        onChange={(e) => setNewRecord({ ...newRecord, note: e.target.value })}
                        type="text" id="note" className="w-full mb-4 p-2 rounded bg-white"
                    />
                    <div className="flex gap-x-2">
                        <button
                            className="bg-green-500 px-4 py-2 rounded text-white hover:bg-green-600"
                            onClick={handleAdd}
                        >Add</button>
                        <button
                            onClick={closeModal}
                            className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </Modal>
        </div>

    );
}

export default FullCalendarComponent;
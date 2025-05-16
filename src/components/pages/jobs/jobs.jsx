import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function Jobs() {
    const URL = `http://3.89.31.205:5000/jobs`
    const userId = useSelector((state) => state.auth.userId);
    const [records, setRecords] = useState([]);
    const [displayRecords, setDisplayRecords] = useState([]);
    const [newApp, setNewApp] = useState({
        company: "",
        dateString: new Date().toISOString(),
        status: "applied",
        notes: ""
    });
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [filter, setFilter] = useState({
        status: "applied",
        sortBydate: "asc",
        company: ""
    })
    // const [debouncedCompany, setDebouncedCompany] = useState("");


    // CURD operations
    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${URL}/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    company: newApp.company,
                    dateString: newApp.dateString,
                    status: newApp.status,
                    notes: newApp.notes
                })
            });
            if (res.ok) {
                const data = await res.json();
                console.log(data);
                setRecords((prev) => [...prev, data.job]);
                setNewApp({ ...newApp, company: "" });
                console.log("Application added successfully!");
            }

        } catch (error) {
            console.error("Error adding application:", error);
        }
    };

    const fetchRecords = async () => {
        try {
            const res = await fetch(`${URL}?userId=67a28b8829f3ba8beda0e216`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },

            });

            if (res.ok) {
                const data = await res.json();
                console.log(data);
                setRecords(data);
                setDisplayRecords(data);
            }
        } catch (error) {
            console.error("Error fetching records:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`${URL}/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    _id: id
                })
            });
            if (res.ok) {
                const restRecords = records.filter((record) => record._id !== id);
                setRecords(restRecords);
                setDisplayRecords(restRecords);
                console.log("Application deleted successfully!");
            }
        } catch (error) {
            console.error("Error deleting application:", error);
        }
    }

    const handleUpdate = async () => {
        try {
            if (!selectedRecord) return;
            const res = await fetch(`${URL}/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    _id: selectedRecord._id,
                    company: selectedRecord.company,
                    status: selectedRecord.status,
                    date: selectedRecord.date,
                    notes: selectedRecord.notes
                })
            });
            if (res.ok) {
                const updatedRecords = records.map((record) => {
                    if (record._id === selectedRecord._id) {
                        return { ...record, status: selectedRecord.status };
                    }
                    return record;
                });
                setRecords(updatedRecords);
                setDisplayRecords(updatedRecords);
                console.log("Application updated successfully!");
            }
        } catch (error) {
            console.error("Error updating application:", error);
        }
    }

    const handleCancel = async () => {
        try {
            const res = await fetch(`${URL}/getById?id=${selectedRecord._id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();
            const newReocrds = records.map((record) => {
                if (record._id === data._id) {
                    return data;
                }
                return record;
            })
            setRecords(newReocrds);
            setDisplayRecords(newReocrds);
            setSelectedRecord(null);
        } catch (error) {
            console.error("Error cancelling modification:", error);
        }
    }


    // Table munipulations
    const handleStatusChange = (e, id) => {
        const modifiedRecord = records.find((record) => record._id === id);
        modifiedRecord.status = e.target.value;
        setSelectedRecord(modifiedRecord);
        const newRecords = records.map((record) => {
            if (record._id === id) {
                return { ...record, status: e.target.value };
            }
            return record;
        });
        // setRecords(newRecords);
        setDisplayRecords(newRecords);
    }
    const handleSort = () => {
        if (filter.sortBydate === "asc") {
            const sortedRecords = records.sort((a, b) => new Date(b.date) - new Date(a.date));
            // setRecords([...sortedRecords]);
            setDisplayRecords(sortedRecords);
            setFilter({ ...filter, sortBydate: "desc" });
        } else {
            const sortedRecords = records.sort((a, b) => new Date(a.date) - new Date(b.date));
            // setRecords([...sortedRecords]);
            setDisplayRecords(sortedRecords);
            setFilter({ ...filter, sortBydate: "asc" });
        }

    }
    const handleSearch = (name) => {
        const filteredRercords = records.filter((record) => record.company.toLowerCase().includes(name.toLowerCase()));
        // setRecords(filteredRercords);
        setDisplayRecords(filteredRercords);
    };

    // search by company
    useEffect(() => {
        if (filter.company === "") {
            // fetchRecords();
            // setDebouncedCompany("");
            setDisplayRecords(records);
        } else {
            const timer = setTimeout(() => {
                handleSearch(filter.company);
            }, 500);
            return () => clearTimeout(timer);
        }

    }, [filter.company]);

    // filter by status
    useEffect(() => {
        const filteredRecords = records.filter((record) => record.status === filter.status);
        setDisplayRecords(filteredRecords);
    },[filter.status]);


    useEffect(() => {
        fetchRecords();
    }, []);


    let lastDate = new Date().toLocaleDateString();
    let toggleColor = false;
    return (
        <div className="flex flex-col gap-5">
            <form onSubmit={handleAdd} className="flex flex-row gap-2 justify-center">
                <p>Company</p>
                <input type="text" value={newApp.company} onChange={(e) => (setNewApp({ ...newApp, company: e.target.value }))}
                    className="border-2 border-black"
                />
                <p>Date</p>
                <input type="date" value={newApp.dateString.split('T')[0]} onChange={(e) => (setNewApp({ ...newApp, dateString: e.target.value }))}
                    className="border-2 border-black"
                />
                <p>status</p>
                <select
                    value={newApp.status} onChange={(e) => setNewApp({ ...newApp, status: e.target.value })}
                    className="border-2 border-black">
                    <option value="applied">APPLIED</option>
                    <option value="rejected">REJECT</option>
                    <option value="in progress">IN PROGRESS</option>
                </select>
                <button type="submit" className="bg-green-400 px-2 py-1">ADD</button>
            </form>

            {/* Filters */}
            <div className="flex flex-row gap-10 justify-center">
                <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })} className="border-2 border-black">
                    <option value="applied">APPLIED</option>
                    <option value="rejected">REJECT</option>
                    <option value="in progress">IN PROGRESS</option>
                </select>
                
                {filter.sortBydate !== "asc" ?
                    <button onClick={() => handleSort()} className="bg-gray-300 p-2 rounded-2xl">New to Old</button>
                    :
                    <button onClick={() => handleSort()} className="bg-gray-300 p-2 rounded-2xl">Old to New</button>
                }
                <div className="flex flex-row gap-2 items-center">
                    <p>Search by Company:</p>
                    <input type="text" className="border-2" value={filter.company} onChange={(e) => setFilter({ ...filter, company: e.target.value })} />
                </div>

                <button className="bg-green-300 p-2 rounded-2xl" onClick={() => setDisplayRecords(records)}>Reset Filter</button>

            </div>

            {/* Table */}
            <div className="flex justify-center">
                <table className="border-2 border-black border-collapse w-2/3 mb-5">
                    <thead>
                        <tr className="border-2 border-black divide-x-2">
                            <td className="px-5 py-0.5">Company</td>
                            <td className="px-5 py-0.5">Date</td>
                            <td className="px-5 py-0.5">Status</td>
                            <td className="px-5 py-0.5">Notes</td>
                            <td className="px-5 py-0.5">Action</td>
                        </tr>

                    </thead>
                    
                    <tbody>
                        {displayRecords.length > 0 && displayRecords.map((record) => {
                            const currentDate = new Date(record.date).toLocaleDateString();
                            if(currentDate !== lastDate) {
                                toggleColor = !toggleColor;
                                lastDate = currentDate;
                            }
                            const toggleColorClass = toggleColor ? "bg-gray-200" : "bg-white";
                            return (
                                <tr key={record._id} className={`border-2 border-black divide-x-2
                                    ${toggleColorClass}
                                `}>
                                    <td className="px-5 py-0.5">{record.company}</td>
                                    <td className="px-5 py-0.5">{new Date(record.date).toLocaleDateString()}</td>
                                    <td className="px-5 py-0.5">
                                        <select value={record.status} onChange={(e) => handleStatusChange(e, record._id)}>
                                            <option value="applied">APPLIED</option>
                                            <option value="rejected">REJECT</option>
                                            <option value="in progress">IN PROGRESS</option>
                                        </select>
                                    </td>
                                    <td className="px-5 py-0.5">{record.notes}</td>
                                    <td className="px-5 py-0.5 flex flex-row gap-2">
                                        <button className="bg-green-400 rounded-2xl text-white p-1" onClick={() => handleUpdate()}>Update</button>
                                        <button className="bg-amber-400 rounded-2xl text-white p-1" onClick={() => handleCancel()}>Cancel</button>
                                        <button className="bg-red-600 rounded-2xl text-white p-1" onClick={() => handleDelete(record._id)}>Delete</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

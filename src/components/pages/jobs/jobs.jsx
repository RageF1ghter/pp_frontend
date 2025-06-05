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
        sortBydate: "desc",
        company: ""
    })

    const [summary, setSummary] = useState({
        applied: 0,
        rejected: 0,
        inProgress: 0
    });
    // const [debouncedCompany, setDebouncedCompany] = useState("");


    // responsive design
    const [windowSize, setWindowSize] = useState(window.innerWidth);
    const handleResize = () => {
        setWindowSize(window.innerWidth);
        // console.log(width);
    }
    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [])


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
                setDisplayRecords((prev) => [...prev, data.job]);
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
                data.reverse();
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
                setFilter({ ...filter, company: '' });
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
        // const newRecords = records.map((record) => {
        //     if (record._id === id) {
        //         return { ...record, status: e.target.value };
        //     }W
        //     return record;
        // });
        // setRecords(newRecords);
        // setDisplayRecords(newRecords);
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
    }, [filter.status]);


    useEffect(() => {
        fetchRecords();
    }, []);

    useEffect(() => {
        const appliedCount = records.filter((record) => record.status === "applied").length;
        const rejectedCount = records.filter((record) => record.status === "rejected").length;
        const inProgressCount = records.filter((record) => record.status === "in progress").length;

        setSummary({
            applied: appliedCount,
            rejected: rejectedCount,
            inProgress: inProgressCount
        });
    }, [records]);


    let lastDate = new Date().toLocaleDateString();
    let toggleColor = false;
    return (
        <div className="flex flex-col gap-5">

            {/* Header Section */}
            <div className="flex flex-col gap-2">

                {/* Add Section */}
                <form
                    onSubmit={handleAdd}
                    className="flex flex-row gap-5 p-2"
                >
                    <label className="font-semibold">Company: </label>
                    <input
                        type="text"
                        value={newApp.company}
                        onChange={(e) => setNewApp({ ...newApp, company: e.target.value })}
                        className="border-1 border-black p-0.5 rounded"
                    />

                    <label className="font-semibold">Date</label>
                    <input
                        type="date"
                        value={newApp.dateString.split('T')[0]}
                        onChange={(e) => setNewApp({ ...newApp, dateString: e.target.value })}
                        className="border-1 border-black p-0.5 rounded"
                    />

                    <label className="font-semibold">Status</label>
                    <select
                        value={newApp.status}
                        onChange={(e) => setNewApp({ ...newApp, status: e.target.value })}
                        className="border-1 border-black p-0.5 rounded"
                    >
                        <option value="applied">APPLIED</option>
                        <option value="rejected">REJECT</option>
                        <option value="in progress">IN PROGRESS</option>
                    </select>

                    <button type="submit" className="bg-green-500/80 text-white px-1 rounded hover:bg-green-600">
                        ADD
                    </button>
                </form>

                {/* Filters Section */}
                <div className="flex flex-row gap-5 p-2">

                    <label className="font-semibold">Filter by Status:</label>
                    <select
                        value={filter.status}
                        onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                        className="border-1 border-black p-0.5 rounded"
                    >
                        <option value="applied">APPLIED</option>
                        <option value="rejected">REJECT</option>
                        <option value="in progress">IN PROGRESS</option>
                    </select>

                    
                    <p className="border-1"></p>

                    <button onClick={handleSort} className="border-1 border-black p-0.5 rounded">
                        {filter.sortBydate === "asc" ? "Old to New" : "New to Old"}
                    </button>

                    <p className="border-1"></p>

                    
                    <label className="font-semibold">Search by Company: </label>
                    <input
                        type="text"
                        value={filter.company}
                        onChange={(e) => setFilter({ ...filter, company: e.target.value })}
                        className="border-1 border-black p-0.5 rounded w-5xs"
                    />
                    
                    <p className="border-1 shadow-gray-300 shadow-xl"></p>

                    <button onClick={() => setDisplayRecords(records)} className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600">
                        Reset Filter
                    </button>
                </div>

                {/* summary Section */}
                <div className="px-2">
                    <p className="font-semibold">Applied: {summary.applied}, Reject: {summary.rejected}, In Progress: {summary.inProgress}</p>
                </div>

            </div>



            {/* Table */}
            <div className="flex">
                <table className="table-auto border-2 border-gray-300 border-separate border-spacing-0.5
                 rounded-xl py-1 mb-5 shadow-2xl shadow-gray-600 
                 w-7xl">
                    <thead >
                        <tr className="border-2 border-black divide-x-2">
                            <td className="px-5 py-0.5">Company</td>
                            <td className="px-5 py-0.5">Date</td>
                            <td className="px-5 py-0.5">Status</td>
                            {/* <td className="px-5 py-0.5">Notes</td> */}
                            <td className="px-5 py-0.5">Action</td>
                        </tr>

                    </thead>

                    <tbody>
                        {displayRecords.length > 0 && displayRecords.map((record) => {
                            const currentDate = new Date(record.date).toLocaleDateString();
                            if (currentDate !== lastDate) {
                                toggleColor = !toggleColor;
                                lastDate = currentDate;
                            }
                            const toggleColorClass = toggleColor ? "bg-gray-200" : "bg-white";
                            return (
                                <tr key={record._id} className={`border-2 border-black divide-x-2
                                    ${toggleColorClass}
                                `}>
                                    <td className="px-5 py-1">{record.company}</td>
                                    <td className="px-5 py-1">{new Date(record.date).toLocaleDateString()}</td>
                                    <td className="px-5 py-1">
                                        <select value={record.status} onChange={(e) => handleStatusChange(e, record._id)}>
                                            <option value="applied">APPLIED</option>
                                            <option value="rejected">REJECT</option>
                                            <option value="in progress">IN PROGRESS</option>
                                        </select>
                                    </td>
                                    {/* <td className="px-5 py-1">{record.notes}</td> */}
                                    <td className="px-5 py-1 flex flex-row gap-2">
                                        <button className="bg-green-400 rounded-xl text-white p-1" onClick={() => handleUpdate()}>Update</button>
                                        <button className="bg-amber-400 rounded-xl text-white p-1" onClick={() => handleCancel()}>Cancel</button>
                                        <button className="bg-red-600 rounded-xl text-white p-1" onClick={() => handleDelete(record._id)}>Delete</button>
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

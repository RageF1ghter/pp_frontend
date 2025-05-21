import { use } from "react";
import { useState, useEffect, useRef } from "react";
import * as d3 from 'd3';

const Details = () => {
    const URL = `http://3.89.31.205:5000/workout`;
    const [record, setRecord] = useState();
    const [details, setDetails] = useState([]);
    const [summary, setSummary] = useState({
        totalWeight: 0,
        totalWorkoutTime: 0,
        totalTime: 0,
        trainingPercentage: 0
    });
    const [editIndex, setEditIndex] = useState(null);
    const [editForm, setEditForm] = useState({});
    const detailsId = localStorage.getItem('detailsId');
    const svgRef = useRef();

    const fetchDetails = async () => {
        try {
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
        const totalWorkoutTime = Math.floor(details.reduce((acc, detail) => acc + detail.duration, 0) / 60);
        // console.log(details.endTime, details.startTime);
        const totalTime = Math.floor((new Date(record.endTime) - new Date(record.startTime)) / 1000 / 60);
        const trainingPercentage = (totalWorkoutTime / totalTime) * 100;
        setSummary({
            totalWeight,
            totalWorkoutTime,
            totalTime,
            trainingPercentage
        });
        console.log('Total Weight:', totalWeight);
        console.log('Total Workout Time:', totalWorkoutTime);
        console.log('Total Time:', totalTime);
        console.log('Training Percentage:', trainingPercentage);
    }

    useEffect(() => {
        fetchDetails();
    }, []);


    useEffect(() => {
        if (details.length > 0 && record) {
            analyzeDetails();
            // Aggregate total weight per exercise
            const data = d3.rollups(
                details,
                v => d3.sum(v, d => d.weight * d.replication),
                d => d.exercise
            ).map(([exercise, total]) => ({ exercise, total }));

            // Set dimensions
            const width = 500;
            const height = 300;
            const margin = { top: 30, right: 20, bottom: 40, left: 60 };

            // Clear previous content
            d3.select(svgRef.current).selectAll('*').remove();

            const svg = d3.select(svgRef.current)
                .attr('width', width)
                .attr('height', height);

            const x = d3.scaleBand()
                .domain(data.map(d => d.exercise))
                .range([margin.left, width - margin.right])
                .padding(0.2);

            const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.total)])
                .nice()
                .range([height - margin.bottom, margin.top]);

            // X-axis
            svg.append('g')
                .attr('transform', `translate(0, ${height - margin.bottom})`)
                .call(d3.axisBottom(x))
                .selectAll('text')
                .attr('transform', 'rotate(-30)')
                .style('text-anchor', 'end');

            // Y-axis
            svg.append('g')
                .attr('transform', `translate(${margin.left}, 0)`)
                .call(d3.axisLeft(y));

            // Bars
            svg.selectAll('rect')
                .data(data)
                .join('rect')
                .attr('x', d => x(d.exercise))
                .attr('y', d => y(d.total))
                .attr('width', x.bandwidth())
                .attr('height', d => height - margin.bottom - y(d.total))
                .attr('fill', '#60A5FA'); // Tailwind blue-400
        }


    }, [details]);

    const handleSave = async (_id) => {
        try {
            const res = await fetch(`${URL}/editDetails`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    detailsId: record._id,
                    _id,
                    ...editForm
                }),
            });

            const data = await res.json();
            if (res.ok) {
                // Optional: Refresh local data or update `details` state
                setEditIndex(null);
                fetchDetails();
            } else {
                alert(data.message || "Update failed");
            }
        } catch (err) {
            console.error(err);
            alert("Error updating detail");
        }
    };



    return (
        <div className="flex flex-row gap-5 m-5">
            <table className=" border-collapse border border-gray-300 text-sm shadow-md rounded-md overflow-hidden ">
                <thead className="bg-gray-100 text-left">
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">Portion</th>
                        <th className="border border-gray-300 px-4 py-2">Exercise</th>
                        <th className="border border-gray-300 px-4 py-2">Weight</th>
                        <th className="border border-gray-300 px-4 py-2">Replication</th>
                        <th className="border border-gray-300 px-4 py-2">Duration</th>
                        <th className="border border-gray-300 px-4 py-2">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {details.length > 0 && details.map((detail, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                            {editIndex === index ? (
                                <>
                                    <td className="px-4 py-2"><input type="text" className="border px-2" value={editForm.portion} onChange={e => setEditForm({ ...editForm, portion: e.target.value })} /></td>
                                    <td className="px-4 py-2"><input type="text" className="border px-2" value={editForm.exercise} onChange={e => setEditForm({ ...editForm, exercise: e.target.value })} /></td>
                                    <td className="px-4 py-2"><input type="number" className="border px-2" value={editForm.weight} onChange={e => setEditForm({ ...editForm, weight: e.target.value })} /></td>
                                    <td className="px-4 py-2"><input type="number" className="border px-2" value={editForm.replication} onChange={e => setEditForm({ ...editForm, replication: e.target.value })} /></td>
                                    <td className="px-4 py-2"><input type="number" className="border px-2" value={editForm.duration} onChange={e => setEditForm({ ...editForm, duration: e.target.value })} /></td>
                                    <td className="px-4 py-2">
                                        <button
                                            className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                                            onClick={() => handleSave(detail._id)}
                                        >Save</button>
                                        <button
                                            className="bg-gray-500 text-white px-2 py-1 rounded"
                                            onClick={() => setEditIndex(null)}
                                        >Cancel</button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td className="px-4 py-2">{detail.portion}</td>
                                    <td className="px-4 py-2">{detail.exercise}</td>
                                    <td className="px-4 py-2">{detail.weight}</td>
                                    <td className="px-4 py-2">{detail.replication}</td>
                                    <td className="px-4 py-2">{detail.duration}</td>
                                    <td className="px-4 py-2">
                                        <button
                                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                            onClick={() => {
                                                setEditIndex(index);
                                                setEditForm(detail);
                                            }}
                                        >Edit</button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>

            </table>

            <div className="flex flex-col gap-5">
                <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 w-full max-w-md mx-auto my-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">
                        🕒 Total Workout Time: <span className="font-bold text-blue-600">{summary.totalTime} mins</span>
                    </h2>
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">
                        🏋️ Total Weight: <span className="font-bold text-red-500">{summary.totalWeight} kg</span>
                    </h2>
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">
                        💪 Active Workout Time: <span className="font-bold text-green-600">{summary.totalWorkoutTime} mins</span>
                    </h2>
                    <h2 className="text-lg font-semibold text-gray-700">
                        📊 Training Efficiency: <span className="font-bold text-purple-600">{summary.trainingPercentage.toFixed(2)}%</span>
                    </h2>
                </div>


                <div className="my-8">
                    <h2 className="text-xl font-bold mb-4">Total Weight per Exercise</h2>
                    <svg ref={svgRef}></svg>
                </div>
            </div>

        </div>

    )
}

export default Details;
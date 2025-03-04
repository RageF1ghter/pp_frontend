
const Sensor = () => {
    const sensorData = [
        {
          "id": "sensor-1",
          "location": [784, 210],
          "status": "active",
          "battery": 92,
          "lastUpdated": "2025-02-11T14:30:00.123Z"
        },
        {
          "id": "sensor-2",
          "location": [345, 923],
          "status": "faulty",
          "battery": 15,
          "lastUpdated": "2025-02-11T14:30:00.456Z"
        },
        {
          "id": "sensor-3",
          "location": [100, 789],
          "status": "inactive",
          "battery": 47,
          "lastUpdated": "2025-02-11T14:30:00.789Z"
        }
    ];

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-bold mb-4">IoT Sensor Status Table</h2>
            <div className="overflow-x-auto">
                <table className="w-full bg-white shadow-md rounded-lg">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="p-3 text-left">ID</th>
                            <th className="p-3 text-left">Location</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Battery (%)</th>
                            <th className="p-3 text-left">Last Updated</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sensorData.map(sensor => (
                            <tr key={sensor.id} className="border-b hover:bg-gray-100">
                                <td className="p-3">{sensor.id}</td>
                                <td className="p-3">({sensor.location[0]}, {sensor.location[1]})</td>
                                <td className={`p-3 font-semibold ${sensor.status === "active" ? "text-green-600" : sensor.status === "faulty" ? "text-red-600" : "text-yellow-600"}`}>
                                    {sensor.status}
                                </td>
                                <td className="p-3">{sensor.battery}%</td>
                                <td className="p-3 text-gray-500">{new Date(sensor.lastUpdated).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Sensor;
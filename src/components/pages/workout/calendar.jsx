import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useState } from "react";

function FullCalendarComponent() {
    const [records, setRecords] = useState([]);

    return (
        <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={[
                { title: "Meeting", date: "2025-03-10" },
                { title: "Conference", date: "2025-03-15" },
            ]}
        />
    );
}

export default FullCalendarComponent;
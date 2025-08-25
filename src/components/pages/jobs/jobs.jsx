import { use } from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function Jobs() {
  // const prefix = `http://3.89.31.205:5000/jobs`;
  const prefix = "https://omnic.space/api/jobs";
  const userId = useSelector((state) => state.auth.userId);
  const [records, setRecords] = useState([]);
  const [displayRecords, setDisplayRecords] = useState([]);
  const [newApp, setNewApp] = useState({
    company: "",
    dateString: new Date().toISOString(),
    status: "applied",
    notes: "",
  });
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [filter, setFilter] = useState({
    status: "applied",
    sortBydate: "desc",
    company: "",
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [summary, setSummary] = useState({
    totalJobs: 0,
    appliedJobs: 0,
    interviewedJobs: 0,
    rejectedJobs: 0,
  });

  // ====== CRUD (unchanged logic) ======
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${prefix}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          company: newApp.company.trim(),
          dateString: newApp.dateString,
          status: newApp.status,
          notes: newApp.notes,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setRecords((prev) => [data.job, ...prev]);
        setDisplayRecords((prev) => [data.job, ...prev]);
        setNewApp({ ...newApp, company: "" });
        console.log("Application added successfully!");
      }
    } catch (error) {
      console.error("Error adding application:", error);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await fetch(`${prefix}/summary?userId=${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const { totalJobs, appliedJobs, interviewedJobs, rejectedJobs } =
          await res.json();
        setSummary({ totalJobs, appliedJobs, interviewedJobs, rejectedJobs });
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  };

  const fetchRecords = async () => {
    try {
      const res = await fetch(
        `${prefix}/paged?page=${page}&limit=${limit}&userId=${userId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (res.ok) {
        const data = await res.json();
        console.log("Fetched records:", data);
        setRecords(data);
        setDisplayRecords(data);
      }
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  const handleDelete = async (record) => {
    try {
      const res = await fetch(`${prefix}/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: record._id }),
      });
      if (res.ok) {
        fetchSummary();
        fetchRecords();
      }
    } catch (error) {
      console.error("Error deleting application:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      if (!selectedRecord) return;
      const res = await fetch(`${prefix}/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: selectedRecord._id,
          company: selectedRecord.company,
          status: selectedRecord.status,
          date: selectedRecord.date,
          notes: selectedRecord.notes,
        }),
      });
      if (res.ok) {
        console.log("Application updated successfully!");
        setFilter({ ...filter, company: "" });
        fetchSummary();
        fetchRecords();
      }
    } catch (error) {
      console.error("Error updating application:", error);
    }
  };

  const handleCancel = async () => {
    try {
      fetchRecords();
    } catch (error) {
      console.error("Error cancelling modification:", error);
    }
  };

  // ====== Table manipulations (unchanged logic) ======
  const handleStatusChange = (e, id) => {
    const modifiedRecord = displayRecords.find((record) => record._id === id);
    console.log(id, modifiedRecord);
    modifiedRecord.status = e.target.value;
    setSelectedRecord(modifiedRecord);
  };

  const handleSearch = async (name) => {
    try {
      const res = await fetch(
        `${prefix}/search?userId=${userId}&company=${name}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (res.ok) {
        const filteredRercords = await res.json();
        setDisplayRecords(filteredRercords);
      }
    } catch (error) {
      console.error("Error searching records:", error);
    }
  };

  // search by company
  useEffect(() => {
    if (filter.company === "") {
      setDisplayRecords(records);
    } else {
      const timer = setTimeout(() => {
        handleSearch(filter.company.trim());
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [filter.company]);

  // filter by status
  useEffect(() => {
    const filteredRecords = records.filter(
      (record) => record.status === filter.status
    );
    setDisplayRecords(filteredRecords);
  }, [filter.status]);

  // pagination
  const handlePageClick = async (action) => {
    const maxPage = Math.ceil(summary.totalJobs / limit);
    if (action === "prev" && page > 1) setPage(page - 1);
    else if (action === "next" && page < maxPage) setPage(page + 1);
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [page, limit, userId]);

  let lastDate = new Date().toLocaleDateString();
  let toggleColor = false;

  // helper: status chip color (purely styling)
  const statusChipClass = (s) =>
    ({
      applied:
        "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200 dark:bg-blue-500/10 dark:text-blue-300",
      rejected:
        "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200 dark:bg-red-500/10 dark:text-red-300",
      "in progress":
        "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300",
      failed:
        "bg-zinc-100 text-zinc-800 ring-1 ring-inset ring-zinc-200 dark:bg-zinc-500/10 dark:text-zinc-300",
      successed:
        "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300",
    }[s] || "bg-zinc-100 text-zinc-800 ring-1 ring-inset ring-zinc-200");

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100">
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-8">
        <h1 className="text-2xl font-bold tracking-tight mb-6">
          Job Applications
        </h1>

        {/* Header / Controls */}
        <div className="grid gap-6">
          {/* Add card */}
          <form
            onSubmit={handleAdd}
            className="rounded-2xl border border-slate-200/70 bg-white/70 backdrop-blur-md p-4 md:p-5 shadow-sm dark:bg-slate-900/60 dark:border-slate-800"
          >
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium">Company</label>
                <input
                  type="text"
                  value={newApp.company}
                  onChange={(e) =>
                    setNewApp({ ...newApp, company: e.target.value })
                  }
                  placeholder="Ex: OpenAI"
                  className="mt-1 h-9 rounded-lg border border-slate-300 bg-white px-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-slate-400/60 dark:bg-slate-950 dark:border-slate-700"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium">Date</label>
                <input
                  type="date"
                  value={newApp.dateString.split("T")[0]}
                  onChange={(e) =>
                    setNewApp({ ...newApp, dateString: e.target.value })
                  }
                  className="mt-1 h-9 rounded-lg border border-slate-300 bg-white px-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-slate-400/60 dark:bg-slate-950 dark:border-slate-700"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium">Status</label>
                <select
                  value={newApp.status}
                  onChange={(e) =>
                    setNewApp({ ...newApp, status: e.target.value })
                  }
                  className="mt-1 h-9 rounded-lg border border-slate-300 bg-white px-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-slate-400/60 dark:bg-slate-950 dark:border-slate-700"
                >
                  <option value="applied">APPLIED</option>
                  <option value="rejected">REJECT</option>
                  <option value="in progress">IN PROGRESS</option>
                  <option value="failed">FAILED</option>
                  <option value="successed">SUCCESSED</option>
                </select>
              </div>

              <button
                type="submit"
                className="ml-auto inline-flex h-9 items-center justify-center rounded-lg bg-emerald-600 px-3 text-sm font-medium text-white shadow hover:bg-emerald-700 active:scale-[0.98] transition"
              >
                ADD
              </button>
            </div>
          </form>

          {/* Filters card */}
          <div className="rounded-2xl border border-slate-200/70 bg-white/70 backdrop-blur-md p-4 md:p-5 shadow-sm dark:bg-slate-900/60 dark:border-slate-800">
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium">Filter by Status</label>
                <select
                  value={filter.status}
                  onChange={(e) =>
                    setFilter({ ...filter, status: e.target.value })
                  }
                  className="mt-1 h-9 rounded-lg border border-slate-300 bg-white px-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-slate-400/60 dark:bg-slate-950 dark:border-slate-700"
                >
                  <option value="applied">APPLIED</option>
                  <option value="rejected">REJECT</option>
                  <option value="in progress">IN PROGRESS</option>
                  <option value="failed">FAILED</option>
                  <option value="successed">SUCCESSED</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium">Records Per Page</label>
                <select
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  className="mt-1 h-9 rounded-lg border border-slate-300 bg-white px-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-slate-400/60 dark:bg-slate-950 dark:border-slate-700"
                >
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={35}>35</option>
                </select>
              </div>

              <div className="flex flex-col grow min-w-[220px]">
                <label className="text-sm font-medium">Search by Company</label>
                <input
                  type="text"
                  value={filter.company}
                  onChange={(e) =>
                    setFilter({ ...filter, company: e.target.value })
                  }
                  placeholder="Type to search…"
                  className="mt-1 h-9 rounded-lg border border-slate-300 bg-white px-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-slate-400/60 dark:bg-slate-950 dark:border-slate-700"
                />
              </div>

              <button
                onClick={() => {
                  setFilter((prev) => ({ ...prev, company: "" }));
                  fetchRecords();
                }}
                className="inline-flex h-9 items-center justify-center rounded-lg bg-rose-500 px-3 text-sm font-medium text-white shadow hover:bg-rose-600 active:scale-[0.98] transition"
              >
                Reset Filter
              </button>
            </div>

            {/* Summary */}
            <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm shadow-sm dark:bg-slate-950 dark:border-slate-800">
                <div className="text-slate-500">Total</div>
                <div className="text-xl font-semibold">{summary.totalJobs}</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm shadow-sm dark:bg-slate-950 dark:border-slate-800">
                <div className="text-slate-500">Applied</div>
                <div className="text-xl font-semibold">
                  {summary.appliedJobs}
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm shadow-sm dark:bg-slate-950 dark:border-slate-800">
                <div className="text-slate-500">Reject</div>
                <div className="text-xl font-semibold">
                  {summary.rejectedJobs}
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm shadow-sm dark:bg-slate-950 dark:border-slate-800">
                <div className="text-slate-500">In Progress</div>
                <div className="text-xl font-semibold">
                  {summary.interviewedJobs}
                </div>
              </div>
            </div>

            <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Interview Rate:{" "}
              <span className="font-semibold">
                {(
                  (summary.interviewedJobs / summary.appliedJobs) * 100 || 0
                ).toFixed(2)}
                %
              </span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="mt-6 rounded-2xl border border-slate-200/70 bg-white/70 backdrop-blur-md shadow-sm overflow-hidden dark:bg-slate-900/60 dark:border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50/80 sticky top-0 backdrop-blur-md border-b border-slate-200 dark:bg-slate-900/70 dark:border-slate-800">
                <tr className="text-left text-slate-600 dark:text-slate-300">
                  <th className="px-4 py-3 font-semibold">Company</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {displayRecords.length > 0 &&
                  displayRecords.map((record) => {
                    const currentDate = new Date(
                      record.date
                    ).toLocaleDateString();
                    if (currentDate !== lastDate) {
                      toggleColor = !toggleColor;
                      lastDate = currentDate;
                    }
                    const zebra = toggleColor
                      ? "bg-slate-50/50 dark:bg-slate-950/30"
                      : "bg-white/0";

                    return (
                      <tr
                        key={record._id}
                        className={`${zebra} hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors`}
                      >
                        <td className="px-4 py-3 font-medium">
                          {record.company}
                        </td>
                        <td className="px-4 py-3">
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusChipClass(
                                record.status
                              )}`}
                            >
                              {record.status.toUpperCase()}
                            </span>
                            <select
                              value={record.status}
                              onChange={(e) =>
                                handleStatusChange(e, record._id)
                              }
                              className="h-8 rounded-md border border-slate-300 bg-white px-2 text-xs shadow-sm outline-none focus:ring-2 focus:ring-slate-400/60 dark:bg-slate-950 dark:border-slate-700"
                            >
                              <option value="applied">APPLIED</option>
                              <option value="rejected">REJECT</option>
                              <option value="in progress">IN PROGRESS</option>
                              <option value="failed">FAILED</option>
                              <option value="successed">SUCCESSED</option>
                            </select>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              className="inline-flex items-center rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow hover:bg-emerald-700 active:scale-[0.98] transition"
                              onClick={() => handleUpdate()}
                            >
                              Update
                            </button>
                            <button
                              className="inline-flex items-center rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-medium text-white shadow hover:bg-amber-600 active:scale-[0.98] transition"
                              onClick={() => handleCancel()}
                            >
                              Cancel
                            </button>
                            <button
                              className="inline-flex items-center rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white shadow hover:bg-rose-700 active:scale-[0.98] transition"
                              onClick={() => handleDelete(record)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                {displayRecords.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-10 text-center text-slate-500 dark:text-slate-400"
                    >
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-4 border-t border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-500">
              Page {page} · {limit} / page
            </span>
            <div className="flex gap-2">
              <button
                className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-300 bg-white px-3 text-sm shadow-sm hover:bg-slate-50 active:scale-[0.98] transition disabled:opacity-50 dark:bg-slate-950 dark:border-slate-700"
                onClick={() => handlePageClick("prev")}
              >
                ‹ Prev
              </button>
              <button
                className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-300 bg-white px-3 text-sm shadow-sm hover:bg-slate-50 active:scale-[0.98] transition disabled:opacity-50 dark:bg-slate-950 dark:border-slate-700"
                onClick={() => handlePageClick("next")}
              >
                Next ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

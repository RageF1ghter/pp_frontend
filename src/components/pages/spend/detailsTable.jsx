import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DetailsTable({ records }) {
  const URL = "3.89.31.205";

  const [spends, setSpends] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [total, setTotal] = useState(0);
  // const [newSpend, setNewSpend] = useState({});
  // const [edit, setEdit] = useState([]);

  // set the initial data
  useEffect(() => {
    setSpends(records.map((record) => ({ ...record, isEditing: false })));
    console.log(spends);
  }, [records]);

  const handleReset = () => {
    setSearchText("");
    setSpends(records);
  };

  // search w/o clicking button
  const handleSearch = async () => {
    const targets = spends.filter(
      (spend) => spend.category.toLowerCase() === searchText.toLowerCase()
    );
    console.log(targets);
    if (targets.length > 0) {
      setSpends(targets);
    }
  };
  useEffect(() => {
    if (searchText === "") {
      setSpends(records);
    } else {
      handleSearch();
    }
  }, [searchText]);

  // based on filtered data, calculate total
  const getTotal = () => {
    if (spends.length === 0) return;
    const totalAmount = spends
      .map((spend) => spend.amount)
      .reduce((a, b) => a + b);
    setTotal(totalAmount);
  };

  useEffect(() => {
    getTotal();
  }, [spends]);

  const toggleEdit = (id) => {
    // console.log(id);
    setSpends(
      spends.map((spend) => {
        if (spend._id === id) {
          return { ...spend, isEditing: !spend.isEditing };
        } else {
          return spend;
        }
      })
    );
  };

  const handleChanges = (id, field, value) => {
    setSpends(
      spends.map((spend) => {
        if (spend._id === id) {
          return { ...spend, [field]: value };
        } else {
          return spend;
        }
      })
    );
  };

  const handleEdit = async ({ decision, id }) => {
    // finish editing
    if (decision) {
      const spend = spends.find((spend) => spend._id === id);
      const { isEditing, ...newSpend } = spend;
      try {
        const res = await fetch(`http://${URL}:5000/spend/update`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // 'bearer': localStorage.getItem('token')
          },
          body: JSON.stringify(newSpend),
        });
        console.log(res);
        if (res.ok) {
          console.log("Record updated successfully");
          toggleEdit(id);
        }
      } catch (error) {
        console.log(error, "Error updating record");
      }
    }
    // cancel editing
    else {
      const record = records.find((record) => record._id === id);
      console.log(record);
      setSpends(
        spends.map((spend) => {
          if (spend._id === id) {
            return { ...record, isEditing: false };
          } else {
            return spend;
          }
        })
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) {
      return; // User canceled the deletion
    }
    try {
      const res = await fetch(`http://${URL}:5000/spend/delete?${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // 'bearer': localStorage.getItem('token')
        },
      });
      if (res.ok) {
        console.log("Record deleted successfully");
        setSpends(spends.filter((spend) => spend._id !== id)); // Remove the deleted record from state
        getTotal(); // Recalculate total after deletion
      } else {
        console.error("Failed to delete record");
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      alert("Failed to delete record. Please try again later.");
    }
  };

  return (
    <>
      <div className="flex flex-col px-10 gap-5">
        {/* search bar */}
        <div className="flex w-full max-w-sm items-center gap-2">
          <Label htmlFor="search">Search:</Label>
          <Input
            type="text"
            id="search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button onClick={handleReset} variant="outline">
            Reset
          </Button>
        </div>

        {/* table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Category</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Details</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {spends.map((spend) => (
              <TableRow key={spend._id}>
                <TableCell className="font-medium">{spend.category}</TableCell>
                <TableCell>{spend.amount}</TableCell>
                <TableCell>{spend.date.split("T")[0]}</TableCell>
                <TableCell>{spend.details}</TableCell>
                <TableCell className="text-right">
                  <Button>Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">$2,500.00</TableCell>
            </TableRow>
          </TableFooter>
        </Table>

        <table className="table-auto border-collapse border border-emerald-600 w-full m-2 p-2 shadow-md rounded-lg text-lg">
          {/* Table Header */}
          <thead className="border border-emerald-600 bg-emerald-500 text-white text-xl">
            <tr className="divide-x divide-emerald-600">
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Amount</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Details</th>
              <th className="px-5 py-3">Action</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-emerald-600">
            {spends.map((spend, index) => (
              <tr
                key={spend._id}
                className={`divide-x divide-emerald-600 ${
                  index % 2 === 0 ? "bg-amber-50" : "bg-white"
                }`}
              >
                {spend.isEditing ? (
                  <td className="px-5 py-3">
                    <input
                      type="text"
                      value={spend.category}
                      onChange={(e) =>
                        handleChanges(spend._id, "category", e.target.value)
                      }
                    />
                  </td>
                ) : (
                  <td className="px-5 py-3">{spend.category}</td>
                )}

                {spend.isEditing ? (
                  <td className="px-5 py-3">
                    <input
                      type="text"
                      value={spend.amount}
                      onChange={(e) =>
                        handleChanges(spend._id, "amount", e.target.value)
                      }
                    />
                  </td>
                ) : (
                  <td className="px-5 py-3">{spend.amount}</td>
                )}

                {spend.isEditing ? (
                  <td className="px-5 py-3">
                    <input
                      type="date"
                      value={spend.date}
                      onChange={(e) =>
                        handleChanges(spend._id, "date", e.target.value)
                      }
                    />
                  </td>
                ) : (
                  <td className="px-5 py-3">{spend.date.split("T")[0]}</td>
                )}

                {spend.isEditing ? (
                  <td className="px-5 py-3">
                    <input
                      type="text"
                      value={spend.details}
                      onChange={(e) =>
                        handleChanges(spend._id, "details", e.target.value)
                      }
                    />
                  </td>
                ) : (
                  <td className="px-5 py-3">{spend.details}</td>
                )}

                <td className="px-5 py-3">
                  {spend.isEditing ? (
                    <div>
                      <button
                        onClick={() =>
                          handleEdit({ decision: true, id: spend._id })
                        }
                        className="bg-sky-500 text-white px-4 py-2 rounded-md hover:bg-sky-600 transition m-0.5"
                      >
                        Finish
                      </button>
                      <button
                        onClick={() =>
                          handleEdit({ decision: false, id: spend._id })
                        }
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition m-0.5"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDelete(spend._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition m-0.5"
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => toggleEdit(spend._id)}
                      className="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600 transition"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="text-2xl text-pink-500 font-bold">Total: {total}</p>
      </div>
    </>
  );
}

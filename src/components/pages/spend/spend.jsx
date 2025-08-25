import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DetailsTable from "./detailsTable";
import InputCard from "./input";

const USER_ID = "67a28b8829f3ba8beda0e216";

const Spend = () => {
  // const URL = "3.89.31.205";
  const prefix = "https://omnic.space/api/spend";
  const [reocrds, setRecords] = useState([]);

  const userId = useSelector((state) => state.auth.userId) || USER_ID;
  // console.log(userId);

  const fetchDate = async () => {
    try {
      const id = userId || "67a28b8829f3ba8beda0e216";
      const today = new Date();
      const endDate = today.toISOString();
      const startDate = new Date();
      startDate.setMonth(today.getMonth() - 1);
      startDate.toISOString();
      console.log(startDate, endDate);

      const response = await fetch(
        `${prefix}?userId=${id}&startDate=${startDate}&endDate=${endDate}`
      );
      const data = await response.json();
      if (data) {
        data.sort((a, b) => (a.date < b.date ? -1 : 1));
        // console.log(data);
        setRecords(data);
      } else {
        console.log("No data found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDate();
  }, []);

  return (
    <>
      <InputCard userId={userId} refresh={fetchDate} />
      <DetailsTable records={reocrds} />
    </>
  );
};

export default Spend;

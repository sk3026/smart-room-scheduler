import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import ScheduleTable from "../components/ScheduleTable";
import { generateMatrix } from "../utils/scheduleMatrix";

export default function RoomSchedule() {
  const { id } = useParams();
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    const fetchSchedule = async () => {
      const res = await API.get(`schedule/?room=${id}`);
      setSchedule(res.data);
    };

    fetchSchedule();
  }, [id]);

  const { matrix, days, slots } = generateMatrix(schedule);

  const handleCellClick = (day, slot, cell) => {
    console.log("Clicked:", day, slot, cell);
    // Later: open edit modal
  };

  return (
    <>
      <Navbar />
      <div className="p-6">
        <ScheduleTable
          matrix={matrix}
          days={days}
          slots={slots}
          onCellClick={handleCellClick}
        />
      </div>
    </>
  );
}
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import API from "../api/axios";

import ScheduleTable from "../components/ScheduleTable";
import EditScheduleModal from "../components/EditScheduleModal";

import { generateMatrix } from "../utils/scheduleMatrix";

export default function RoomSchedule() {

  const { id } = useParams();

  const [scheduleData, setScheduleData] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [selectedCell, setSelectedCell] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchSchedule = async () => {

    try {

      const res = await API.get(`/schedule/?room=${id}`);

      console.log("Schedule API:", res.data);

      setScheduleData(res.data);

    } catch (err) {

      console.error("Schedule fetch error:", err);

    }

  };

  const fetchTeachers = async () => {

    try {

      const res = await API.get("/users/teachers/");

      console.log("Teachers API:", res.data);

      setTeachers(res.data);

    } catch (err) {

      console.error("Teacher API error:", err);
      setTeachers([]);

    }

  };

  const fetchSubjects = async () => {

    try {

      const res = await API.get("/subjects/");

      console.log("Subjects API:", res.data);

      setSubjects(res.data);

    } catch (err) {

      console.error("Subjects API error:", err);
      setSubjects([]);

    }

  };

  useEffect(() => {

    fetchSchedule();
    fetchTeachers();
    fetchSubjects();

  }, [id]);

  const { matrix, days, slots } = generateMatrix(scheduleData);

  const handleCellClick = (day, slot, cell) => {

    console.log("Clicked cell:", { day, slot, cell });

    setSelectedCell({
      day,
      slot,
      room: id,
      cell
    });

    setShowModal(true);

  };

  return (

    <div className="p-6">

      <h1 className="text-xl font-bold mb-4">
        Room Schedule
      </h1>

      <ScheduleTable
        matrix={matrix}
        days={days}
        slots={slots}
        subjects={subjects}
        onCellClick={handleCellClick}
      />

      {showModal && (

        <EditScheduleModal
          cell={selectedCell}
          teachers={teachers}
          subjects={subjects}
          close={() => setShowModal(false)}
          refresh={fetchSchedule}
        />

      )}

    </div>

  );

}
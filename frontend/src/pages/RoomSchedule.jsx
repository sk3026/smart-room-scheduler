import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import ScheduleTable from "../components/ScheduleTable";
import EditScheduleModal from "../components/EditScheduleModal";
import { generateMatrix } from "../utils/scheduleMatrix";

export default function RoomSchedule() {
  const { id } = useParams();

  const [matrix, setMatrix] = useState({});
  const [days, setDays] = useState([]);
  const [slots, setSlots] = useState([]);

  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [selectedCell, setSelectedCell] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchSchedule = async () => {
    const res = await API.get(`/schedule/?room=${id}`);

    const result = generateMatrix(res.data);

    setMatrix(result.matrix);
    setDays(result.days);
    setSlots(result.slots);
  };

  const fetchMetaData = async () => {
    const teachersRes = await API.get("/users/");
    const subjectsRes = await API.get("/subjects/");

    setTeachers(teachersRes.data);
    setSubjects(subjectsRes.data);
  };

  useEffect(() => {
    fetchSchedule();
    fetchMetaData();
  }, [id]);

  const handleCellClick = (day, slot, cell) => {
    setSelectedCell({ day, slot, cell });
    setShowModal(true);
  };

  return (
    <div className="p-6">
      <ScheduleTable
        matrix={matrix}
        days={days}
        slots={slots}
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
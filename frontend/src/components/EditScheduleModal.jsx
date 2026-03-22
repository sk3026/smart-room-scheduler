import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";

export default function EditScheduleModal({
  cell,
  teachers,
  subjects,
  close,
  refresh,
}) {

  const { user } = useContext(AuthContext);

  const [teacher, setTeacher] = useState(cell?.cell?.teacher_id ?? "");
  const [subject, setSubject] = useState(cell?.cell?.subject_id ?? "");

  // ✅ CLEAN FILTER USING department_code (NO HACKS)
  const filteredTeachers =
    user?.role === "SUPERADMIN"
      ? teachers
      : teachers?.filter(
          (t) => t.department_code === user.department_code
        );

  const filteredSubjects =
    user?.role === "SUPERADMIN"
      ? subjects
      : subjects?.filter(
          (s) => s.department_code === user.department_code
        );

  const handleSave = async () => {
    try {

      if (cell?.cell?.id) {

        await API.patch(`/schedule/${cell.cell.id}/`, {
          teacher: parseInt(teacher),
          subject: parseInt(subject)
        });

      } else {

        await API.post(`/schedule/create/`, {
          room: cell.room,
          day: cell.day,
          start_time: cell.slot + ":00",
          end_time: cell.slot + ":59",
          teacher: parseInt(teacher),
          subject: parseInt(subject)
        });

      }

      refresh();
      close();

    } catch (err) {
      console.error("Schedule update error:", err.response?.data);
      alert("Failed to update schedule");
    }
  };

  const handleDelete = async () => {
    try {

      if (cell?.cell?.id) {

        await API.delete(`/schedule/delete/${cell.cell.id}/`);

        refresh();
        close();

      }

    } catch (err) {
      console.error("Delete error:", err.response?.data);
      alert("Failed to delete schedule");
    }
  };

  return (

    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">

      <div className="bg-white p-6 rounded shadow w-96">

        <h2 className="text-lg font-bold mb-4">
          Edit Schedule
        </h2>

        {/* -------- TEACHER -------- */}
        <div className="mb-3">

          <label className="block mb-1">Teacher</label>

          <select
            value={teacher}
            onChange={(e) => setTeacher(e.target.value)}
            className="w-full border p-2"
          >

            <option value="">Select Teacher</option>

            {filteredTeachers?.map((t) => (
              <option key={t.id} value={t.id}>
                {t.username}_{t.department_code}
              </option>
            ))}

          </select>

        </div>

        {/* -------- SUBJECT -------- */}
        <div className="mb-3">

          <label className="block mb-1">Subject</label>

          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border p-2"
          >

            <option value="">Select Subject</option>

            {filteredSubjects?.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}_{s.code}
              </option>
            ))}

          </select>

        </div>

        {/* -------- BUTTONS -------- */}
        <div className="flex justify-end gap-2">

          {cell?.cell?.id && (
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          )}

          <button
            onClick={close}
            className="bg-gray-400 text-white px-3 py-1 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            Save
          </button>

        </div>

      </div>

    </div>

  );

}
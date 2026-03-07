import { useState } from "react";
import API from "../api/axios";

export default function EditScheduleModal({
  cell,
  teachers,
  subjects,
  close,
  refresh,
}) {

  const [teacher, setTeacher] = useState(cell?.cell?.teacher_id ?? "");
  const [subject, setSubject] = useState(cell?.cell?.subject_id ?? "");

  const handleSave = async () => {

    try {

      if (cell?.cell?.id) {

        await API.put(`/schedule/${cell.cell.id}/`, {
          teacher,
          subject,
        });

      } else {

        await API.post(`/schedule/`, {
          room: cell.room,
          day: cell.day,
          start_time: cell.slot + ":00",
          teacher,
          subject
        });

      }

      refresh();
      close();

    } catch (err) {

      console.error(err);
      alert("Failed to update schedule");

    }

  };

  return (

    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">

      <div className="bg-white p-6 rounded shadow w-96">

        <h2 className="text-lg font-bold mb-4">
          Edit Schedule
        </h2>

        <div className="mb-3">

          <label className="block mb-1">Teacher</label>

          <select
            value={teacher}
            onChange={(e) => setTeacher(e.target.value)}
            className="w-full border p-2"
          >

            <option value="">Select Teacher</option>

            {teachers?.map((t) => (

              <option key={t.id} value={t.id}>
                {t.username}
              </option>

            ))}

          </select>

        </div>

        <div className="mb-3">

          <label className="block mb-1">Subject</label>

          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border p-2"
          >

            <option value="">Select Subject</option>

            {subjects?.map((s) => (

              <option key={s.id} value={s.id}>
                {s.name}
              </option>

            ))}

          </select>

        </div>

        <div className="flex justify-end gap-2">

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
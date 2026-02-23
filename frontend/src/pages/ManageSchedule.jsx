import { useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";

export default function ManageSchedule() {
  const [form, setForm] = useState({
    teacher: "",
    room: "",
    subject: "",
    day: "",
    start_time: "",
    end_time: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await API.post("/schedule/", form);
      alert("Schedule Created");
    } catch (err) {
      alert("Conflict or Error");
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Manage Schedule</h2>

        <div className="grid grid-cols-2 gap-4">
          <input name="teacher" placeholder="Teacher ID" onChange={handleChange} className="border p-2" />
          <input name="room" placeholder="Room ID" onChange={handleChange} className="border p-2" />
          <input name="subject" placeholder="Subject ID" onChange={handleChange} className="border p-2" />
          <input name="day" placeholder="Day" onChange={handleChange} className="border p-2" />
          <input name="start_time" type="time" onChange={handleChange} className="border p-2" />
          <input name="end_time" type="time" onChange={handleChange} className="border p-2" />
        </div>

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white mt-4 px-4 py-2 rounded"
        >
          Create Schedule
        </button>
      </div>
    </>
  );
}
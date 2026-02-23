import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";

export default function TeacherSchedule() {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    API.get("/schedule/teacher/")
      .then((res) => setSchedule(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">My Schedule</h2>

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th>Day</th>
              <th>Time</th>
              <th>Room</th>
              <th>Subject</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((item) => (
              <tr key={item.id} className="text-center border-t">
                <td>{item.day}</td>
                <td>{item.start_time} - {item.end_time}</td>
                <td>{item.room}</td>
                <td>{item.subject}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
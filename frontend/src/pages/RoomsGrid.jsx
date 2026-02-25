import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function RoomsGrid() {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      const res = await API.get("rooms/");
      setRooms(res.data);
    };

    fetchRooms();
  }, []);

  return (
    <div className="grid grid-cols-4 gap-4">
      {rooms.map((room) => (
        <div
          key={room.id}
          className="bg-white shadow p-4 rounded cursor-pointer hover:bg-gray-100"
          onClick={() => navigate(`/room/${room.id}`)}
        >
          {room.name}
        </div>
      ))}
    </div>
  );
}
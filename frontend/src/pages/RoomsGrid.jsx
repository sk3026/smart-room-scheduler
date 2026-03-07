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
    <div className="min-h-screen bg-gray-100 p-8">
      
      <h1 className="text-2xl font-bold mb-6 text-gray-700">
        Available Rooms
      </h1>

      <div className="grid grid-cols-4 gap-6">
        {rooms.map((room) => (
          <div
            key={room.id}
            onClick={() => navigate(`/room/${room.id}`)}
            className="bg-white shadow-md rounded-lg p-8 text-center cursor-pointer
                       hover:bg-blue-50 hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-gray-700">
              Room {room.room_number}
            </h2>

            <p className="text-gray-500 mt-2">
              Capacity: {room.capacity}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}
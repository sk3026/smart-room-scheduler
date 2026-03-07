import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ScheduleTable({ matrix, days, slots, onCellClick }) {
  const { user } = useContext(AuthContext);

  const isEditable = user?.role === "HOD" || user?.role === "SUPERADMIN";

  return (
    <div className="overflow-x-auto">
      <table className="table-auto border-collapse border w-full bg-white shadow">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-3">Day / Time</th>

            {slots.map((slot) => (
              <th key={slot} className="border p-3 text-sm">
                {slot}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {days.map((day) => (
            <tr key={day}>
              <td className="border p-3 font-semibold bg-gray-100">
                {day}
              </td>

              {slots.map((slot) => {
                const cell = matrix[day][slot];

                return (
                  <td
                    key={slot}
                    onClick={() =>
                      isEditable && onCellClick(day, slot, cell)
                    }
                    className={`border p-3 text-center h-20 transition ${
                      isEditable
                        ? "cursor-pointer hover:bg-yellow-100"
                        : "bg-gray-50"
                    }`}
                  >
                    {cell ? (
                      <>
                        <div className="font-semibold text-blue-700">
                          {cell.subject}
                        </div>

                        <div className="text-sm text-gray-600">
                          {cell.teacher}
                        </div>
                      </>
                    ) : (
                      <span className="text-gray-400">Vacant</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
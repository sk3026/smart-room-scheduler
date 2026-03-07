import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ScheduleTable({ matrix, days, slots, onCellClick }) {
  const { user } = useContext(AuthContext);

  const isEditable = user?.role === "HOD" || user?.role === "SUPERADMIN";

  return (
    <table className="table-auto border-collapse border w-full">
      <thead>
        <tr>
          <th className="border p-2">Day / Time</th>
          {slots.map((slot) => (
            <th key={slot} className="border p-2">
              {slot}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {days.map((day) => (
          <tr key={day}>
            <td className="border p-2 font-bold">{day}</td>

            {slots.map((slot) => {
              const cell = matrix[day][slot];

              return (
                <td
                  key={slot}
                  onClick={() => isEditable && onCellClick(day, slot, cell)}
                  className={`border p-2 text-center transition ${
                    isEditable
                      ? "cursor-pointer hover:bg-yellow-200"
                      : "bg-gray-100"
                  }`}
                >
                  {cell ? (
                    <>
                      <div>{cell.teacher}</div>
                      <div className="text-sm text-gray-500">
                        {cell.subject}
                      </div>
                    </>
                  ) : (
                    "-"
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
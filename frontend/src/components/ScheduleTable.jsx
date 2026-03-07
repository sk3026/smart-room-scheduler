import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ScheduleTable({
  matrix,
  days,
  slots,
  onCellClick
}) {

  const { user } = useContext(AuthContext);

  console.log("CURRENT USER:", user);

  const canEdit = (cell) => {

    if (!user) return false;

    const role = String(user.role || "").toLowerCase();

    console.log("ROLE DETECTED:", role);

    // ADMIN or SUPERADMIN → always editable
    if (role.includes("admin")) {
      console.log("ADMIN ACCESS");
      return true;
    }

    // HOD logic
    if (role === "hod") {

      if (!cell) {
        console.log("Empty slot editable for HOD");
        return true;
      }

      const userDept = String(user.department || "").toLowerCase();
      const cellDept = String(cell.department || "").toLowerCase();

      console.log("User Dept:", userDept);
      console.log("Cell Dept:", cellDept);

      return userDept === cellDept;
    }

    // Teacher
    console.log("Teacher view only");
    return false;
  };

  return (

    <table className="w-full border border-gray-400 border-collapse">

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

            <td className="border p-2 font-bold bg-gray-100">
              {day}
            </td>

            {slots.map((slot) => {

              const cell = matrix?.[day]?.[slot];
              const editable = canEdit(cell);

              return (

                <td
                  key={slot}

                  onClick={() => {
                    if (editable) {
                      console.log("CELL CLICKED:", day, slot, cell);
                      onCellClick(day, slot, cell);
                    }
                  }}

                  className={`border p-3 text-center transition
                    ${
                      editable
                        ? "bg-yellow-200 hover:bg-yellow-300 cursor-pointer border-2 border-yellow-400"
                        : "bg-gray-100"
                    }`}
                >

                  {cell ? (
                    <>
                      <div className="font-semibold">
                        {cell.teacher}
                      </div>
                      <div className="text-xs text-gray-600">
                        {cell.subject}
                      </div>
                    </>
                  ) : "-"}

                </td>

              );

            })}

          </tr>

        ))}

      </tbody>

    </table>

  );

}
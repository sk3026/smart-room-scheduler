import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ScheduleTable({
  matrix,
  days,
  slots,
  subjects = [],
  onCellClick
}) {

  const { user } = useContext(AuthContext);

  console.log("USER:", user);
  console.log("SUBJECTS:", subjects);

  const canEdit = (cell) => {

    if (!user) {
      console.log("No user found");
      return false;
    }

    const role = String(user.role || "").toUpperCase();

    console.log("ROLE:", role);

    // ADMIN or SUPERADMIN → always editable
    if (role === "SUPERADMIN" || role === "ADMIN") {
      console.log("ADMIN ACCESS");
      return true;
    }

    // HOD logic
    if (role === "HOD") {

      // Allow editing empty slots
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

    // TEACHER → view only
    console.log("Teacher view only");
    return false;
  };

  return (

    <table className="w-full border border-gray-400 border-collapse">

      <thead>
        <tr>

          <th className="border p-2">Day / Time</th>

          {slots?.map((slot) => (
            <th key={slot} className="border p-2">
              {slot}
            </th>
          ))}

        </tr>
      </thead>

      <tbody>

        {days?.map((day) => (

          <tr key={day}>

            <td className="border p-2 font-bold bg-gray-100">
              {day}
            </td>

            {slots?.map((slot) => {

              const cell = matrix?.[day]?.[slot];
              const editable = canEdit(cell);

              console.log("Cell:", cell, "Editable:", editable);

              return (

                <td
                  key={slot}

                  onClick={() => {
                    if (editable) {
                      console.log("Cell clicked:", day, slot, cell);
                      onCellClick(day, slot, cell);
                    }
                  }}

                  className={`border p-3 text-center transition
                    ${
                      editable
                        ? "bg-yellow-200 hover:bg-yellow-300 border-2 border-yellow-400 cursor-pointer"
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
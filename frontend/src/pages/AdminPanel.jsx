import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

export default function AdminPanel() {

  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await API.get("users/");
      console.log("Users:", res.data);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const makeHOD = async (user) => {

    try {

      await API.patch(`users/${user.id}/`, {
        role: "HOD",
        department: user.department
      });

      fetchUsers();

    } catch (err) {
      console.error(err);
      alert("Failed to update role");
    }

  };

  const makeTeacher = async (user) => {

    try {

      await API.patch(`users/${user.id}/`, {
        role: "TEACHER",
        department: user.department
      });

      fetchUsers();

    } catch (err) {
      console.error(err);
    }

  };

  // group users by department
  const departments = {};

  users.forEach((u) => {

    const dept = u.department || "No Department";

    if (!departments[dept]) {
      departments[dept] = [];
    }

    departments[dept].push(u);

  });

  return (
    <>
      <Navbar />

      <div className="p-6">

        <h2 className="text-2xl font-bold mb-6">
          Department Management
        </h2>

        {Object.keys(departments).map((dept) => (

          <div
            key={dept}
            className="mb-6 border rounded p-4"
          >

            <h3 className="text-lg font-semibold mb-3">
              {dept} Department
            </h3>

            {departments[dept].map((user) => (

              <div
                key={user.id}
                className="flex justify-between items-center border-b py-2"
              >

                <span>{user.username}</span>

                {user.role === "HOD" ? (

                  <div className="flex gap-2">

                    <span className="text-green-600 font-semibold">
                      HOD
                    </span>

                    <button
                      onClick={() => makeTeacher(user)}
                      className="bg-gray-400 text-white px-2 py-1 rounded"
                    >
                      Remove HOD
                    </button>

                  </div>

                ) : (

                  <button
                    onClick={() => makeHOD(user)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Make HOD
                  </button>

                )}

              </div>

            ))}

          </div>

        ))}

      </div>
    </>
  );

}
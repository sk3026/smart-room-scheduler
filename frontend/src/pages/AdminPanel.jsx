import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

export default function AdminPanel() {

  const [users, setUsers] = useState([]);

  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "TEACHER",
    department: "CSE"
  });

  const departmentsList = ["CSE", "ECE", "Mechanical"];

  const fetchUsers = async () => {
    try {
      const res = await API.get("users/");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const createUser = async () => {
    try {

      await API.post("users/create/", newUser);

      setNewUser({
        username: "",
        password: "",
        role: "TEACHER",
        department: "CSE"
      });

      fetchUsers();

    } catch (err) {
  console.log("CREATE USER ERROR:", err.response.data);
  alert(JSON.stringify(err.response.data));
}
  };

  const makeHOD = async (user) => {
    try {

      await API.patch(`users/${user.id}/`, {
        role: "HOD",
        department: user.department
      });

      fetchUsers();

    } catch (err) {
  console.log("ERROR:", err.response.data);
  alert(JSON.stringify(err.response.data));
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

        {/* CREATE USER */}
        <div className="mb-8 border rounded p-4 bg-gray-50">

          <h3 className="text-lg font-semibold mb-3">
            Create New User
          </h3>

          <div className="flex gap-3 flex-wrap">

            <input
              type="text"
              placeholder="Username"
              value={newUser.username}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
              className="border p-2 rounded"
            />

            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              className="border p-2 rounded"
            />

            <select
              value={newUser.role}
              onChange={(e) =>
                setNewUser({ ...newUser, role: e.target.value })
              }
              className="border p-2 rounded"
            >
              <option value="TEACHER">Teacher</option>
              <option value="HOD">HOD</option>
            </select>

            <select
              value={newUser.department}
              onChange={(e) =>
                setNewUser({ ...newUser, department: e.target.value })
              }
              className="border p-2 rounded"
            >
              {departmentsList.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <button
              onClick={createUser}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Create
            </button>

          </div>

        </div>

        {/* USERS BY DEPARTMENT */}

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
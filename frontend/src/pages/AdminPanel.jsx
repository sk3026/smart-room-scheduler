import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await API.get("users/");
      setUsers(res.data);
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    await API.patch(`users/${userId}/`, {
      role: newRole,
    });

    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, role: newRole } : u
      )
    );
  };

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>

        <table className="table-auto border w-full">
          <thead>
            <tr>
              <th className="border p-2">Username</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Change Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="border p-2">{user.username}</td>
                <td className="border p-2">{user.role}</td>
                <td className="border p-2">
                  <select
                    value={user.role}
                    onChange={(e) =>
                      handleRoleChange(user.id, e.target.value)
                    }
                    className="border p-1"
                  >
                    <option value="TEACHER">TEACHER</option>
                    <option value="HOD">HOD</option>
                    <option value="SUPERADMIN">SUPERADMIN</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold">
          Welcome to Smart Room Scheduler
        </h1>

        <p className="mt-4 text-lg">
          Role: {user?.role}
        </p>
      </div>
    </>
  );
}
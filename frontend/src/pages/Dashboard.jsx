import Navbar from "../components/Navbar";
import RoomsGrid from "./RoomsGrid";

export default function Dashboard() {
  return (
    <>
      <Navbar />
      <div className="p-6">
        <RoomsGrid />
      </div>
    </>
  );
}
import "./NotGoing.css";
import { useNavigate, useParams } from "react-router-dom";
import guests_db from "../backend/Supabaseclient";
import Details from "../components/Details";
import { useEffect, useState } from "react";

function NotGoing() {
  const { id } = useParams(); // Get the guest's ID from the URL
  const reroute = useNavigate();
  const [guest, setGuest] = useState(null); // State to store guest details

  // Fetch guest details from the database
  useEffect(() => {
    const fetchGuest = async () => {
      try {
        const { data, error } = await guests_db
          .from("guests")
          .select("first_name, last_initial")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching guest details:", error);
          alert("Failed to fetch guest details. Please try again.");
        } else {
          setGuest(data); // Store fetched guest details
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        alert("Something went wrong. Please try again.");
      }
    };

    fetchGuest();
  }, [id]);

  const handleRerouteToEDA = () => {
    reroute("/eda");
  };

  const updateStatusToGoing = async () => {
    try {
      const { error } = await guests_db
        .from("guests")
        .update({ going: 1 }) // Update the status to "going"
        .eq("id", id);

      if (error) {
        console.error("Error updating status:", error);
        alert("Failed to update status. Please try again.");
      } else {
        alert("Your status has been updated! I'll see you there!");
        reroute(`/going/${id}`);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="not-going-container">
      <div className="not-going-card">
        <h1>
          {guest
            ? `Hope you change your mind, ${guest.first_name.charAt(0).toUpperCase()}${guest.first_name.slice(1)} :(` 
            : "Loading..."}
        </h1>
        <Details />
        <div className="button-container">
          <button onClick={handleRerouteToEDA}>Demographics</button>
          <button onClick={updateStatusToGoing}>Change Status to Going</button>
        </div>
      </div>
    </div>
  );
}

export default NotGoing;

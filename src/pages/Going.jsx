import "./Going.css";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import guests_db from "../backend/Supabaseclient";
import Details from "../components/Details";

function Going() {
  const { id } = useParams(); // Get the guest's ID from the URL
  const reroute = useNavigate();
  const [guest, setGuest] = useState(null); // State to store guest data

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
          console.error("Error fetching guest:", error);
          alert("Failed to fetch guest details. Please try again.");
        } else {
          setGuest(data); // Store the fetched guest details
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

  const updateStatusToNotGoing = async () => {
    try {
      const { error } = await guests_db
        .from("guests")
        .update({ going: 0 }) // Update the status to "not going"
        .eq("id", id);

      if (error) {
        console.error("Error updating status:", error);
        alert("Failed to update status. Please try again.");
      } else {
        alert(
          "Your status has been updated! I'll see you some other time for sure!"
        );
        reroute(`/notgoing/${id}`);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="going-container">
      <h1>
      <h1>
        {guest
          ? `See you ${guest.first_name.charAt(0).toUpperCase()}${guest.first_name.slice(1)}!`
          : "Loading..."}
      </h1>

      </h1>
      <Details />
      <div className="button-container">
        <button onClick={handleRerouteToEDA}>Demographics</button>
        <button onClick={updateStatusToNotGoing}>Change Status to Not Going</button>
      </div>
    </div>
  );
}

export default Going;

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import guests_db from "../backend/Supabaseclient";

function Purgatory() {
  const { id } = useParams(); // Get the guest's ID from the URL
  const navigate = useNavigate(); // Hook to programmatically navigate

  const [meetOption, setMeetOption] = useState(""); // State to store dropdown selection
  const [goingStatus, setGoingStatus] = useState(null); // State to store radio button selection

  const handleSubmit = async () => {

    // Map options to numerical values for easier database management
    const meetOptionMapping = {
      family: 0,
      qc: 1,
      mcdonalds: 2,
    };

    const meetOptionValue = meetOptionMapping[meetOption];

    // Validation for both dropdown and radio button
    if (meetOptionValue === undefined) {
      alert("Please select how we met before submitting.");
      return;
    }
    if (goingStatus === null) {
      alert("Please select if you are going or not before submitting.");
      return;
    }

    try {
      const { error } = await guests_db
        .from("guests")
        .update({ going: goingStatus, meet_option: meetOptionValue }) // Update going status and meet option
        .eq("id", id);

      if (error) {
        console.error("Error updating status:", error);
        alert("Failed to update status. Please try again.");
      } else {
        alert("Your response has been recorded!");
        if (goingStatus === 1) {
          navigate(`/going/${id}`); // Navigate to the "going" route
        } else if (goingStatus === 0) {
          navigate(`/notgoing/${id}`); // Navigate to the "not going" route
        }
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div>
      <h1>Purgatory</h1>
      <h2>Are you going to my birthday party or not?</h2>
      <p>Please fill out the form below to let us know your response.</p>

      {/* Dropdown for how you met */}
      <div>
        <label htmlFor="meetOption">How did I meet you?</label>
        <select
          id="meetOption"
          value={meetOption}
          onChange={(e) => setMeetOption(e.target.value)}
          required
        >
          <option value="">Select an option</option>
          <option value="family">Family</option>
          <option value="qc">Queens College</option>
          <option value="mcdonalds">McDonalds</option>
        </select>
      </div>

      {/* Radio buttons for going or not going */}
      <div>
        <p>Will you be attending?</p>
        <label>
          <input
            type="radio"
            name="goingStatus"
            value="1"
            onChange={() => setGoingStatus(1)}
          />
          Yes, Im going!
        </label>
        <br />
        <label>
          <input
            type="radio"
            name="goingStatus"
            value="0"
            onChange={() => setGoingStatus(0)}
          />
          No, I cant make it.
        </label>
      </div>

      {/* Submit button */}
      <button onClick={handleSubmit}>Submit</button>

      <div>
        <h3>Birthday Party Details:</h3>
        <p>Date: [Insert Date]</p>
        <p>Location: [Insert Location]</p>
        <p>Time: [Insert Time]</p>
      </div>
    </div>
  );
}

export default Purgatory;

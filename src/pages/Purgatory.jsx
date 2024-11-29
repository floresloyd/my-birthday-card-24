import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import guests_db from "../backend/Supabaseclient";
import "./Purgatory.css";
import mySprite from "../assets/8bit-me.png";
import Details from "../components/Details";

function Purgatory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [meetOption, setMeetOption] = useState("");
  const [goingStatus, setGoingStatus] = useState(null);
  const [firstName, setFirstName] = useState(""); // State for first name
  const [showDetails, setShowDetails] = useState(false); // State for Details visibility

  // Fetch first name from the database
  useEffect(() => {
    const fetchFirstName = async () => {
      try {
        const { data, error } = await guests_db
          .from("guests")
          .select("first_name")
          .eq("id", id)
          .single(); // Fetch a single record

        if (error) {
          console.error("Error fetching first name:", error);
        } else {
          setFirstName(data.first_name); // Update state with fetched name
        }
      } catch (err) {
        console.error("Unexpected error fetching first name:", err);
      }
    };

    fetchFirstName();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const meetOptionMapping = {
      family: 0,
      qc: 1,
      mcdonalds: 2,
    };
  
    const meetOptionValue = meetOptionMapping[meetOption];
  
    // Validate form inputs
    if (meetOptionValue === undefined) {
      alert("Please select how we met before submitting.");
      return;
    }
    if (goingStatus === null) {
      alert("Please select if you are going or not before submitting.");
      return;
    }
  
    try {
      // Update the Supabase database
        const { error } = await guests_db
        .from("guests")
        .update({
          going: goingStatus,
          meet_id: meetOptionValue, // Use correct column name
        })
        .eq("id", id);
  
      if (error) {
        console.error("Error updating status:", error);
        alert("Failed to update status. Please try again.");
      } else {
        alert("Your response has been recorded!");
        // Navigate based on the user's "going" status
        if (goingStatus === 1) {
          navigate(`/going/${id}`);
        } else {
          navigate(`/notgoing/${id}`);
        }
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Something went wrong. Please try again.");
    }
  };
  
  return (
    <div className="validate-content">
      <div className="dialog-and-sprite">
        <img src={mySprite} className="my-sprite" alt="8bit-loydsprite" />
        <div className="message-box">
          <p>
            Hey{" "}
            <span className="red-name">
              {firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase() || "Guest"}
            </span>
            , you are invited to my birthday party! I just need to know if...
          </p>
        </div>
      </div>

              {/* Details Button */}
        <button
          type="button"
          className="details-button"
          onClick={() => setShowDetails((prev) => !prev)}
        >
          {showDetails ? "Hide Details" : "Show Details"}
        </button>

        {/* Conditionally Rendered Details Component */}
        {showDetails && <Details />}

      <div className="response-box">
        <form onSubmit={handleSubmit}>
          {/* Going/Not Going Buttons */}
          <div className="form-field">
            <label>Are you going?</label>
            <div className="toggle-container">
              <button
                type="button"
                className={`toggle-button ${goingStatus === 0 ? "selected" : ""}`}
                onClick={() => setGoingStatus(0)}
              >
                Not Going
              </button>
              <button
                type="button"
                className={`toggle-button ${goingStatus === 1 ? "selected" : ""}`}
                onClick={() => setGoingStatus(1)}
              >
                Going
              </button>
            </div>
          </div>

          {/* Dropdown Menu */}
          <div className="form-field">
            <label htmlFor="meetOption">How did we meet?</label>
            <select
              id="meetOption"
              value={meetOption}
              onChange={(e) => setMeetOption(e.target.value)}
            >
              <option value="">Select an option</option>
              <option value="family">Family</option>
              <option value="qc">Queens College</option>
              <option value="mcdonalds">McDonald&apos;s</option>
            </select>
          </div>

          {/* Submit Button */}
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Purgatory;

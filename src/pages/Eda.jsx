import { useEffect, useState } from "react";
import guests_db from "../backend/Supabaseclient";

function Eda() {
  const [totalGuests, setTotalGuests] = useState(0);
  const [goingCount, setGoingCount] = useState(0);
  const [notGoingCount, setNotGoingCount] = useState(0);
  const [noResponseCount, setNoResponseCount] = useState(0);
  const [uniqueMeetIds, setUniqueMeetIds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all guests
        const { data, error } = await guests_db.from("guests").select("*");

        if (error) {
          console.error("Error fetching guests:", error);
          return;
        }

        if (data) {
          // Calculate total number of guests
          setTotalGuests(data.length);

          // Calculate counts for going, not going, and no response
          const going = data.filter((guest) => guest.going === 1).length;
          const notGoing = data.filter((guest) => guest.going === 0).length;
          const noResponse = data.filter((guest) => guest.going === null).length;

          setGoingCount(going);
          setNotGoingCount(notGoing);
          setNoResponseCount(noResponse);

          // Extract unique meet IDs
          const uniqueMeetIdsSet = new Set(data.map((guest) => guest.meet_id));
          setUniqueMeetIds(Array.from(uniqueMeetIdsSet));
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Exploratory Data Analysis</h1>
      <p>Total number of invited guests: {totalGuests}</p>
      <h2>Breakdown of Coming Guests:</h2>
      <p>Going: {goingCount} ({((goingCount / totalGuests) * 100).toFixed(2)}%)</p>
      <p>Not Going: {notGoingCount} ({((notGoingCount / totalGuests) * 100).toFixed(2)}%)</p>
      <p>No Response: {noResponseCount} ({((noResponseCount / totalGuests) * 100).toFixed(2)}%)</p>
      <h2>Demographics of Guests:</h2>
      <p>Unique Meet IDs: {uniqueMeetIds.length}</p>
    </div>
  );
}

export default Eda;

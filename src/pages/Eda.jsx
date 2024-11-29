import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import guests_db from "../backend/Supabaseclient";
import './Eda.css';

// Register required elements for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

function Eda() {
  const [totalGuests, setTotalGuests] = useState(0);
  const [goingCount, setGoingCount] = useState(0);
  const [notGoingCount, setNotGoingCount] = useState(0);
  const [noResponseCount, setNoResponseCount] = useState(0);
  const [meetStatistics, setMeetStatistics] = useState({});
  const [plusOneCount, setPlusOneCount] = useState(0);

  const fetchData = async () => {
    try {
      const { data, error } = await guests_db.from("guests").select("*");

      if (error) {
        console.error("Error fetching guests:", error);
        return;
      }

      if (data) {
        setTotalGuests(data.length);
        const going = data.filter((guest) => guest.going === 1).length;
        const notGoing = data.filter((guest) => guest.going === 0).length;
        const noResponse = data.filter((guest) => guest.going === null).length;

        setGoingCount(going);
        setNotGoingCount(notGoing);
        setNoResponseCount(noResponse);

        const meetCounts = data.reduce((acc, guest) => {
          const meetId = guest.meet_id;
          acc[meetId] = (acc[meetId] || 0) + 1;
          return acc;
        }, {});
        setMeetStatistics(meetCounts);

        const totalPlusOnes = data
          .filter((guest) => guest.going === 1)
          .reduce((sum, guest) => sum + (guest.num_plus_one || 0), 0);

        setPlusOneCount(totalPlusOnes);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Set up realtime subscription
    const subscription = guests_db
      .channel("guests")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "guests" },
        () => {
          fetchData(); // Re-fetch data when changes are detected
        }
      )
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      guests_db.removeChannel(subscription);
    };
  }, []);

  const meetIdLabels = {
    0: "Family",
    1: "Queens College",
    2: "McDonald's",
    3: "Apple",
    4: "Kyndryl",
    5: "Filipino Community",
  };

  const goingChartData = {
    labels: ["Going", "Not Going", "No Response"],
    datasets: [
      {
        data: [goingCount, notGoingCount, noResponseCount],
        backgroundColor: ["#FFADAD", "#FFC6FF", "#BDB2FF"],
        hoverBackgroundColor: ["#FF7070", "#FF99FF", "#A391FF"],
      },
    ],
  };

  const meetLabels = Object.keys(meetStatistics).map(
    (key) => meetIdLabels[key] || `Unknown (${key})`
  );
  const meetData = Object.values(meetStatistics);

  const meetChartData = {
    labels: meetLabels,
    datasets: [
      {
        data: meetData,
        backgroundColor: [
          "#FFADAD",
          "#FFC6FF",
          "#BDB2FF",
          "#A8DADC",
          "#FFE66D",
          "#FF8C42",
        ],
        hoverBackgroundColor: [
          "#FF7070",
          "#FF99FF",
          "#A391FF",
          "#81B29A",
          "#FFD93D",
          "#FF6F00",
        ],
      },
    ],
  };

  const goingStatsDisplay = (
    <>
      <p>Going: {goingCount} guest(s) ({((goingCount / totalGuests) * 100).toFixed(2)}%)</p>
      <p>Not Going: {notGoingCount} guest(s) ({((notGoingCount / totalGuests) * 100).toFixed(2)}%)</p>
      <p>No Response: {noResponseCount} guest(s) ({((noResponseCount / totalGuests) * 100).toFixed(2)}%)</p>
    </>
  );

  const meetStatsDisplay = Object.entries(meetStatistics).map(([key, value]) => {
    const label = meetIdLabels[key] || `Unknown (${key})`;
    const percentage = ((value / totalGuests) * 100).toFixed(2);
    return (
      <p key={key}>
        {label}: {value} guest(s) ({percentage}%)
      </p>
    );
  });

  const totalAttending = goingCount + plusOneCount;

  return (
    <div className="wrapper">
      <h1 className="title">Exploratory Data Analysis</h1>

      <h2 className="section-title">RSVP Status</h2>
      <p><i>Total number of invited guests:</i> {totalGuests}</p>
      {goingStatsDisplay}

      <h2 className="section-title">Where Did I Meet My Friends</h2>
      {meetStatsDisplay}

      <div className="charts-row">
        <div className="chart-container">
          <Pie data={goingChartData} options={{ maintainAspectRatio: false }} />
        </div>
        <div className="chart-container">
          <Pie data={meetChartData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>

      <h2 className="section-title">Attending Guests</h2>
      <p>Count of Going Guests: {goingCount}</p>
      <p>Count of Plus Ones: {plusOneCount}</p>
      <p><strong><u>Total Attending Guests:</u></strong> {totalAttending}</p>
    </div>
  );
}

export default Eda;

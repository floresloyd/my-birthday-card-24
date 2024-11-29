import { useState, useEffect } from "react";
import "./Details.css";
import copyIcon from "../assets/copy.png"

function Details() {
  const [countdown, setCountdown] = useState("");
  const birthday = new Date("2024-12-07T17:00:00"); // Set to December 7, 2024, at 5:00 PM
  const address = "Apt 2B, 178 E 2nd St, New York, NY, 10009";
  const mapsLink = `https://www.google.com/maps/place/${encodeURIComponent(
    "178 E 2nd St, New York, NY, 10009"
  )}`;

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const timeDifference = birthday - now;

      if (timeDifference > 0) {
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);

        if (days >= 1) {
          setCountdown(`${days} day${days > 1 ? "s" : ""} remaining`);
        } else {
          setCountdown(`${hours} hour${hours > 1 ? "s" : ""} remaining`);
        }
      } else {
        setCountdown("It's today!");
      }
    };

    const interval = setInterval(updateCountdown, 1000); // Update every second
    updateCountdown();

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [birthday]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    alert("Address copied to clipboard!");
  };

  return (
    <div className="details-container">
      <h1 className="header"> <u>Details</u></h1>
      <div className="details-content-container">
        <div className="details-item">
          <h1 className="details-heading">WHAT: </h1>
          <p>Loyd&apos;s 24th Birthday and Graduation Party!</p>
        </div>
        <div className="details-item">
          <h1 className="details-heading">WHEN:</h1>
          <p>
            December 07, 2024 @ 5:00 PM | <span className="countdown">{countdown}</span>
          </p>
        </div>
        <div className="details-item">
          <h1 className="details-heading">WHERE:</h1>
          <div className="details-location">
            <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="address-link">
                {address}
            </a>
            <button onClick={copyToClipboard} className="copy-button">
                <span className="copy-text">Copy</span>
                <img src={copyIcon} alt="Copy Address" className="copy-icon" />

            </button>
            </div>

          <iframe
            title="Google Maps"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.908474653032!2d-73.98458168459399!3d40.72330647933116!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2598b8154f59f%3A0xff19c03a75263da7!2s178%20E%202nd%20St%2C%20New%20York%2C%20NY%2010009%2C%20USA!5e0!3m2!1sen!2sus!4v1699025690324!5m2!1sen!2sus"
            width="300"
            height="200"
            style={{ border: "0" }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        <div className="details-item">
        <h3 className="details-heading">LOGISTICS: </h3>
            <p>
                <strong>Transportation lines:</strong>
                <span className="mta-line mta-f">F</span>
                <span className="mta-line mta-j">J</span>
                <span className="mta-line mta-z">Z</span>
                <span className="mta-line mta-m">M</span>
                <span className="mta-line mta-l">L</span>
                <span className="mta-line mta-bus">M14+</span>
                <span className="mta-line mta-bus">M15+</span>
                <span className="mta-line mta-bus">M21</span>
            </p>
            <p> <strong>Parking:</strong> Street Parking </p>
        </div>

      </div>
    </div>
  );
}

export default Details;
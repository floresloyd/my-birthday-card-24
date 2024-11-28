import './Home.css';
import { useNavigate } from 'react-router-dom';
import cakeGif from "../assets/pixel-cake.gif";
import { useEffect, useState } from 'react';

function Home() {
  const reroute = useNavigate(); // Hook used to reroute
  const phrases = [ "Celebrating", "Loyd's 24th Birthday", "& College Graduation", "Click Here"];
  const [currentPhrase, setCurrentPhrase] = useState(phrases[0]);
  const [index, setIndex] = useState(0); // Manage the index of phrases

  const handleValidationReroute = () => {
    reroute('/validate');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % phrases.length); // Cycle through phrases
    }, 2000); // Change phrase every 2 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [phrases.length]); // No dependency on the `phrases` array itself

  useEffect(() => {
    setCurrentPhrase(phrases[index]);
  }, [index, phrases]); // Update the displayed phrase when the index changes

  return (
    <div className='home-main-container'>
      <img className='cake-gif' src={cakeGif} alt='cake-gif' />
      <div className='rotating-text-board'>
        <h2 onClick={handleValidationReroute} className="clickable-text">{currentPhrase}</h2>
      </div>
    </div>
  );
}

export default Home;

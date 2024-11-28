import './Home.css';
import { useNavigate } from 'react-router-dom';


function Home() {
  const reroute = useNavigate(); // Hook used to reroute

  const handleValidationReroute = () => {
    reroute('/validate');
  };

 

  return (
    <div>
      <h1>cake</h1>
      <h2> Rotating text hbd loyd | graduating b.s. cs | click here to </h2>
      <button onClick={handleValidationReroute}> next page </button>
    </div>
  );
}

export default Home;

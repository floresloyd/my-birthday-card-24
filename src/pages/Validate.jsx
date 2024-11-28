import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import guests_db from '../backend/Supabaseclient';

function Validate() {
  const [firstName, setFirstName] = useState('');            // State for first name
  const [lastInitial, setLastInitial] = useState('');       // State for last initial
  const [errorMessage, setErrorMessage] = useState('');     // State for error messages
  const reroute = useNavigate();                           // React Router hook for navigation

  const handleValidation = async (e) => {
    e.preventDefault(); // Prevent default form behavior
    setErrorMessage(''); // Reset error message

    // Validation checks
    if (!firstName || /\s/.test(firstName)) {
      setErrorMessage('First name cannot contain spaces and must not be empty.');
      return;
    }
    if (lastInitial.length !== 1) {
      setErrorMessage('Last initial must be exactly one character.');
      return;
    }

    try {
      // Query the guests database
      const { data, error } = await guests_db
        .from('guests')
        .select('*')
        .eq('first_name', firstName)
        .eq('last_initial', lastInitial);

      if (error) {
        console.error('Error fetching guest:', error);
        setErrorMessage('An error occurred. Please try again later.');
        return;
      }

      if (!data || data.length === 0) {
        // No guest found
        reroute('/noinvite');
      } else {
        // Guest found
        const guest = data[0];
        if (guest.going === 1) {
            reroute(`/going/${guest.id}`);;
        } else if (guest.going === 0) {
            reroute(`/going/${guest.id}`);;
        } else {
            reroute(`/purgatory/${guest.id}`);;
        }
      }
    } catch (err) {
      console.error('Validation error:', err);
      setErrorMessage('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h1>Validate</h1>
      <form onSubmit={handleValidation}>
        <div>
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value.toLowerCase().replace(/\s/g, ''))} // Force lowercase and remove spaces
            required
            placeholder="Enter your first name"
          />
        </div>
        <div>
          <label htmlFor="lastInitial">Last Initial:</label>
          <input
            type="text"
            id="lastInitial"
            value={lastInitial}
            onChange={(e) =>
              setLastInitial(e.target.value.toLowerCase().slice(0, 1)) // Force lowercase and limit to one character
            }
            required
            placeholder="Enter your last initial"
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}

export default Validate;

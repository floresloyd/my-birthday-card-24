import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Validate.css';
import guests_db from '../backend/Supabaseclient';
import mySprite from '../assets/8bit-me.png';

function Validate() {
  const [firstName, setFirstName] = useState('');
  const [lastInitial, setLastInitial] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleValidation = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Trim whitespace and enforce lowercase
    const sanitizedFirstName = firstName.trim().toLowerCase();
    const sanitizedLastInitial = lastInitial.trim().toLowerCase();

    // Validate inputs
    if (!sanitizedFirstName || /\s/.test(sanitizedFirstName)) {
      setErrorMessage('First name cannot contain spaces and must not be empty.');
      return;
    }
    if (sanitizedFirstName.length > 15) {
      setErrorMessage('First name cannot exceed 15 characters.');
      return;
    }
    if (sanitizedLastInitial.length !== 1 || !/^[a-z]$/.test(sanitizedLastInitial)) {
      setErrorMessage('Last initial must be exactly one lowercase letter.');
      return;
    }

    try {
      const { data, error } = await guests_db
        .from('guests')
        .select('*')
        .eq('first_name', sanitizedFirstName)
        .eq('last_initial', sanitizedLastInitial);

      if (error) {
        setErrorMessage('An error occurred. Please try again later.');
        return;
      }

      if (!data || data.length === 0) {
        navigate('/noinvite');
      } else {
        const guest = data[0];
        if (guest.going === 1) navigate(`/going/${guest.id}`);
        else if (guest.going === 0) navigate(`/notgoing/${guest.id}`);
        else navigate(`/purgatory/${guest.id}`);
      }
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="validate-content">
      <div className="dialog-and-sprite">
        <img src={mySprite} className="my-sprite" alt="8bit-loydsprite" />
        <div className="message-box">
          <p>Hello! Please identify yourself!</p>
        </div>
      </div>
      <div className="response-box">
        <form onSubmit={handleValidation}>
          <div className="form-field">
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              maxLength={15} // Restrict input to 15 characters
              onChange={(e) => {
                // Prevent spaces and restrict to max length
                const sanitizedValue = e.target.value.replace(/\s+/g, '').slice(0, 15);
                setFirstName(sanitizedValue);
              }}
            />
          </div>
          <div className="form-field">
            <label htmlFor="lastInitial">Last Initial:</label>
            <input
              type="text"
              id="lastInitial"
              value={lastInitial}
              onChange={(e) => {
                // Restrict to a single character
                const sanitizedValue = e.target.value.slice(0, 1);
                setLastInitial(sanitizedValue);
              }}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
}

export default Validate;

import "./Going.css";
import { useNavigate, useParams } from "react-router-dom";
import guests_db from '../backend/Supabaseclient';

function Going() {
    const { id } = useParams(); // Get the guest's ID from the URL
    const reroute = useNavigate();

    const handleRerouteToEDA = () => {
        reroute('/eda');
    }

    const updateStatusToNotGoing = async () => {
        try {
          const { error } = await guests_db
            .from('guests')
            .update({ going: 0 }) // Update the status (example: change to "not going")
            .eq('id', id);
    
          if (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status. Please try again.');
          } else {
            alert("Your status has been updated! I'll see you some other time for sure!");
            reroute(`/notgoing/${id}`);
          }
        } catch (err) {
          console.error('Unexpected error:', err);
          alert('Something went wrong. Please try again.');
        }
      };

    return (
        <div>
            <h1> Going </h1>
            <button onClick={handleRerouteToEDA}> eda </button>

            <button onClick={updateStatusToNotGoing}>Change Status to Not Going</button>
        </div>
    )
}


export default Going

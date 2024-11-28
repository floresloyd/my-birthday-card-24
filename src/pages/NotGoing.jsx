import "./NotGoing.css";
import { useNavigate, useParams } from "react-router-dom";
import guests_db from '../backend/Supabaseclient';


function NotGoing() {
    const { id } = useParams(); // Get the guest's ID from the URL
    const reroute = useNavigate();

    const handleRerouteToEDA = () => {
        reroute('/eda');
    }

    const updateStatusToGoing = async () => {
        try {
          const { error } = await guests_db
            .from('guests')
            .update({ going: 1 }) // Update the status (example: change to "not going")
            .eq('id', id);
    
          if (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status. Please try again.');
          } else {
            alert("Your status has been updated! I'll see you there!");
            reroute(`/going/${id}`);
          }
        } catch (err) {
          console.error('Unexpected error:', err);
          alert('Something went wrong. Please try again.');
        }
      };

    return (
        <div>
            <h1> not going</h1>
            <button onClick={handleRerouteToEDA}> eda </button>
            <button onClick={updateStatusToGoing}> I changed my mind and im going!</button>
        </div>
    )
}

export default NotGoing

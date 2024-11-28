const updateStatus = async () => {
    try {
      const { error } = await guests_db
        .from('guests')
        .update({ going: 0 }) // Update the status (example: change to "not going")
        .eq('id', id);

      if (error) {
        console.error('Error updating status:', error);
        alert('Failed to update status. Please try again.');
      } else {
        alert('Your status has been updated!');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('Something went wrong. Please try again.');
    }
  };


  export default updateStatus;
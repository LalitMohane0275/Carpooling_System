import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

const RidesTaken = () => {
  const { userId } = useParams();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/v1/get-passenger-rides/${userId}`, {
          method: 'GET', 
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' 
          }
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setRides(data.rides);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(err.message);
      }
    };

    fetchRides();
  }, [userId]);

  if (loading) return <p>Loading rides...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Available Rides</h2>
      {rides.length === 0 ? (
        <p>No rides available.</p>
      ) : (
        <ul>
          {rides.map((ride) => (
            <li key={ride._id}>
              <strong>From:</strong> {ride.start} - <strong>To:</strong> {ride.destination} <br />
              <strong>Date:</strong> {ride.date} <br />
              <strong>Time:</strong> {ride.time} <br />
              <strong>Seats Available:</strong> {ride.seats}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RidesTaken;

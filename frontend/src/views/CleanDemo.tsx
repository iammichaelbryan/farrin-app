function CleanDemo() {
  return (
    <div>
      <style>{`
        .demo-container {
          padding: 40px;
          font-family: Arial, sans-serif;
        }
        .demo-title {
          color: #2563eb;
          font-size: 36px;
          margin-bottom: 20px;
        }
        .trip-info {
          background-color: #f8fafc;
          padding: 30px;
          border-radius: 12px;
          margin-bottom: 30px;
        }
        .trip-header {
          color: #1e293b;
          margin-bottom: 15px;
        }
        .trip-details {
          color: #64748b;
          margin-bottom: 20px;
        }
        .days-grid {
          display: grid;
          gap: 15px;
        }
        .day-card {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #3b82f6;
        }
        .day-card:nth-child(2) {
          border-left-color: #10b981;
        }
        .day-card:nth-child(3) {
          border-left-color: #8b5cf6;
        }
        .day-card:nth-child(4) {
          border-left-color: #f59e0b;
        }
        .day-title {
          margin: 0 0 8px 0;
          color: #1e293b;
        }
        .day-desc {
          margin: 0;
          color: #64748b;
        }
        .cost-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }
        .cost-card {
          padding: 20px;
          border-radius: 8px;
        }
        .cost-card.flights {
          background-color: #dbeafe;
        }
        .cost-card.hotel {
          background-color: #dcfce7;
        }
        .cost-card.activities {
          background-color: #fef3c7;
        }
        .cost-card.dining {
          background-color: #fce7f3;
        }
        .cost-title {
          margin: 0 0 10px 0;
        }
        .cost-title.flights {
          color: #1d4ed8;
        }
        .cost-title.hotel {
          color: #166534;
        }
        .cost-title.activities {
          color: #92400e;
        }
        .cost-title.dining {
          color: #be185d;
        }
        .cost-amount {
          margin: 0;
        }
        .cost-amount.flights {
          color: #1e40af;
        }
        .cost-amount.hotel {
          color: #15803d;
        }
        .cost-amount.activities {
          color: #a16207;
        }
        .cost-amount.dining {
          color: #c2185b;
        }
        .cta-section {
          margin-top: 40px;
          text-align: center;
        }
        .cta-button {
          background-color: #2563eb;
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          border: none;
          font-size: 16px;
          cursor: pointer;
        }
        .cta-button:hover {
          background-color: #1d4ed8;
        }
      `}</style>
      
      <div className="demo-container">
        <h1 className="demo-title">
          🗼 Paris Itinerary Demo
        </h1>
        
        <div className="trip-info">
          <h2 className="trip-header">7-Day Paris Adventure</h2>
          <p className="trip-details">June 26 - July 2, 2025 • Total Budget: $4,067</p>
          
          <div className="days-grid">
            <div className="day-card">
              <h3 className="day-title">Day 1: Arrival & Seine Cruise</h3>
              <p className="day-desc">CDG Airport arrival, hotel check-in, evening river cruise</p>
            </div>
            
            <div className="day-card">
              <h3 className="day-title">Day 2: Louvre & Tuileries</h3>
              <p className="day-desc">Skip-the-line Louvre tour, lunch at Angelina, garden walk</p>
            </div>
            
            <div className="day-card">
              <h3 className="day-title">Day 3: Eiffel Tower</h3>
              <p className="day-desc">Summit access, Champ de Mars picnic, Montmartre tour</p>
            </div>
            
            <div className="day-card">
              <h3 className="day-title">Day 4: Versailles</h3>
              <p className="day-desc">Full day at Palace of Versailles and gardens</p>
            </div>
          </div>
        </div>
        
        <div className="cost-grid">
          <div className="cost-card flights">
            <h3 className="cost-title flights">✈️ Flights</h3>
            <p className="cost-amount flights">Air France roundtrip: $1,770</p>
          </div>
          
          <div className="cost-card hotel">
            <h3 className="cost-title hotel">🏨 Hotel</h3>
            <p className="cost-amount hotel">7 nights boutique hotel: $1,400</p>
          </div>
          
          <div className="cost-card activities">
            <h3 className="cost-title activities">🎯 Activities</h3>
            <p className="cost-amount activities">Tours & attractions: $467</p>
          </div>
          
          <div className="cost-card dining">
            <h3 className="cost-title dining">🍽️ Dining</h3>
            <p className="cost-amount dining">Restaurants & cafés: $430</p>
          </div>
        </div>
        
        <div className="cta-section">
          <button 
            className="cta-button"
            onClick={() => alert('This is a demo! Sign up to create your own trip.')}
          >
            Start Planning Your Trip
          </button>
        </div>
      </div>
    </div>
  );
}

export default CleanDemo;
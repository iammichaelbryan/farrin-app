function SimpleItinerary() {
  console.log('SimpleItinerary component rendered!');
  
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ color: 'red', fontSize: '32px' }}>
        DEMO ITINERARY WORKS! 🎉
      </h1>
      <p>If you can see this, the standalone page is working!</p>
      
      <div style={{ backgroundColor: 'white', padding: '20px', marginTop: '20px', borderRadius: '8px' }}>
        <h2>Paris Trip - 7 Days</h2>
        <ul>
          <li>Day 1: Arrival & Seine Cruise</li>
          <li>Day 2: Louvre Museum</li>
          <li>Day 3: Eiffel Tower</li>
          <li>Day 4: Versailles</li>
          <li>Day 5: Montmartre</li>
          <li>Day 6: Latin Quarter</li>
          <li>Day 7: Departure</li>
        </ul>
        <p><strong>Total Budget: $4,067</strong></p>
      </div>
    </div>
  );
}

export default SimpleItinerary;
import React, { useState, useEffect } from 'react';
import InteractiveMap from './InteractiveMap';
import ImpactSidebar from './ImpactSidebar';
import { Target, Loader } from 'lucide-react';
import AsteroidList from './AsteroidList';

import { Link } from 'react-router-dom';


const Wexio = () => {
  const [impactEvent, setImpactEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [asteroids, setAsteroids] = useState([]);
  const [selectedAsteroid, setSelectedAsteroid] = useState(null);
  const [ShowAsteroidList, setShowAsteroidList] = useState(true);


  function resetImpact() {
    setImpactEvent(null);
    setSelectedAsteroid(null);
    setShowAsteroidList(true);
}

  useEffect(() => {
    const fetchAsteroidData = async () => {
      const API_KEY = process.env.NASA_API_KEY;
      const START_DATE = '2025-06-01';
      const END_DATE = '2025-06-08';
      const API_URL = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${START_DATE}&end_date=${END_DATE}&api_key=${API_KEY}`;

      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();

        let allAsteroids = [];
        Object.keys(data.near_earth_objects).forEach(date => {
          allAsteroids = allAsteroids.concat(data.near_earth_objects[date]);
        });

        if (allAsteroids.length === 0) {
          throw new Error('No asteroids found in the selected date range.');
        }

        setAsteroids(allAsteroids);
        console.log('Sample asteroid:', allAsteroids[0]);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAsteroidData();
  }, []);


  const handleMapClick = (latlng) => {
    if (selectedAsteroid) {
       setShowAsteroidList(false);
      const diameterMeters = selectedAsteroid.estimated_diameter.meters.estimated_diameter_max;
      const velocityKms = parseFloat(selectedAsteroid.close_approach_data[0].relative_velocity.kilometers_per_second);

      const radius = diameterMeters / 2;
      const volume = (4 / 3) * Math.PI * Math.pow(radius, 3);
      const mass = 3000 * volume;
      const kineticEnergyJoules = 0.5 * mass * Math.pow(velocityKms * 1000, 2);
      const energyMegatons = (kineticEnergyJoules / 4.184e15).toFixed(2);

      setImpactEvent({
        position: latlng,
        radius: 60000,
        details: {
          source: {
            name: selectedAsteroid.name.replace(/[()]/g, ''),
            diameter: `${diameterMeters.toFixed(2)} meters`,
            velocity: `${velocityKms.toFixed(2)} km/s`,
            isPotentiallyHazardous: selectedAsteroid.is_potentially_hazardous_asteroid,
            closeApproachDate: selectedAsteroid.close_approach_data[0].close_approach_date_full,
            missDistance: `${parseFloat(selectedAsteroid.close_approach_data[0].miss_distance.kilometers).toLocaleString()} km`,
            absoluteMagnitude: selectedAsteroid.absolute_magnitude_h,
            jplUrl: selectedAsteroid.nasa_jpl_url,
          },
          consequences: {
            impactEnergy: `${energyMegatons} Megatons TNT`,
            seismicEffect: `Magnitude ${(6 + energyMegatons / 1000).toFixed(1)} Richter`,
            airBlast: 'Significant overpressure event expected.',
          },
          mitigation: {
            threatLevel: selectedAsteroid.is_potentially_hazardous_asteroid ? 'MONITORING REQUIRED' : 'LOW',
            recommendedAction: 'Further observation to refine orbital parameters.',
          },
        },
      });
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-900 text-white font-sans">
      <aside className="w-full max-w-sm p-6 bg-gray-800 shadow-2xl flex flex-col">
        <div className="flex items-center mb-6">
          <Target className="w-8 h-8 text-red-400 mr-3" />
          <div>
            <h1 className="text-2xl font-bold">Asteroid Impact Simulator</h1>
            <p className="text-sm text-gray-400">Project: Impactor-2025</p>
          </div>
        </div>

        {isLoading && (
          <div className="flex-grow flex items-center justify-center">
            <Loader className="animate-spin" />
            <p className="ml-2">Fetching NEO Data...</p>
          </div>
        )}
        {error && (
          <div className="flex-grow flex items-center justify-center text-red-400">
            <p>Error: {error}</p>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {ShowAsteroidList && (
            <div>
                <p className="text-sm mb-2">Select an asteroid: </p>
                <AsteroidList asteroids={asteroids} onSelect={setSelectedAsteroid} />
            </div>
            )}

            <Link to="/Asteroids" className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center mt-3 transition-colors"><p className='py-7 '>click here to see mauro in tanga</p>  </Link>

            

            <ImpactSidebar impact={impactEvent} resetImpact={resetImpact} />
            
          </>
        )}
      </aside>

      <main className="flex-1 h-full">
        <InteractiveMap impact={impactEvent} onMapClick={handleMapClick} />
      </main>
    </div>
  );
};

export default Wexio;

import React from 'react';

import {Zap, ShieldCheck, MapPin, Telescope, Gauge, Scale, Wind, ExternalLink, Ruler } from 'lucide-react';





export default function ImpactSidebar({ impact, resetImpact }) {

  if (!impact) {
    return (
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="text-center p-4 border-2 border-dashed border-gray-600 rounded-lg">
          <p className="text-gray-300 font-medium">Click on the map to simulate an impact.</p>
          <p className="text-sm text-gray-500 mt-2">
            The sidebar will populate with real data from a selected Near-Earth Object.
          </p>
        </div>
      </div>
    );
  }




  const { details, position } = impact;
  const { source, consequences, mitigation } = details;

return (
    <div className="flex-grow overflow-y-auto pr-2">

        <InfoSection title="Target Object Data" icon={<Telescope className="w-5 h-5" />}>
            <StatItem label="Name" value={source.name} />
            <StatItem label="Est. Diameter" value={source.diameter} />
            <StatItem label="Relative Velocity" value={source.velocity} />
            <StatItem label="Close Approach" value={source.closeApproachDate} />

            <StatItem label="Miss Distance" value={source.missDistance} />

            <StatItem label="Abs. Magnitude (H)" value={source.absoluteMagnitude} />
            <StatItem 
                label="Potentially Hazardous" 
                value={source.isPotentiallyHazardous ? 'Yes' : 'No'}
                valueColor={source.isPotentiallyHazardous ? 'text-red-400' : 'text-green-400'}
            />

            <a href={source.jplUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center mt-3 transition-colors">
                    View on JPL Database <ExternalLink className="w-4 h-4 ml-2" />
            </a>
        </InfoSection>

        <InfoSection title="Predicted Consequences" icon={<Zap className="w-5 h-5" />}>
            <StatItem label="Impact Location" value={`Lat: ${position.lat.toFixed(3)}, Lng: ${position.lng.toFixed(3)}`} icon={<MapPin size={16} className="text-gray-400" />} />
            <StatItem label="Kinetic Energy" value={consequences.impactEnergy} icon={<Gauge size={16} className="text-gray-400" />} />
            <StatItem label="Seismic Effect" value={consequences.seismicEffect} icon={<Scale size={16} className="text-gray-400" />} />
            <StatItem label="Air Blast" value={consequences.airBlast} icon={<Wind size={16} className="text-gray-400" />} />
        </InfoSection>

        <InfoSection title="Mitigation Report" icon={<ShieldCheck className="w-5 h-5" />}>
             <StatItem 
                label="Threat Level" 
                value={mitigation.threatLevel}
                valueColor={source.isPotentiallyHazardous ? 'text-yellow-400 font-bold' : 'text-gray-300'}
            />
            <StatItem label="Recommended Action" value={mitigation.recommendedAction} />
        </InfoSection>
    
        <div className="flex justify-center mt-4">
            <button onClick={() => {resetImpact()}} className="px-4 py-2 rounded-md border border-neutral-300 bg-neutral-100 text-neutral-500 text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md ">
                Reset Simulation
            </button>
        </div>
    </div>
);
}


const InfoSection = ({ title, icon, children }) => (
  <div className="mb-6 bg-gray-700/30 p-4 rounded-lg">
    <h3 className="text-lg font-semibold text-gray-300 flex items-center mb-3">
      {React.cloneElement(icon, { className: "mr-2 text-cyan-400" })}
      {title}
    </h3>
    <div className="space-y-2">
      {children}
    </div>
  </div>
);

const StatItem = ({ label, value, valueColor = 'text-white', icon = null }) => (
  <div className="flex justify-between items-center text-sm">
    <p className="text-gray-400 flex items-center">
      {icon && <span className="mr-2">{icon}</span>}
      {label}:
    </p>
    <p className={`font-medium ${valueColor}`}>{value}</p>
  </div>
);

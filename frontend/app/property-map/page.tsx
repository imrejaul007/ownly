'use client';

import { useState } from 'react';
import { MapPin, Building, TrendingUp, Train, ShoppingCart, School, Hospital, TreePine, Navigation } from 'lucide-react';

type City = 'All' | 'Dubai' | 'Abu Dhabi' | 'Sharjah' | 'Ajman';

interface Property {
  id: number;
  name: string;
  city: City;
  area: string;
  roi: number;
  minInvestment: number;
  position: { x: number; y: number }; // Relative positioning in the map
  amenities: {
    metro: number;
    mall: number;
    school: number;
    hospital?: number;
    park?: number;
  };
}

interface AmenityFilter {
  metro: boolean;
  mall: boolean;
  school: boolean;
  hospital: boolean;
  park: boolean;
}

const properties: Property[] = [
  // Dubai Properties (7)
  { id: 1, name: 'Marina Heights Residences', city: 'Dubai', area: 'Marina', roi: 8.5, minInvestment: 250000, position: { x: 35, y: 45 }, amenities: { metro: 0.5, mall: 1.2, school: 0.8, hospital: 2.0, park: 0.3 } },
  { id: 2, name: 'Business Bay Tower', city: 'Dubai', area: 'Business Bay', roi: 9.2, minInvestment: 300000, position: { x: 42, y: 48 }, amenities: { metro: 0.3, mall: 0.9, school: 1.5, hospital: 1.8, park: 1.0 } },
  { id: 3, name: 'Downtown Vista', city: 'Dubai', area: 'Downtown', roi: 7.8, minInvestment: 400000, position: { x: 40, y: 50 }, amenities: { metro: 0.2, mall: 0.5, school: 1.2, hospital: 1.5, park: 0.4 } },
  { id: 4, name: 'Palm Residence', city: 'Dubai', area: 'Palm Jumeirah', roi: 6.5, minInvestment: 500000, position: { x: 30, y: 42 }, amenities: { metro: 3.5, mall: 2.8, school: 2.0, hospital: 3.5, park: 0.2 } },
  { id: 5, name: 'JBR Beachfront', city: 'Dubai', area: 'JBR', roi: 7.2, minInvestment: 350000, position: { x: 33, y: 40 }, amenities: { metro: 1.8, mall: 0.7, school: 1.8, hospital: 2.5, park: 0.1 } },
  { id: 6, name: 'Silicon Oasis Hub', city: 'Dubai', area: 'Silicon Oasis', roi: 9.5, minInvestment: 200000, position: { x: 48, y: 55 }, amenities: { metro: 2.0, mall: 1.5, school: 0.5, hospital: 1.2, park: 0.8 } },
  { id: 7, name: 'Creek Towers', city: 'Dubai', area: 'Creek', roi: 8.8, minInvestment: 280000, position: { x: 45, y: 52 }, amenities: { metro: 0.8, mall: 1.0, school: 1.0, hospital: 1.3, park: 0.6 } },

  // Abu Dhabi Properties (3)
  { id: 8, name: 'Reem Island Apartments', city: 'Abu Dhabi', area: 'Reem Island', roi: 7.5, minInvestment: 320000, position: { x: 15, y: 65 }, amenities: { metro: 4.0, mall: 1.5, school: 2.0, hospital: 2.8, park: 0.5 } },
  { id: 9, name: 'Corniche Residence', city: 'Abu Dhabi', area: 'Corniche', roi: 6.8, minInvestment: 380000, position: { x: 12, y: 62 }, amenities: { metro: 3.5, mall: 1.8, school: 1.5, hospital: 2.0, park: 0.3 } },
  { id: 10, name: 'Yas Island Villas', city: 'Abu Dhabi', area: 'Yas Island', roi: 7.0, minInvestment: 450000, position: { x: 18, y: 68 }, amenities: { metro: 5.0, mall: 2.5, school: 3.0, hospital: 4.0, park: 1.0 } },

  // Sharjah Property (1)
  { id: 11, name: 'Al Zahia Community', city: 'Sharjah', area: 'Al Zahia', roi: 10.2, minInvestment: 180000, position: { x: 60, y: 45 }, amenities: { metro: 8.0, mall: 3.0, school: 0.7, hospital: 2.5, park: 0.5 } },

  // Ajman Property (1)
  { id: 12, name: 'Ajman Pearl Towers', city: 'Ajman', area: 'Pearl Towers', roi: 11.5, minInvestment: 150000, position: { x: 70, y: 40 }, amenities: { metro: 10.0, mall: 4.0, school: 1.0, hospital: 3.0, park: 1.5 } },
];

export default function PropertyMapPage() {
  const [selectedCity, setSelectedCity] = useState<City>('All');
  const [hoveredProperty, setHoveredProperty] = useState<number | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
  const [amenityFilters, setAmenityFilters] = useState<AmenityFilter>({
    metro: false,
    mall: false,
    school: false,
    hospital: false,
    park: false,
  });

  const filteredProperties = properties.filter(property => {
    // City filter
    if (selectedCity !== 'All' && property.city !== selectedCity) return false;

    // Amenity filters
    if (amenityFilters.metro && property.amenities.metro > 1.0) return false;
    if (amenityFilters.mall && property.amenities.mall > 2.0) return false;
    if (amenityFilters.school && property.amenities.school > 1.5) return false;
    if (amenityFilters.hospital && (!property.amenities.hospital || property.amenities.hospital > 3.0)) return false;
    if (amenityFilters.park && (!property.amenities.park || property.amenities.park > 1.0)) return false;

    return true;
  });

  const cityStats = [
    { city: 'Dubai', count: 7, percentage: 58, color: 'from-blue-500 to-cyan-500' },
    { city: 'Abu Dhabi', count: 3, percentage: 25, color: 'from-purple-500 to-pink-500' },
    { city: 'Sharjah', count: 1, percentage: 8, color: 'from-green-500 to-emerald-500' },
    { city: 'Ajman', count: 1, percentage: 8, color: 'from-orange-500 to-red-500' },
  ];

  const getCityColor = (city: City): string => {
    switch (city) {
      case 'Dubai': return 'bg-blue-500';
      case 'Abu Dhabi': return 'bg-purple-500';
      case 'Sharjah': return 'bg-green-500';
      case 'Ajman': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const toggleAmenityFilter = (amenity: keyof AmenityFilter) => {
    setAmenityFilters(prev => ({
      ...prev,
      [amenity]: !prev[amenity]
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Gradient Orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-teal-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="fixed top-1/2 left-1/2 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-5"></div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-teal-600/20 to-cyan-600/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          {/* Map Icon Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-teal-500/10 border border-blue-500/20 rounded-full px-6 py-2">
              <MapPin className="w-5 h-5 text-blue-400" />
              <span className="text-blue-300 font-semibold text-sm">Interactive Map</span>
            </div>
          </div>

          {/* Title and Subtitle */}
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-teal-100 bg-clip-text text-transparent mb-4 text-center">
            Property Locations
          </h1>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto text-center mb-8">
            Explore investment opportunities across the UAE
          </p>

          {/* Filter Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {(['All', 'Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman'] as City[]).map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  selectedCity === city
                    ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                    : 'bg-white/5 backdrop-blur-xl border border-white/10 text-blue-200 hover:bg-white/10 hover:border-blue-500/30'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Map Placeholder Section */}
        <div className="mb-12 -mt-8">
          <div className="relative h-[600px] bg-gradient-to-br from-slate-900 via-blue-900/20 to-teal-900/20 rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
            {/* Map Background Pattern */}
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(to right, rgba(59, 130, 246, 0.05) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(59, 130, 246, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}></div>

            {/* Geographic Features */}
            <div className="absolute inset-0">
              {/* Dubai Coastline */}
              <div className="absolute top-[35%] left-[25%] w-[30%] h-[25%] bg-gradient-to-br from-blue-600/10 to-cyan-600/10 rounded-full blur-3xl"></div>

              {/* Abu Dhabi Coast */}
              <div className="absolute top-[55%] left-[5%] w-[25%] h-[20%] bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-full blur-3xl"></div>

              {/* Sharjah/Ajman */}
              <div className="absolute top-[38%] left-[55%] w-[20%] h-[15%] bg-gradient-to-br from-green-600/10 to-emerald-600/10 rounded-full blur-2xl"></div>
            </div>

            {/* City Labels */}
            <div className="absolute top-[38%] left-[38%] text-blue-300/50 font-bold text-2xl">DUBAI</div>
            <div className="absolute top-[58%] left-[15%] text-purple-300/50 font-bold text-xl">ABU DHABI</div>
            <div className="absolute top-[42%] left-[60%] text-green-300/50 font-bold text-lg">SHARJAH</div>
            <div className="absolute top-[38%] left-[70%] text-orange-300/50 font-bold text-base">AJMAN</div>

            {/* Property Pins */}
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{
                  left: `${property.position.x}%`,
                  top: `${property.position.y}%`,
                }}
                onMouseEnter={() => setHoveredProperty(property.id)}
                onMouseLeave={() => setHoveredProperty(null)}
                onClick={() => setSelectedProperty(property.id === selectedProperty ? null : property.id)}
              >
                {/* Pin */}
                <div className={`relative transition-all duration-300 ${
                  hoveredProperty === property.id || selectedProperty === property.id ? 'scale-125 z-50' : 'z-10'
                }`}>
                  {/* Pin Circle */}
                  <div className={`w-12 h-12 rounded-full ${getCityColor(property.city)} shadow-lg flex items-center justify-center transition-all duration-300 ${
                    hoveredProperty === property.id || selectedProperty === property.id
                      ? 'ring-4 ring-white/50 shadow-2xl'
                      : 'hover:ring-2 hover:ring-white/30'
                  }`}>
                    <Building className="w-6 h-6 text-white" />
                  </div>

                  {/* Pin Pointer */}
                  <div className={`absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[12px] ${getCityColor(property.city)} border-l-transparent border-r-transparent`}></div>

                  {/* Pulse Effect */}
                  <div className={`absolute inset-0 w-12 h-12 rounded-full ${getCityColor(property.city)} animate-ping opacity-20`}></div>
                </div>

                {/* Hover Card */}
                {(hoveredProperty === property.id || selectedProperty === property.id) && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-72 bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl p-4 z-50 animate-fadeIn">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-white font-bold text-lg mb-1 line-clamp-2">{property.name}</h4>
                        <p className="text-blue-300 text-sm flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {property.city} - {property.area}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-green-400 font-bold text-xl">{property.roi}%</div>
                        <div className="text-xs text-green-300">ROI</div>
                      </div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-3">
                      <div className="text-xs text-blue-300 mb-1">Min Investment</div>
                      <div className="text-white font-bold">{formatCurrency(property.minInvestment)}</div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-white mb-2">Nearby Amenities:</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1 text-purple-200">
                          <Train className="w-3 h-3" />
                          Metro: {property.amenities.metro} km
                        </div>
                        <div className="flex items-center gap-1 text-purple-200">
                          <ShoppingCart className="w-3 h-3" />
                          Mall: {property.amenities.mall} km
                        </div>
                        <div className="flex items-center gap-1 text-purple-200">
                          <School className="w-3 h-3" />
                          School: {property.amenities.school} km
                        </div>
                        {property.amenities.hospital && (
                          <div className="flex items-center gap-1 text-purple-200">
                            <Hospital className="w-3 h-3" />
                            Hospital: {property.amenities.hospital} km
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Compass */}
            <div className="absolute top-6 right-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full p-4">
              <Navigation className="w-6 h-6 text-blue-400" />
            </div>

            {/* Scale */}
            <div className="absolute bottom-6 left-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="w-20 h-1 bg-white/30"></div>
                <span className="text-blue-300 text-sm font-medium">50 km</span>
              </div>
            </div>
          </div>
        </div>

        {/* Location Stats Bar */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">City-wise Distribution</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cityStats.map((stat) => (
              <div
                key={stat.city}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-white font-bold text-2xl">{stat.count}</div>
                    <div className="text-blue-200 text-sm">Properties</div>
                  </div>
                  <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent px-3 py-1 rounded-lg text-xs font-semibold border border-white/20 bg-white/5`}>
                    {stat.city}
                  </div>
                </div>

                {/* Percentage Bar */}
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-blue-200">Share</span>
                    <span className="font-semibold text-white">{stat.percentage}%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden border border-white/10">
                    <div
                      className={`bg-gradient-to-r ${stat.color} h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${stat.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nearby Amenities Filter */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Filter by Nearby Amenities</h2>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={amenityFilters.metro}
                  onChange={() => toggleAmenityFilter('metro')}
                  className="w-5 h-5 rounded border-2 border-blue-500/50 bg-white/5 checked:bg-blue-500 checked:border-blue-500 transition-all cursor-pointer"
                />
                <div className="flex items-center gap-2">
                  <Train className="w-5 h-5 text-blue-400" />
                  <span className="text-white group-hover:text-blue-300 transition-colors">Metro (≤1km)</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={amenityFilters.mall}
                  onChange={() => toggleAmenityFilter('mall')}
                  className="w-5 h-5 rounded border-2 border-purple-500/50 bg-white/5 checked:bg-purple-500 checked:border-purple-500 transition-all cursor-pointer"
                />
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-purple-400" />
                  <span className="text-white group-hover:text-purple-300 transition-colors">Malls (≤2km)</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={amenityFilters.school}
                  onChange={() => toggleAmenityFilter('school')}
                  className="w-5 h-5 rounded border-2 border-green-500/50 bg-white/5 checked:bg-green-500 checked:border-green-500 transition-all cursor-pointer"
                />
                <div className="flex items-center gap-2">
                  <School className="w-5 h-5 text-green-400" />
                  <span className="text-white group-hover:text-green-300 transition-colors">Schools (≤1.5km)</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={amenityFilters.hospital}
                  onChange={() => toggleAmenityFilter('hospital')}
                  className="w-5 h-5 rounded border-2 border-red-500/50 bg-white/5 checked:bg-red-500 checked:border-red-500 transition-all cursor-pointer"
                />
                <div className="flex items-center gap-2">
                  <Hospital className="w-5 h-5 text-red-400" />
                  <span className="text-white group-hover:text-red-300 transition-colors">Hospitals (≤3km)</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={amenityFilters.park}
                  onChange={() => toggleAmenityFilter('park')}
                  className="w-5 h-5 rounded border-2 border-teal-500/50 bg-white/5 checked:bg-teal-500 checked:border-teal-500 transition-all cursor-pointer"
                />
                <div className="flex items-center gap-2">
                  <TreePine className="w-5 h-5 text-teal-400" />
                  <span className="text-white group-hover:text-teal-300 transition-colors">Parks (≤1km)</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Property List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              Available Properties ({filteredProperties.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all duration-300 hover:scale-[1.02]"
              >
                {/* Property Image Placeholder */}
                <div className={`relative h-56 bg-gradient-to-br ${
                  property.city === 'Dubai' ? 'from-blue-500 to-cyan-500' :
                  property.city === 'Abu Dhabi' ? 'from-purple-500 to-pink-500' :
                  property.city === 'Sharjah' ? 'from-green-500 to-emerald-500' :
                  'from-orange-500 to-red-500'
                }`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                  {/* Building Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Building className="w-24 h-24 text-white/20" />
                  </div>

                  {/* ROI Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-green-500 text-white px-4 py-2 rounded-xl font-bold text-lg shadow-lg">
                      {property.roi}% ROI
                    </div>
                  </div>

                  {/* Location Badge */}
                  <div className="absolute bottom-4 left-4">
                    <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span className="text-slate-900 font-semibold text-sm">{property.city} - {property.area}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Property Name */}
                  <h3 className="text-xl font-bold mb-4 text-white line-clamp-2">{property.name}</h3>

                  {/* Min Investment */}
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-4">
                    <div className="text-xs text-blue-300 mb-1 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Minimum Investment
                    </div>
                    <div className="text-2xl font-bold text-blue-400">{formatCurrency(property.minInvestment)}</div>
                  </div>

                  {/* Amenities Distances */}
                  <div className="mb-4">
                    <div className="text-xs font-semibold text-white mb-3">Distance from Key Locations:</div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-purple-200 bg-white/5 rounded-lg p-2">
                        <Train className="w-4 h-4 text-purple-400" />
                        <div>
                          <div className="text-xs text-purple-300">Metro</div>
                          <div className="font-semibold text-white">{property.amenities.metro} km</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-purple-200 bg-white/5 rounded-lg p-2">
                        <ShoppingCart className="w-4 h-4 text-purple-400" />
                        <div>
                          <div className="text-xs text-purple-300">Mall</div>
                          <div className="font-semibold text-white">{property.amenities.mall} km</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-purple-200 bg-white/5 rounded-lg p-2">
                        <School className="w-4 h-4 text-green-400" />
                        <div>
                          <div className="text-xs text-purple-300">School</div>
                          <div className="font-semibold text-white">{property.amenities.school} km</div>
                        </div>
                      </div>
                      {property.amenities.hospital && (
                        <div className="flex items-center gap-2 text-purple-200 bg-white/5 rounded-lg p-2">
                          <Hospital className="w-4 h-4 text-red-400" />
                          <div>
                            <div className="text-xs text-purple-300">Hospital</div>
                            <div className="font-semibold text-white">{property.amenities.hospital} km</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* View Details Button */}
                  <button className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 group-hover:scale-105">
                    View Details
                    <Building className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredProperties.length === 0 && (
            <div className="text-center py-20">
              <MapPin className="w-16 h-16 text-blue-300 mx-auto mb-4 opacity-50" />
              <p className="text-blue-200 text-lg">No properties found matching your filters</p>
              <button
                onClick={() => {
                  setSelectedCity('All');
                  setAmenityFilters({
                    metro: false,
                    mall: false,
                    school: false,
                    hospital: false,
                    park: false,
                  });
                }}
                className="mt-4 text-blue-400 hover:text-blue-300 transition-colors font-semibold"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

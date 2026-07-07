import React from 'react';
import {
  MapPin, Calendar, Plane, Car, Hotel,
  Sun, CloudRain, CloudSun, Snowflake, Cloud,
  Sparkles, AlertTriangle
} from 'lucide-react';

// DESTINATION CARD WIDGET
export const DestinationWidget = ({ trip }) => {
  if (!trip.destination) {
    return (
      <div className="empty-widget-state glass-card">
        <MapPin size={24} className="text-muted" />
        <p>No destination set yet.</p>
        <span className="app-tagline">Tell Aero where you want to go to load details.</span>
      </div>
    );
  }

  // Pre-configured mock search photo backgrounds or custom gradients based on destination name
  const getBackgroundStyle = (name) => {
    const dest = name.toLowerCase();
    if (dest.includes('tokyo') || dest.includes('japan')) {
      return 'linear-gradient(rgba(8, 12, 20, 0.4), rgba(8, 12, 20, 0.9)), url("https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=600&q=80")';
    }
    if (dest.includes('paris') || dest.includes('france')) {
      return 'linear-gradient(rgba(8, 12, 20, 0.4), rgba(8, 12, 20, 0.9)), url("https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80")';
    }
    if (dest.includes('austin') || dest.includes('texas')) {
      return 'linear-gradient(rgba(8, 12, 20, 0.4), rgba(8, 12, 20, 0.9)), url("https://images.unsplash.com/photo-1531259683007-016a7b628fc3?auto=format&fit=crop&w=600&q=80")';
    }
    if (dest.includes('chicago') || dest.includes('illinois')) {
      return 'linear-gradient(rgba(8, 12, 20, 0.4), rgba(8, 12, 20, 0.9)), url("https://images.unsplash.com/photo-1494522858158-a320b9c088b3?auto=format&fit=crop&w=600&q=80")';
    }
    // Default gradient
    return 'linear-gradient(135deg, #1e1b4b 0%, #030712 100%)';
  };

  return (
    <div className="dest-hero-card glass-card" style={{ border: 'none' }}>
      <div 
        className="dest-hero-bg" 
        style={{ backgroundImage: getBackgroundStyle(trip.destination) }}
      ></div>
      <div className="dest-hero-overlay"></div>
      
      <div className="dest-hero-content">
        <span className="dest-badge">
          {trip.type === 'international' ? 'International' : 'Domestic / Nearby'}
        </span>
        <h2 className="dest-name">{trip.destination}</h2>
        
        <div className="dest-meta">
          <div className="dest-meta-item">
            <Calendar size={13} color="#00f2fe" />
            <span>{trip.dates || 'Dates: Flexible'}</span>
          </div>
          
          {trip.transit && (
            <div className="dest-meta-item">
              {trip.type === 'international' ? <Plane size={13} color="#00f2fe" /> : <Car size={13} color="#00f2fe" />}
              <span>{trip.transit}</span>
            </div>
          )}

          {trip.lodging && (
            <div className="dest-meta-item">
              <Hotel size={13} color="#00f2fe" />
              <span>{trip.lodging}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// WEATHER WIDGET
export const WeatherWidget = ({ trip }) => {
  if (!trip.destination) {
    return (
      <div className="empty-widget-state glass-card">
        <Sun size={24} className="text-muted" />
        <p>Weather updates will appear here.</p>
      </div>
    );
  }

  // Pre-configured mock weather info based on destination
  const getWeather = (name) => {
    const dest = name.toLowerCase();
    if (dest.includes('tokyo')) {
      return { temp: '68°F / 20°C', desc: 'Rainy season', icon: CloudRain, packing: 'Rainy forecast. Pack a compact umbrella, waterproof outer shell, and fast-drying walking shoes.' };
    }
    if (dest.includes('paris')) {
      return { temp: '72°F / 22°C', desc: 'Mild & Breezy', icon: CloudSun, packing: 'Pleasant temperature with light breezes. Pack layers: a light jacket, sunglasses, and comfortable sneakers for walking cobblestones.' };
    }
    if (dest.includes('austin')) {
      return { temp: '94°F / 34°C', desc: 'Very Sunny & Hot', icon: Sun, packing: 'Extreme Texas heat. Pack high SPF sunscreen, polarized sunglasses, light breathable clothes, and a reusable water flask.' };
    }
    if (dest.includes('chicago')) {
      return { temp: '64°F / 18°C', desc: 'Scattered Clouds', icon: Cloud, packing: 'Cool lake breeze. Pack a light windbreaker, jeans, and a warm fleece layer for evening walks by the shore.' };
    }
    return { temp: '75°F / 24°C', desc: 'Clear Skies', icon: Sun, packing: 'Perfect travel weather. Bring light, general tourist clothing, a comfortable pair of shoes, and sunglasses.' };
  };

  const weather = getWeather(trip.destination);
  const IconComponent = weather.icon;

  return (
    <div className="weather-card glass-panel glass-card">
      <h3 className="widget-title">Local Weather & Gear Advice</h3>
      <div className="weather-header">
        <div className="weather-temp-info">
          <IconComponent size={38} className="weather-icon-lg" />
          <div>
            <div className="weather-temp">{weather.temp}</div>
            <div className="weather-desc">{weather.desc} at Destination</div>
          </div>
        </div>
      </div>
      <div className="packing-tips">
        <div className="packing-tips-title">Wanderer Packing Tip</div>
        <p className="packing-tips-text">{weather.packing}</p>
      </div>
    </div>
  );
};

// ITINERARY TIMELINE WIDGET
export const ItineraryWidget = ({ trip }) => {
  if (!trip.activities || trip.activities.length === 0) {
    return (
      <div className="empty-widget-state glass-card">
        <Sparkles size={24} className="text-muted" />
        <p>No activities added to your itinerary yet.</p>
        <span className="app-tagline">Ask Aero to schedule sightseeing, restaurants, or events.</span>
      </div>
    );
  }

  return (
    <div className="itinerary-card glass-panel glass-card">
      <h3 className="widget-title">
        <Sparkles size={16} className="weather-icon-lg" />
        Itinerary Timeline
      </h3>
      <div className="timeline-list">
        {trip.activities.map((act, index) => (
          <div key={index} className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <div className="timeline-time">{act.time || 'Day ' + (index + 1)}</div>
              <div className="timeline-text">{act.title}</div>
              {act.description && <div className="timeline-desc">{act.description}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// LIMITED TIME EVENTS WIDGET
export const EventsWidget = ({ trip }) => {
  if (!trip.destination) return null;

  // Mock events based on destination
  const getEvent = (name) => {
    const dest = name.toLowerCase();
    if (dest.includes('tokyo')) {
      return {
        title: 'Meguro River Sakura Festival 🌸',
        desc: 'Cherry blossoms are in peak bloom this month! Expect heavy crowds near Meguro River. Evening light-ups run from 6 PM to 9 PM. We added special blossom walks to your checklist.'
      };
    }
    if (dest.includes('paris')) {
      return {
        title: 'Louvre Night Openings 🎨',
        desc: 'The Louvre is hosting night view tours on Fridays until 9:45 PM. Booking slots are extremely limited; tickets must be purchased online at least 2 weeks in advance.'
      };
    }
    if (dest.includes('austin')) {
      return {
        title: 'South by Southwest (SXSW) Music Fest 🎸',
        desc: 'SXSW takes place in Austin during this window. Major downtown street closures are active. Hotel prices are inflated. We recommend booking local shuttle passes.'
      };
    }
    if (dest.includes('chicago')) {
      return {
        title: 'Millennium Park Summer Concert Series 🎵',
        desc: 'Free open-air orchestral performances are hosted on the lawn. Gates open at 5 PM. Bring a picnic blanket. No glass bottles allowed in the venue.'
      };
    }
    return null;
  };

  const event = getEvent(trip.destination);

  if (!event) return null;

  return (
    <div className="event-alert-card">
      <div className="event-icon-container">
        <AlertTriangle size={20} />
      </div>
      <div className="event-details">
        <h4>Limited Event: {event.title}</h4>
        <p>{event.desc}</p>
      </div>
    </div>
  );
};

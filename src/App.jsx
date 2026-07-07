import React, { useState } from 'react';
import ChatPanel from './components/ChatPanel';
import ChecklistWidget from './components/ChecklistWidget';
import { DestinationWidget, WeatherWidget, ItineraryWidget, EventsWidget } from './components/Widgets';
import { Compass, CheckSquare } from 'lucide-react';

const INITIAL_CHECKLIST = {
  destination: { title: 'Destination Selected', description: 'Choose your vacation destination.', completed: false, required: true, type: 'all' },
  dates: { title: 'Timeline & Dates Set', description: 'Define trip dates and duration.', completed: false, required: true, type: 'all' },
  stay: { title: 'Accommodation Booked', description: 'Reserve hotel, hostel, or rental room.', completed: false, required: true, type: 'all' },
  activities: { title: 'Activities Planned', description: 'Schedule top points of interest.', completed: false, required: false, type: 'all' },
  
  // International only
  passport: { title: 'Passport Validity (6+ Mos)', description: 'Ensure passport has remaining validity.', completed: false, required: true, type: 'international' },
  visa: { title: 'Visa Requirements Checked', description: 'Check tourist entry visas and forms.', completed: false, required: true, type: 'international' },
  flights: { title: 'International Flight Booked', description: 'Book flights and log airline/bag details.', completed: false, required: true, type: 'international' },
  insurance: { title: 'Travel Medical Insurance', description: 'Get overseas medical coverage.', completed: false, required: false, type: 'international' },
  currency: { title: 'Currency & Cards Ready', description: 'Order local currency and unlock cards.', completed: false, required: true, type: 'international' },
  esim: { title: 'International eSIM/Data', description: 'Set up global cellular data.', completed: false, required: false, type: 'international' },
  
  // Domestic only
  route: { title: 'Driving Route Configured', description: 'Inspect car, map fuel spots, gas budget.', completed: false, required: true, type: 'domestic' },
  parking: { title: 'Local Parking Spots Booked', description: 'Pre-book parking at venues/hotels.', completed: false, required: false, type: 'domestic' },
  weatherPrep: { title: 'Road Weather Gear Packing', description: 'Check regional forecasts and packing list.', completed: false, required: true, type: 'domestic' },
};

function App() {
  const [messages, setMessages] = useState([
    {
      sender: 'agent',
      text: "Hello! I'm Aero, your AI Travel Concierge. ✈️\n\nI'm here to help you plan your next trip perfectly. Tell me where you want to go, and I'll build a neat checklist, check the weather, fetch packing suggestions, and highlight local events.\n\nWhether it's international travel or a nearby domestic road trip, let's get started! Try typing one of the quick suggestions below.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [trip, setTrip] = useState({
    destination: '',
    type: 'international', // default
    dates: '',
    transit: '',
    lodging: '',
    activities: [],
  });
  const [checklist, setChecklist] = useState(INITIAL_CHECKLIST);

  // Manual toggle of checklist items
  const handleToggleChecklistItem = (key) => {
    setChecklist((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        completed: !prev[key].completed,
      },
    }));
  };

  // Helper to switch trip types (International / Domestic)
  const handleToggleTripType = (type) => {
    setTrip((prev) => ({ ...prev, type }));
    // Reset completed checklists of irrelevant types to ensure progress behaves correctly
    setChecklist((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((key) => {
        if (updated[key].type !== 'all' && updated[key].type !== type) {
          updated[key].completed = false;
        }
      });
      return updated;
    });
  };

  // Calculate Progress Percent
  const getProgressPercentage = () => {
    const activeItems = Object.values(checklist).filter(
      (item) => item.type === 'all' || item.type === trip.type
    );
    const completedItems = activeItems.filter((item) => item.completed);
    if (activeItems.length === 0) return 0;
    return Math.round((completedItems.length / activeItems.length) * 100);
  };

  // Activity Recommendations Helper
  const getActivityRecommendations = (activity) => {
    const act = activity.toLowerCase();
    
    if (act.includes('anime') || act.includes('convention') || act.includes('comic') || act.includes('manga') || act.includes('cosplay') || act.includes('con ')) {
      return {
        category: 'Anime & Pop Culture Conventions 🌸',
        options: [
          {
            name: 'Los Angeles, California (Anime Expo)',
            type: 'domestic',
            why: 'Held annually in July at the LA Convention Center, Anime Expo (AX) is the largest anime convention in North America. It offers massive exhibit halls, premier anime screenings, world-class concerts, and a legendary cosplay community!'
          },
          {
            name: 'Tokyo, Japan (Comiket)',
            type: 'international',
            why: 'Comiket (Comic Market) is the ultimate geek pilgrimage. Held at Tokyo Big Sight, it is the world\'s largest fan-made manga and doujinshi fair. It is surrounded by Tokyo\'s Akihabara electronic town, full of gaming and anime history!'
          },
          {
            name: 'San Diego, California (Comic-Con International)',
            type: 'domestic',
            why: 'The granddaddy of pop-culture conventions. In July, SDCC hosts massive Hollywood panels, star signings, comic book legends, and exclusive merchandise, taking over the entire downtown area.'
          }
        ]
      };
    }
    
    if (act.includes('hike') || act.includes('hiking') || act.includes('nature') || act.includes('climb') || act.includes('outdoor') || act.includes('national park')) {
      return {
        category: 'Hiking & Natural Wonders ⛰️',
        options: [
          {
            name: 'Banff, Canada (Banff National Park)',
            type: 'international',
            why: 'Pristine turquoise glacial waters (like Lake Louise), massive Rocky Mountain peaks, and hundreds of miles of alpine trails. Very relaxing and scenic for family outdoor adventures!'
          },
          {
            name: 'Austin, Texas (Barton Creek Greenbelt)',
            type: 'domestic',
            why: 'Perfect for an easy, budget-friendly hiking getaway. It features limestone cliffs, swimming holes (Twin Falls), and shady trails running right through the heart of the city.'
          },
          {
            name: 'Yosemite, California (Yosemite Valley)',
            type: 'domestic',
            why: 'Home to spectacular giant sequoias, towering granite cliffs like Half Dome and El Capitan, and thunderous waterfalls. Ideal for all hiking levels, from paved walks to back-country climbs.'
          }
        ]
      };
    }

    if (act.includes('beach') || act.includes('surf') || act.includes('swim') || act.includes('ocean')) {
      return {
        category: 'Beaches, Surfing & Coastal Relaxation 🏖️',
        options: [
          {
            name: 'Oahu, Hawaii (Waikiki & North Shore)',
            type: 'domestic',
            why: 'Warm tropical waters, beginner-friendly gentle surf in Waikiki, and legendary massive waves on the North Shore. Ideal for a relaxing family beach vacation.'
          },
          {
            name: 'Nice, France (French Riviera)',
            type: 'international',
            why: 'Stunning pebble beaches along the deep azure Mediterranean Sea. You can walk the famous Promenade des Anglais and enjoy seafood along the coastal bistros.'
          }
        ]
      };
    }

    if (act.includes('ski') || act.includes('snow') || act.includes('winter') || act.includes('board')) {
      return {
        category: 'Winter Sports & Snowboarding ❄️',
        options: [
          {
            name: 'Niseko, Japan (Powder Snow Paradise)',
            type: 'international',
            why: 'Known worldwide for the light, fluffy powder snow. It offers fantastic ski resorts, night skiing, and relaxing thermal hot springs (onsens) after a long day on the slopes.'
          },
          {
            name: 'Aspen, Colorado (Mountain Chalets)',
            type: 'domestic',
            why: 'Four premier ski mountains in one valley, featuring luxury ski resorts, gorgeous family-friendly village centers, and high-altitude hiking/snow activities.'
          }
        ]
      };
    }

    // Fallback for custom activity
    const cleanActivity = activity.replace(/i want to/g, '').replace(/go to a/g, '').replace(/go to/g, '').replace(/plan a/g, '').replace(/find/g, '').replace(/search/g, '').replace(/for/g, '').trim();
    const capitalizedActivity = cleanActivity.charAt(0).toUpperCase() + cleanActivity.slice(1);
    
    return {
      category: `${capitalizedActivity} Getaways 🔍`,
      options: [
        {
          name: 'Austin, Texas',
          type: 'domestic',
          why: `Austin is a highly relaxing domestic destination with excellent facilities and parks for ${cleanActivity}. Being a major cultural hub, you can easily combine this with local live music and world-class barbecue inexpensively!`
        },
        {
          name: 'Tokyo, Japan',
          type: 'international',
          why: `If you are looking for an international adventure, Tokyo offers state-of-the-art facilities and unique cultural spins on ${cleanActivity}, and the city is incredibly clean, safe, and easy to navigate for solo travelers or families.`
        },
        {
          name: 'Paris, France',
          type: 'international',
          why: `Paris offers a classic European backdrop for ${cleanActivity}. You can plan this trip to explore historic avenues and enjoy budget-friendly bakery picnics near the Seine river after your activity!`
        }
      ]
    };
  };

  // NLP Chat Parsing Engine
  const parseUserMessage = (userText) => {
    const text = userText.toLowerCase();
    let updatedTrip = { ...trip };
    let checklistUpdates = {};
    let isRecommendationRequest = false;
    let isActivityQuery = false;
    let activityFound = '';

    // Check if the user is asking for open-ended getaways/ideas/suggestions
    if (
      text.includes('recommend') ||
      text.includes('options') ||
      text.includes('getaway') ||
      text.includes('relax') ||
      text.includes('cheap') ||
      text.includes('inexpensive') ||
      text.includes('family') ||
      text.includes('ideas') ||
      text.includes('suggest') ||
      text.includes('where to go') ||
      text.includes('where should')
    ) {
      isRecommendationRequest = true;
    }

    // Check for activity matching
    const activityKeywords = ['anime', 'convention', 'comic', 'con ', 'hike', 'hiking', 'nature', 'climb', 'beach', 'surf', 'surfing', 'swim', 'ski', 'snow', 'winter', 'board', 'museum', 'art', 'food', 'eat'];
    const hasActivityKeyword = activityKeywords.some(kw => text.includes(kw));

    if (hasActivityKeyword) {
      isActivityQuery = true;
      if (text.includes('anime') || text.includes('convention') || text.includes('comic') || text.includes('con ')) {
        activityFound = 'anime convention';
      } else if (text.includes('hike') || text.includes('hiking') || text.includes('climb') || text.includes('nature')) {
        activityFound = 'hiking';
      } else if (text.includes('beach') || text.includes('surf') || text.includes('surfing')) {
        activityFound = 'surfing';
      } else if (text.includes('ski') || text.includes('snowboard')) {
        activityFound = 'skiing';
      } else {
        activityFound = 'sightseeing & culture';
      }
    } else {
      // Look for sentence structures like "want to do [X]", "go to [X]", "plan [X]"
      const matchGoTo = text.match(/want to go to (a|an|the)?\s*([^.?!,]+)/);
      const matchWantTo = text.match(/want to\s*([^.?!,]+)/);
      const matchPlanA = text.match(/plan (a|an)?\s*([^.?!,]+)/);
      
      if (matchGoTo && matchGoTo[2]) {
        activityFound = matchGoTo[2].trim();
        isActivityQuery = true;
      } else if (matchPlanA && matchPlanA[2]) {
        activityFound = matchPlanA[2].trim();
        isActivityQuery = true;
      } else if (matchWantTo && matchWantTo[1] && !matchWantTo[1].includes('plan') && !matchWantTo[1].includes('go')) {
        activityFound = matchWantTo[1].trim();
        isActivityQuery = true;
      }
    }

    // 1. Destination Extraction
    let destFound = '';
    let tripType = trip.type;
    
    if (text.includes('tokyo') || text.includes('japan')) {
      destFound = 'Tokyo, Japan';
      tripType = 'international';
    } else if (text.includes('paris') || text.includes('france')) {
      destFound = 'Paris, France';
      tripType = 'international';
    } else if (text.includes('austin') || text.includes('texas')) {
      destFound = 'Austin, Texas';
      tripType = 'domestic';
    } else if (text.includes('chicago') || text.includes('illinois')) {
      destFound = 'Chicago, Illinois';
      tripType = 'domestic';
    }

    if (destFound) {
      updatedTrip.destination = destFound;
      updatedTrip.type = tripType;
      checklistUpdates.destination = true;
    }

    // 2. Dates Extraction
    if (text.includes('next month') || text.includes('july')) {
      updatedTrip.dates = 'July 15 - July 22, 2026';
      checklistUpdates.dates = true;
    } else if (text.includes('next weekend') || text.includes('weekend')) {
      updatedTrip.dates = 'Upcoming Friday - Sunday';
      checklistUpdates.dates = true;
    } else if (text.includes('week') || text.includes('7 days')) {
      updatedTrip.dates = 'August 10 - August 17, 2026';
      checklistUpdates.dates = true;
    }

    // 3. Transit Extraction
    if (text.includes('flight') || text.includes('fly') || text.includes('flying')) {
      updatedTrip.transit = tripType === 'international' ? 'Flight JL005 Booked' : 'Flight AA2405 Booked';
      if (tripType === 'international') {
        checklistUpdates.flights = true;
      }
    } else if (text.includes('drive') || text.includes('road trip') || text.includes('driving')) {
      updatedTrip.transit = 'Scenic Highway Route';
      updatedTrip.type = 'domestic';
      tripType = 'domestic';
      checklistUpdates.route = true;
    }

    // 4. Lodging Extraction
    if (text.includes('hotel') || text.includes('stay at') || text.includes('staying at') || text.includes('hyatt') || text.includes('hilton')) {
      if (destFound.includes('Tokyo')) {
        updatedTrip.lodging = 'Park Hyatt Tokyo';
      } else if (destFound.includes('Paris')) {
        updatedTrip.lodging = 'Hotel Regina Louvre';
      } else if (destFound.includes('Austin')) {
        updatedTrip.lodging = 'South Congress Hotel';
      } else {
        updatedTrip.lodging = 'Downtown Boutique Hotel';
      }
      checklistUpdates.stay = true;
    } else if (text.includes('airbnb') || text.includes('cabin') || text.includes('hostel')) {
      updatedTrip.lodging = tripType === 'international' ? 'Cozy Apartment Rental' : 'Mountain Cabin Hideaway';
      checklistUpdates.stay = true;
    }

    // 5. Activities Extraction
    let newActivities = [...updatedTrip.activities];
    if (text.includes('museum') || text.includes('sightseeing') || text.includes('art')) {
      newActivities.push({
        title: tripType === 'international' ? 'Mori Art Museum' : 'Blanton Museum of Art',
        time: 'Day 1 Afternoon',
        description: 'Explore contemporary exhibits and local collections.',
      });
      checklistUpdates.activities = true;
    }
    if (text.includes('sushi') || text.includes('eat') || text.includes('bbq') || text.includes('music') || text.includes('food') || text.includes('convention')) {
      if (destFound.includes('Tokyo')) {
        newActivities.push({
          title: text.includes('convention') ? 'Attend Comiket Expo' : 'Sushi Omakase Dinner',
          time: 'Day 2 Evening',
          description: text.includes('convention') ? 'Bustling manga exhibition in Big Sight.' : 'Authentic 12-course dining in Ginza.',
        });
      } else if (destFound.includes('Austin')) {
        newActivities.push({
          title: 'Franklin BBQ & Live Music',
          time: 'Day 2 Afternoon',
          description: 'Iconic Texas brisket and acoustic songwriters.',
        });
      } else {
        newActivities.push({
          title: 'Local Activity Event',
          time: 'Day 2 Afternoon',
          description: 'Participating in custom event scheduling.',
        });
      }
      checklistUpdates.activities = true;
    }
    updatedTrip.activities = newActivities;

    // 6. Extras / Document Prep
    if (text.includes('passport')) {
      checklistUpdates.passport = true;
    }
    if (text.includes('visa')) {
      checklistUpdates.visa = true;
    }
    if (text.includes('insurance')) {
      checklistUpdates.insurance = true;
    }
    if (text.includes('currency') || text.includes('cash') || text.includes('card')) {
      checklistUpdates.currency = true;
    }
    if (text.includes('esim') || text.includes('data')) {
      checklistUpdates.esim = true;
    }
    if (text.includes('parking') || text.includes('park')) {
      checklistUpdates.parking = true;
    }
    if (text.includes('weather') || text.includes('forecast') || text.includes('gear')) {
      checklistUpdates.weatherPrep = true;
    }

    return { updatedTrip, checklistUpdates, isRecommendationRequest, isActivityQuery, activityFound };
  };

  // Generate Concierge AI responses based on what was parsed
  const generateAgentResponse = (userText, parsed) => {
    const { updatedTrip, checklistUpdates, isRecommendationRequest, isActivityQuery, activityFound } = parsed;
    const text = userText.toLowerCase();
    let reply = '';

    // If it's an activity-based search query and no destination is set yet
    if (isActivityQuery && !checklistUpdates.destination) {
      const recs = getActivityRecommendations(activityFound);
      const optionsText = recs.options.map((opt, idx) => {
        const icon = opt.type === 'international' ? '✈️' : '🚗';
        const typeText = opt.type === 'international' ? 'International' : 'Domestic / Nearby';
        return `${idx + 1}. **${opt.name}** (${icon} ${typeText})\n   • *Why it's a good idea:* ${opt.why}`;
      }).join('\n\n');

      return `🔍 I ran a search for **${recs.category}**! Here are a few outstanding destinations where this activity is popular:

${optionsText}

Which of these matches the location you want to plan for? Tell me **"Let's do ${recs.options[0].name.split(' (')[0]}"** or **"Plan a trip to Tokyo"**, and I will set up your checklist board and local weather widgets!`;
    }

    // If it's an open-ended getaway suggestion query and they haven't set a destination yet
    if (isRecommendationRequest && !checklistUpdates.destination) {
      return `It sounds like you're looking for a relaxing, budget-friendly family getaway! Here are three wonderful options I highly recommend:

1. 🤠 **Austin, Texas (Nearby Road Trip)**
   • *Why it's a great idea:* Austin has a fantastic laid-back vibe and is perfect for a road trip (no expensive flights!). You can relax at beautiful outdoor parks like Zilker Park, take a dip in Barton Springs Pool, and enjoy delicious barbecue while listening to free live music. Very family-friendly and wallet-friendly!

2. 🍕 **Chicago, Illinois (Lakeside City Getaway)**
   • *Why it's a great idea:* Chicago is easily accessible and offers plenty of inexpensive family fun. You can hang out at the free Millennium Park (to see Cloud Gate / "The Bean"), visit world-class museums, walk along the Lake Michigan shores, and share deep-dish pizza which is cost-effective for families.

3. 🇯🇵 **Tokyo, Japan (International Family Adventure)**
   • *Why it's a great idea:* If you are willing to look internationally, Tokyo is the ultimate clean, safe, and exciting family destination. While the plane tickets are a bigger budget item, once you arrive, local food (ramen, sushi stalls), clean parks, and high-tech subways are surprisingly cheap! Kids love the theme cafes and sights.

Which of these sounds most exciting to you? Just tell me **"Let's do Austin"**, **"Plan a trip to Chicago"**, or **"I want to go to Tokyo"**, and I will set up your checklist board and weather cards instantly!`;
    }

    const updatesCount = Object.keys(checklistUpdates).length;

    if (updatesCount === 0) {
      reply = "I've heard you! I couldn't match specific travel terms (like destinations, hotels, flights, or dates) from that message. \n\nFeel free to say things like: 'I want to fly to Paris next month', 'Staying at an Airbnb', or 'I need to check passport validity'.";
      return reply;
    }

    if (checklistUpdates.destination) {
      const typeLabel = updatedTrip.type === 'international' ? 'International' : 'Domestic / Nearby';
      reply += `Wonderful! I've set your destination to **${updatedTrip.destination}** and categorized it as a **${typeLabel}** journey. 🗺️\n\n`;
      
      // Customize description based on specific choice
      if (updatedTrip.destination.includes('Tokyo')) {
        reply += `🗼 *Tokyo is an incredibly safe and exciting choice for families!* To keep things budget-friendly, you can take advantage of cheap and delicious local food (like conveyor-belt sushi and ramen stalls), use public transit passes, and visit free temples and shrines.\n\n`;
      } else if (updatedTrip.destination.includes('Austin')) {
        reply += `🤠 *Austin is the perfect domestic road trip choice!* It is highly relaxing and saves you money on plane tickets. You can spend sunny afternoons in Barton Springs, try food trucks, and catch free outdoor concerts.\n\n`;
      } else if (updatedTrip.destination.includes('Chicago')) {
        reply += `🍕 *Chicago is a classic family city getaway!* You can drive in, buy multi-museum passes to save, stroll free parks, and eat legendary deep-dish pizza.\n\n`;
      } else if (updatedTrip.destination.includes('Paris')) {
        reply += `🗼 *Paris is a beautiful international getaway!* To make it inexpensive, you can buy bakery picnic lunches to eat by the Eiffel Tower gardens and explore the city's historic streets on foot.\n\n`;
      }
      
      reply += `Notice how your checklist has adapted! Since this is ${updatedTrip.type === 'international' ? 'an international flight' : 'a nearby road trip'}, we'll focus on ${updatedTrip.type === 'international' ? 'passports, visas, and exchange rates' : 'road route safety, parking, and weather gear'}.\n\n`;
    }

    if (checklistUpdates.dates) {
      reply += `📅 Dates configured: **${updatedTrip.dates}**.\n`;
    }

    if (checklistUpdates.stay) {
      reply += `🏨 Lodging logged: **${updatedTrip.lodging}**.\n`;
    }

    if (checklistUpdates.flights || checklistUpdates.route) {
      reply += `🚗 Transit details updated: **${updatedTrip.transit}**.\n`;
    }

    if (checklistUpdates.activities) {
      reply += `✨ Added new sightseeing activities to your Itinerary.\n`;
    }

    // Acknowledge documents/checklists directly
    const docKeys = ['passport', 'visa', 'insurance', 'currency', 'esim', 'parking', 'weatherPrep'];
    const matchedDocs = docKeys.filter(k => checklistUpdates[k]);
    if (matchedDocs.length > 0) {
      reply += `✅ Checklist items verified: ${matchedDocs.map(k => INITIAL_CHECKLIST[k].title).join(', ')}.\n`;
    }

    reply += `\nWhat would you like to plan next? We can add more activities, register accommodation, or double check travel items.`;
    return reply;
  };

  // Main input handler
  const handleSendMessage = (userText) => {
    // Add user message
    const userMsg = {
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate Agent processing delay
    setTimeout(() => {
      const parsed = parseUserMessage(userText);
      
      // Apply updates to state
      setTrip(parsed.updatedTrip);
      setChecklist((prev) => {
        const next = { ...prev };
        Object.keys(parsed.checklistUpdates).forEach((key) => {
          // If destination changed, we might have switched trip types. 
          // Reset other checklist fields that don't belong to the new type
          if (key === 'destination') {
            const nextType = parsed.updatedTrip.type;
            Object.keys(next).forEach((itemKey) => {
              if (next[itemKey].type !== 'all' && next[itemKey].type !== nextType) {
                next[itemKey].completed = false;
              }
            });
          }
          next[key].completed = parsed.checklistUpdates[key];
        });
        return next;
      });

      const agentReply = generateAgentResponse(userText, parsed);
      const agentMsg = {
        sender: 'agent',
        text: agentReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, agentMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="app-title-group">
          <div className="agent-avatar" style={{ width: '32px', height: '32px' }}>
            <Compass size={18} color="#080c14" strokeWidth={2.5} />
          </div>
          <div>
            <h1>Wanderer</h1>
            <p className="app-tagline">AI Trip Planner & Travel Checklist</p>
          </div>
        </div>
        <div className="trip-type-toggle">
          <button
            className={`toggle-btn ${trip.type === 'domestic' ? 'active' : ''}`}
            onClick={() => handleToggleTripType('domestic')}
          >
            Nearby / Domestic
          </button>
          <button
            className={`toggle-btn ${trip.type === 'international' ? 'active' : ''}`}
            onClick={() => handleToggleTripType('international')}
          >
            International
          </button>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="main-layout">
        {/* Left Side: Conversational Chatbot */}
        <ChatPanel 
          messages={messages} 
          onSendMessage={handleSendMessage} 
          isTyping={isTyping} 
        />

        {/* Right Side: Dashboard & Checklists */}
        <div className="board-container">
          {/* Progress Tracker */}
          <div className="progress-section glass-panel" style={{ borderRadius: '16px 16px 0 0', borderBottom: 'none' }}>
            <div className="progress-header">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckSquare size={16} color="#00f2fe" />
                Planning Progress
              </span>
              <span style={{ color: '#00f2fe', fontWeight: 'bold' }}>{getProgressPercentage()}% Complete</span>
            </div>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>

          {/* Dashboard Columns */}
          <div className="board-grid glass-panel" style={{ borderRadius: '0 0 16px 16px', borderTop: 'none' }}>
            {/* Column 1: Checklist widget */}
            <ChecklistWidget
              checklist={checklist}
              tripType={trip.type}
              onToggleItem={handleToggleChecklistItem}
            />

            {/* Column 2: Visual widgets (weather, itinerary, destination) */}
            <div className="widgets-column">
              <DestinationWidget trip={trip} />
              
              <EventsWidget trip={trip} />
              
              <WeatherWidget trip={trip} />
              
              <ItineraryWidget trip={trip} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

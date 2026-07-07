import React from 'react';
import { Check, ClipboardList } from 'lucide-react';

const ChecklistWidget = ({ checklist, tripType, onToggleItem }) => {
  // Filter and sort items to display: Required items first, then Optional
  const items = Object.entries(checklist)
    .filter(([_, item]) => item.type === 'all' || item.type === tripType)
    .map(([key, item]) => ({ key, ...item }));

  const sortedItems = [
    ...items.filter(item => item.required),
    ...items.filter(item => !item.required)
  ];

  return (
    <div className="checklist-widget glass-panel" style={{ padding: '20px' }}>
      <h3 className="widget-title">
        <ClipboardList size={18} className="weather-icon-lg" />
        Trip Checklist ({tripType === 'international' ? 'International' : 'Domestic / Nearby'})
      </h3>
      <div className="checklist-container">
        {sortedItems.map((item) => (
          <div
            key={item.key}
            className={`checklist-item ${item.completed ? 'completed' : ''}`}
            onClick={() => onToggleItem(item.key)}
          >
            <div className="check-container">
              {item.completed && <Check size={12} strokeWidth={3} />}
            </div>
            <div className="item-content">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="item-title">{item.title}</span>
                <span className={`item-badge ${item.required ? 'required' : ''}`}>
                  {item.required ? 'Required' : 'Optional'}
                </span>
              </div>
              <p className="item-description">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChecklistWidget;

import React from 'react';
import { useNavigate } from 'react-router-dom';

// Define the Accommodation interface based on the backend model
interface Accommodation {
  _id: string;
  name: string;
  description: string;
  type: 'PG' | 'Hostel' | 'Flat' | 'Other';
  address: {
    street: string;
    area: string;
    city: string;
    pincode: string;
  };
  rent: number;
  averageRating?: number;
  reviews: Array<any>;
  images: string[];
  amenities: string[];
  food: {
    available: boolean;
    vegOnly: boolean;
    mealTypes: string[];
  };
  nearestCollege: string[];
  distanceFromCollege: number;
  availableFor: 'Boys' | 'Girls' | 'Both';
}

// Constants for fixed dimensions
const CARD_HEIGHT = 400;
const IMAGE_HEIGHT = Math.floor(CARD_HEIGHT * 0.5625);
const CONTENT_HEIGHT = CARD_HEIGHT - IMAGE_HEIGHT;

// SVG fallback image encoded as data URI
const FALLBACK_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"%3E%3Crect width="600" height="400" fill="%23e2e8f0"%3E%3C/rect%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, sans-serif" font-size="24" fill="%2364748b"%3EImage Unavailable%3C/text%3E%3C/svg%3E';

// Component to render a static hostel card - memoized to prevent unnecessary re-renders
const StaticHostelCard = React.memo<{ accommodation: Accommodation }>(({ accommodation }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/accommodations/${accommodation._id}`);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        height: `${CARD_HEIGHT}px`,
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        border: '1px solid #e5e7eb',
        cursor: 'pointer',
        position: 'relative',
        display: 'block',
      }}
    >
      {/* Image area with fixed height */}
      <div
        style={{
          height: `${IMAGE_HEIGHT}px`,
          backgroundColor: '#f3f4f6',
          backgroundImage: `url(${FALLBACK_IMAGE})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        {/* Price tag */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '9999px',
            padding: '6px 12px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            zIndex: 10,
          }}
        >
          <span style={{ fontSize: '14px' }}>₹</span>
          <span style={{ fontSize: '16px', fontWeight: 600 }}>{accommodation.rent.toLocaleString()}</span>
          <span style={{ fontSize: '12px', color: '#6b7280' }}>/mo</span>
        </div>
      </div>

      {/* Content area with fixed height */}
      <div
        style={{
          height: `${CONTENT_HEIGHT}px`,
          padding: '16px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Title */}
        <h3
          style={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#1f2937',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            marginBottom: '4px',
          }}
        >
          {accommodation.name}
        </h3>

        {/* Address */}
        <p
          style={{
            fontSize: '14px',
            color: '#6b7280',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            marginBottom: '16px',
          }}
        >
          {accommodation.address.area}, {accommodation.address.city}
        </p>

        {/* Divider */}
        <div
          style={{
            borderTop: '1px solid #f3f4f6',
            marginBottom: '16px',
          }}
        ></div>

        {/* Features */}
        <div
          style={{
            fontSize: '12px',
            color: '#6b7280',
          }}
        >
          <div style={{ marginBottom: '8px' }}>🏫 {accommodation.distanceFromCollege}km to {accommodation.nearestCollege[0]}</div>
          <div style={{ marginBottom: '8px' }}>
            {accommodation.food.vegOnly ? '🥗 Veg Only' : '🍽️ Veg & Non-veg'}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {accommodation.amenities.slice(0, 3).map((amenity, index) => (
              <span
                key={index}
                style={{
                  backgroundColor: '#f9fafb',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '12px',
                }}
              >
                {amenity}
              </span>
            ))}
            {accommodation.amenities.length > 3 && (
              <span
                style={{
                  backgroundColor: '#f9fafb',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '12px',
                }}
              >
                +{accommodation.amenities.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

// Loading placeholder card - memoized to prevent unnecessary re-renders
const LoadingCard = React.memo(() => {
  return (
    <div
      style={{
        height: `${CARD_HEIGHT}px`,
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        border: '1px solid #e5e7eb',
        position: 'relative',
        display: 'block',
      }}
    >
      <div
        style={{
          height: `${IMAGE_HEIGHT}px`,
          backgroundColor: '#e5e7eb',
        }}
      ></div>
      <div
        style={{
          height: `${CONTENT_HEIGHT}px`,
          padding: '16px',
        }}
      >
        <div
          style={{
            height: '24px',
            width: '75%',
            backgroundColor: '#e5e7eb',
            marginBottom: '8px',
            borderRadius: '6px',
          }}
        ></div>
        <div
          style={{
            height: '16px',
            width: '50%',
            backgroundColor: '#e5e7eb',
            marginBottom: '16px',
            borderRadius: '6px',
          }}
        ></div>
        <div
          style={{
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '1px solid #f3f4f6',
          }}
        >
          <div
            style={{
              height: '16px',
              width: '100%',
              backgroundColor: '#e5e7eb',
              marginBottom: '8px',
              borderRadius: '6px',
            }}
          ></div>
          <div
            style={{
              height: '16px',
              width: '66%',
              backgroundColor: '#e5e7eb',
              marginBottom: '16px',
              borderRadius: '6px',
            }}
          ></div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div
              style={{
                height: '24px',
                width: '80px',
                backgroundColor: '#e5e7eb',
                borderRadius: '6px',
              }}
            ></div>
            <div
              style={{
                height: '24px',
                width: '80px',
                backgroundColor: '#e5e7eb',
                borderRadius: '6px',
              }}
            ></div>
            <div
              style={{
                height: '24px',
                width: '80px',
                backgroundColor: '#e5e7eb',
                borderRadius: '6px',
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
});

// Main component that renders the grid - memoized to prevent unnecessary re-renders
const StaticHostelGrid = React.memo<{
  accommodations: Accommodation[];
  loading: boolean;
}>(({ accommodations, loading }) => {
  if (loading) {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(1, 1fr)',
          gap: '24px',
          width: '100%',
          paddingBottom: '32px',
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <LoadingCard key={index} />
        ))}
      </div>
    );
  }

  if (accommodations.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '48px 24px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#f3f4f6',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
          }}
        >
          <span style={{ fontSize: '24px' }}>🔍</span>
        </div>
        <h3 style={{ fontSize: '18px', fontWeight: 500, color: '#1f2937', marginBottom: '8px' }}>
          No accommodations found
        </h3>
        <p style={{ color: '#6b7280', maxWidth: '400px', margin: '0 auto 16px auto' }}>
          We couldn't find any accommodations matching your criteria. Try adjusting your filters or search query.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(1, 1fr)',
        gap: '24px',
        width: '100%',
        paddingBottom: '32px',
      }}
    >
      {accommodations.map((accommodation) => (
        <StaticHostelCard key={accommodation._id} accommodation={accommodation} />
      ))}
    </div>
  );
});

export default StaticHostelGrid;

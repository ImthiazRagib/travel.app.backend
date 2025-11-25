const airlines = [
  {
    "id": "b973c228-7b91-433d-8190-2208bc213f12",
    "name": "Emirates Airlines",
    "code": "EK",
    "country": "United Arab Emirates",       // optional
    "logo": "https://cdn.airlines/ek.png",   // optional
    "isVerified": true,                      // optional
    "userId": "2d56e93d-8098-4eb2-98ac-fa613b1a48a6"
  },
  {
    "id": "16a4672a-e99b-44a8-8ce1-ddebc7c38ad3",
    "name": "Qatar Airways",
    "code": "QR",
    "country": "Qatar",                      // optional
    "logo": "https://cdn.airlines/qr.png",   // optional
    "isVerified": false,                     // optional
    "userId": "2d56e93d-8098-4eb2-98ac-fa613b1a48a6"
  },
  {
    "id": "af4ac5f3-4099-4619-adf2-964f3ef16a71",
    "name": "Singapore Airlines",
    "code": "SQ",
    "country": "Singapore",                  // optional
    "logo": null,                             // optional
    "isVerified": true,                       // optional
    "userId": "2d56e93d-8098-4eb2-98ac-fa613b1a48a6"
  }
]


const flights = [
  {
    "flightNumber": "EK301",
    "from": "DXB",
    "to": "JFK",
    "departureTime": "2025-03-02T14:00:00Z",
    "arrivalTime": "2025-03-02T23:10:00Z",
    "stops": "1-stop",
    "price": 1200,
    "seatCapacity": 350,
    "availableSeats": 350 // Optional condition: must never be greater than seatCapacity
  },
  {
    "flightNumber": "EK421",
    "from": "DXB",
    "to": "DOH",
    "departureTime": "2025-03-05T09:30:00Z",
    "arrivalTime": "2025-03-05T10:50:00Z",
    "stops": "nonstop",
    "price": 350,
    "seatCapacity": 180,
    "availableSeats": 180
  },
  {
    "flightNumber": "EK900",
    "from": "DXB",
    "to": "LAX",
    "departureTime": "2025-03-10T01:20:00Z",
    "arrivalTime": "2025-03-10T13:00:00Z",
    "stops": "multiple",
    "price": 1750,
    "seatCapacity": 400,
    "availableSeats": 390 // Optional: you may leave calculated later
  }
]

const rooms = [
  {
    "slug": "deluxe-king-sea-view",
    "hotelId": "ab52bfe6-17e2-46fb-ad40-0245f21f6c43",
    "roomType": "Deluxe",
    "bedType": "King",
    "capacity": 3,
    "pricePerNight": 450.75,
    "amenities": {
      "wifi": true,
      "airCondition": true,
      "tv": true,
      "minibar": true,
      "balcony": true,
      "seaView": true,
      "breakfastIncluded": true
    },
    "totalRooms": 10,
    "remainingRooms": 10,
    "isAvailable": true,
    "roomSize": "45 sqm",
    "gallery": [
      "https://example.com/rooms/deluxe-king-sea1.jpg",
      "https://example.com/rooms/deluxe-king-sea2.jpg"
    ]
  },
  {
    "slug": "standard-twin-city-view",
    "hotelId": "ab52bfe6-17e2-46fb-ad40-0245f21f6c43",
    "roomType": "Standard",
    "bedType": "Twin",
    "capacity": 2,
    "pricePerNight": 180.5,
    "amenities": {
      "wifi": true,
      "airCondition": true,
      "tv": true,
      "cityView": true,
      "breakfastIncluded": false
    },
    "totalRooms": 20,
    "remainingRooms": 20,
    "isAvailable": true,
    "roomSize": "25 sqm",
    "gallery": [
      "https://example.com/rooms/standard-city1.jpg",
      "https://example.com/rooms/standard-city2.jpg"
    ]
  },
  {
    "slug": "executive-suite-premium",
    "hotelId": "ab52bfe6-17e2-46fb-ad40-0245f21f6c43",
    "roomType": "Suite",
    "bedType": "King",
    "capacity": 4,
    "pricePerNight": 870.99,
    "amenities": {
      "wifi": true,
      "airCondition": true,
      "tv": true,
      "jacuzzi": true,
      "kitchen": true,
      "livingRoom": true,
      "oceanView": true,
      "breakfastIncluded": true
    },
    "totalRooms": 5,
    "remainingRooms": 5,
    "isAvailable": true,
    "roomSize": "90 sqm",
    "gallery": [
      "https://example.com/rooms/suite-premium1.jpg",
      "https://example.com/rooms/suite-premium2.jpg"
    ]
  },
  {
    "slug": "family-room-quad",
    "hotelId": "ab52bfe6-17e2-46fb-ad40-0245f21f6c43",
    "roomType": "Family",
    "bedType": "Queen + Twin",
    "capacity": 4,
    "pricePerNight": 350.00,
    "amenities": {
      "wifi": true,
      "airCondition": true,
      "tv": true,
      "kidsPlayArea": true,
      "breakfastIncluded": true
    },
    "totalRooms": 12,
    "remainingRooms": 12,
    "isAvailable": true,
    "roomSize": "55 sqm",
    "gallery": [
      "https://example.com/rooms/family-quad1.jpg",
      "https://example.com/rooms/family-quad2.jpg"
    ]
  }
]


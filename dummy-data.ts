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

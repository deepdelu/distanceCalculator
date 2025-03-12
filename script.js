// Replace with your OpenCage API key
const openCageApiKey = '978c54a8b35a444fbfdaceb8a93adfa1';
// Replace with your OpenRouteService API key
const openRouteServiceApiKey = '5b3ce3597851110001cf62483b48bfff6ee14c9e9cb2e9dd9c42bdd7';

// Function to handle form submission and calculate distance
document.getElementById('distanceForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;

    if (!origin || !destination) {
        document.getElementById('result').textContent = 'Please enter valid origin and destination.';
        return;
    }

    // Step 1: Get geocoding coordinates for origin and destination
    getCoordinates(origin, destination);
});

// Function to get coordinates from OpenCage Geocoding API
async function getCoordinates(origin, destination) {
    const originResponse = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(origin)}&key=${openCageApiKey}`);
    const destinationResponse = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(destination)}&key=${openCageApiKey}`);
    
    const originData = await originResponse.json();
    const destinationData = await destinationResponse.json();
    
    if (originData.results.length === 0 || destinationData.results.length === 0) {
        document.getElementById('result').textContent = 'Could not find the locations.';
        return;
    }
    
    const originCoords = originData.results[0].geometry;
    const destinationCoords = destinationData.results[0].geometry;
    
    // Step 2: Calculate distance using OpenRouteService API
    calculateDistance(originCoords, destinationCoords);
}

// Function to calculate distance using OpenRouteService API
async function calculateDistance(originCoords, destinationCoords) {
    const url = 'https://api.openrouteservice.org/v2/directions/driving-car';
    const body = {
        coordinates: [
            [originCoords.lng, originCoords.lat],
            [destinationCoords.lng, destinationCoords.lat]
        ]
    };
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': openRouteServiceApiKey
        },
        body: JSON.stringify(body)
    });
    
    const data = await response.json();
    
    if (data.routes && data.routes.length > 0) {
        const distance = data.routes[0].segments[0].distance / 1000; // Convert meters to kilometers
        document.getElementById('result').textContent = `The Total distance is ${distance.toFixed(2)} km.`;
    } else {
        document.getElementById('result').textContent = 'Error calculating distance.';
    }
}

console.log("Auction script loaded successfully.");

// Ensure the script runs after DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM fully loaded, auction script initialized."); // Debug for DOMContentLoaded
  fetchHighestBid();

  // Attach event listener to the form for submitting bids
  const bidForm = document.getElementById('bid-form');
  if (bidForm) {
    bidForm.addEventListener('submit', (event) => {
      event.preventDefault();
      console.log('Bid form submitted.');

      const name = document.getElementById('bidder-name').value;
      const email = document.getElementById('bidder-email').value;
      const bid = document.getElementById('bid-amount').value;

      // Submit the bid
      submitBid(name, email, bid);
    });
  } else {
    console.error('Bid form not found in DOM.');
  }
});

// Function to fetch the current highest bid
function fetchHighestBid() {
  console.log("fetchHighestBid called"); // Add this line for debugging
  const url = 'https://YOUR_APPS_SCRIPT_URL?action=getHighestBid&callback=handleJsonp';
  jsonpRequest(url);
}

// Function to submit a new bid
function submitBid(name, email, bid) {
  const url = `https://script.google.com/macros/s/AKfycbwd2dM5UtXaXxPRluwTLvNtHh1LQhzNa1zN02gZiu5q7C7LZoWSjFFhASJ3HmQMrxw3/exec?action=submitBid&callback=handleJsonp&name=${encodeURIComponent(
    name
  )}&email=${encodeURIComponent(email)}&bid=${encodeURIComponent(bid)}`;
  jsonpRequest(url);
}

// Handle JSONP responses
function handleJsonp(response) {
  console.log('JSONP response:', response);

  if (response.highestBid !== undefined) {
    document.getElementById('current-bid').textContent = `$${response.highestBid}`;
  } else if (response.status === 'success') {
    document.getElementById('submit-message').textContent = 'Your bid was submitted successfully!';
    document.getElementById('submit-message').style.display = 'block';
    fetchHighestBid(); // Refresh the highest bid
  } else if (response.error) {
    document.getElementById('submit-message').textContent = `Error: ${response.error}`;
    document.getElementById('submit-message').style.display = 'block';
    document.getElementById('submit-message').style.color = 'red';
  } else {
    console.error('Unknown JSONP response:', response);
  }
}

// Helper function to make JSONP requests
function jsonpRequest(url) {
  const script = document.createElement('script');
  script.src = url;
  script.onload = () => {
    document.body.removeChild(script);
  };
  document.body.appendChild(script);
}



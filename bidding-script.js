const SCRIPT_BASE_URL = 'https://script.google.com/macros/s/AKfycbwd2dM5UtXaXxPRluwTLvNtHh1LQhzNa1zN02gZiu5q7C7LZoWSjFFhASJ3HmQMrxw3/exec';

function handleJsonp(response) {
  console.log('JSONP response:', response);

  if (response.highestBid !== undefined) {
    document.getElementById('current-bid').textContent = '$' + response.highestBid;
  } else if (response.status === 'success') {
    const msgEl = document.getElementById('submit-message');
    msgEl.textContent = 'Your bid was submitted successfully!';
    msgEl.style.display = 'block';
    msgEl.style.color = 'green';

    fetchHighestBid();
  } else if (response.error) {
    const msgEl = document.getElementById('submit-message');
    msgEl.textContent = 'Error: ' + response.error;
    msgEl.style.display = 'block';
    msgEl.style.color = 'red';
  } else {
    console.log('Unknown response:', response);
  }
}

function fetchHighestBid() {
  const url = SCRIPT_BASE_URL + '?action=getHighestBid&callback=handleJsonp';
  jsonpRequest(url);
}

function submitBid(name, email, bid) {
  const url = SCRIPT_BASE_URL
    + '?action=submitBid'
    + '&callback=handleJsonp'
    + '&name=' + encodeURIComponent(name)
    + '&email=' + encodeURIComponent(email)
    + '&bid=' + encodeURIComponent(bid);

  jsonpRequest(url);
}

function jsonpRequest(url) {
  const scriptEl = document.createElement('script');
  scriptEl.src = url;
  scriptEl.onload = () => {
    document.body.removeChild(scriptEl);
  };
  document.body.appendChild(scriptEl);
}

window.addEventListener('DOMContentLoaded', () => {
  fetchHighestBid();

  const bidForm = document.getElementById('bid-form');
  if (bidForm) {
    bidForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const msgEl = document.getElementById('submit-message');
      msgEl.style.display = 'none';
      msgEl.textContent = '';
      msgEl.style.color = 'green';

      const name = document.getElementById('bidder-name').value;
      const email = document.getElementById('bidder-email').value;
      const bid = document.getElementById('bid-amount').value;

      submitBid(name, email, bid);
      bidForm.reset();
    });
  } else {
    console.error('Bid form not found in DOM');
  }
});

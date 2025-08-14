// Set initial quotes
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Success is not in what you have, but who you are.", category: "Inspiration" },
  { text: "Your time is limited, so don’t waste it living someone else’s life.", category: "Life" }
];

function showRandomQuotes() {
  if (quotes.length === 0) {
    alert("You need to input a quote first!");
    return;
  }

  // choose random quote
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  const quotesDisplay = document.getElementById('quoteDisplay');
  quotesDisplay.innerHTML = `
    <blockquote>"${randomQuote.text}"</blockquote>
    <p><em>— ${randomQuote.category}</em></p>
  `;
}

// Add new quote and category
function createAddQuoteForm() {
  const quoteValue = document.getElementById('newQuoteText').value.trim();
  const categoryValue = document.getElementById('newQuoteCategory').value.trim();

  if (quoteValue && categoryValue) {
    quotes.push({ text: quoteValue, category: categoryValue });
    alert("Quote added successfully!");
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
  } else {
    alert("Please fill all fields");
  }
}

// Event listeners
document.getElementById('newQuote').addEventListener('click', showRandomQuotes);
document.getElementById('addQuote').addEventListener('click', addQuote);

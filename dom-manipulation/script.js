// Set initial quotes
// Load quotes from localStorage or use default ones
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Success is not in what you have, but who you are.", category: "Inspiration" },
  { text: "Your time is limited, so don’t waste it living someone else’s life.", category: "Life" }
];

function savequotes(){
    localStorage.setItem('quotes', JSON.stringify(quotes))
};

function showRandomQuotes() {
  if (quotes.length === 0) {
    alert("You need to input a quote first!");
    return;
  }

  // choose random quote
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  const quotesDisplay = document.getElementById('quoteDisplay');

  if (!quotesDisplay) {
        document.body.appendChild(quotesDisplay);
    }

  quotesDisplay.innerHTML = `
    <blockquote>"${randomQuote.text}"</blockquote>
    <p><em>— ${randomQuote.category}</em></p>
  `;

  // Save last viewed quote in sessionStorage
  sessionStorage.setItem('lastQuote', JSON.stringify(randomQuote));
}

// Add new quote and category
function createAddQuoteForm() {
  const quoteValue = document.getElementById('newQuoteText').value.trim();
  const categoryValue = document.getElementById('newQuoteCategory').value.trim();

  if (quoteValue && categoryValue) {

    // Add quote to array
    quotes.push({ text: quoteValue, category: categoryValue });
    savequotes();

    //Create new quote to the array
    const quotesDisplay = document.getElementById("quoteDisplay")

    const blockquote = document.createElement("blockquote")
    blockquote.textContent = quoteValue;

    const category = document.createElement('p')
    category.innerHTML = categoryValue;

    quotesDisplay.appendChild(blockquote);
    quotesDisplay.appendChild(category);
    alert("Quote added successfully!");

    // Check if the category is new and add it to the dropdown
    const categoryFilter = document.getElementById('categoryFilter');
    const existingCategories = [...categoryFilter.options].map(opt => opt.value);
    if (!existingCategories.includes(categoryValue)) {
      const option = document.createElement('option');
      option.value = categoryValue;
      option.textContent = categoryValue;
      categoryFilter.appendChild(option);
    }
    
    // Also save this as last viewed in sessionStorage
    sessionStorage.setItem('lastQuote', JSON.stringify({ text: quoteValue, category: categoryValue }));

    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

  } else {
    alert("Please fill all fields");
  }
}

// Export quotes as JSON file
function exportQuotes() {
  const dataStr = JSON.stringify(quotes, null, 2); // Pretty print
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  // Create download link
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();

  // Cleanup
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

// Function to add options to the select category
function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');

        // Extract unique categories from quotes
    const categories = [...new Set(quotes.map(q =>q.category))]

    
    // Clear old categories (except "All Categories")
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

        //add new options
    categories.forEach(category => {
        const option = document.createElement('option')
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

function displayQuotes(quotesToDisplay) {
    const quotesDisplay = document.getElementById('quoteDisplay');
    quotesDisplay.innerHTML = ''; // Clear old quotes

    if (quotesToDisplay.length === 0) {
        quotesDisplay.innerHTML = '<p>No quotes available.</p>';
        return;
    }

    quotesToDisplay.forEach(q => {
        const blockquote = document.createElement('blockquote');
        blockquote.textContent = q.text;

        const category = document.createElement('p');
        category.innerHTML = `<em>${q.category}</em>`;

        quotesDisplay.appendChild(blockquote);
        quotesDisplay.appendChild(category);
    });
}
        
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;

    if (selectedCategory === "all") {
        displayQuotes(quotes);
        savequotes();
    } else {
        const filtered = quotes.filter(q => q.category === selectedCategory);
        displayQuotes(filtered);
    }
};

// Call once when page loads
populateCategories();


// Event listeners
document.getElementById('newQuote').addEventListener('click', showRandomQuotes);
document.getElementById('addQuote').addEventListener('click', createAddQuoteForm);
document.getElementById('exportQuotes').addEventListener('click', exportQuotes);
// document.getElementById('categoryFilter').addEventListener('click', populateCategories);


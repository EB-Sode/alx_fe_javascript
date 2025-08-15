// Set initial quotes
// Load quotes from localStorage or use default ones
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Success is not in what you have, but who you are.", category: "Inspiration" },
  { text: "Your time is limited, so don’t waste it living someone else’s life.", category: "Life" }
];

const API_URL = "https://jsonplaceholder.typicode.com/posts";

function saveQuotes(){
    localStorage.setItem('quotes', JSON.stringify(quotes))
};
// Show notifications
function showNotification(message) {
    const note = document.getElementById("notification");
    note.textContent = message;
    note.style.display = "block";
    setTimeout(() => {
        note.style.display = "none";
    }, 5000);
}

// Fetch quotes from mock API
// async function fetchQuotesFromServer() {
//     try {
//         const res = await fetch(API_URL);
//         const data = await res.json();

//         // Simulate categories and text
//         const serverQuotes = data.slice(0, 10).map((item, index) => ({
//             text: item.title.charAt(0).toUpperCase() + item.title.slice(1) + ".",
//             category: `Category ${index % 3 + 1}`
//         }));

//          let updatedQuotes = [...quotes];
//         let conflicts = [];

//         serverQuotes.forEach(serverQuote => {
//             const existingIndex = updatedQuotes.findIndex(q => q.text === serverQuote.text);
//             if (existingIndex !== -1) {
//                 if (JSON.stringify(updatedQuotes[existingIndex]) !== JSON.stringify(serverQuote)) {
//                     // Conflict found
//                     conflicts.push({ local: updatedQuotes[existingIndex], server: serverQuote, index: existingIndex });
//                 }
//             } else {
//                 updatedQuotes.push(serverQuote);
//             }
//         });

//         if (conflicts.length > 0) {

//             // Ask user if they want manual or auto resolve
//             showNotification(`⚠ ${conflicts.length} conflicts detected. Using server version by default.`);
//             conflicts.forEach(c => {
//                 // Auto resolve to server by default
//                 updatedQuotes[c.index] = c.server;

//                 // Show modal for manual resolution 
//                 function showConflictModal(conflict) {
//                     alert(`Conflict detected:\nLocal: ${conflict.local.text}\nServer: ${conflict.server.text}`);
//                 }
//                 showConflictModal(c);

//             });
//         } else {
//             showNotification("✅ Quotes updated from server.");
//         }

//         quotes = updatedQuotes;

//         saveQuotes();
//         populateCategories();
//         // displayQuotes(quotes);
//         console.log("Quotes fetched from API:", serverQuotes);
//         console.log("All quotes now:", quotes);
//     } catch (error) {
//         console.error("Error fetching quotes:", error);
//     }
// }



// Modal-based conflict resolution (simple version)

function showConflictModal(conflict) {
    const userChoice = confirm(
        `Conflict detected:\n\n` +
        `Local: "${conflict.local.text}" (Category: ${conflict.local.category})\n` +
        `Server: "${conflict.server.text}" (Category: ${conflict.server.category})\n\n` +
        `Click OK to use SERVER version, or Cancel to keep LOCAL version.`
    );
    return userChoice ? conflict.server : conflict.local;
}

// Fetch   quotes from mock API
async function fetchQuotesFromServer() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();

        const serverQuotes = data.slice(0, 10).map((item, index) => ({
            text: item.title.charAt(0).toUpperCase() + item.title.slice(1) + ".",
            category: `Category ${index % 3 + 1}`
        }));

        let updatedQuotes = [...quotes];
        let conflicts = [];

        // Compare server data with local
        serverQuotes.forEach(serverQuote => {
            const existingIndex = updatedQuotes.findIndex(q => q.text === serverQuote.text);
            if (existingIndex !== -1) {
                if (JSON.stringify(updatedQuotes[existingIndex]) !== JSON.stringify(serverQuote)) {
                    conflicts.push({ local: updatedQuotes[existingIndex], server: serverQuote, index: existingIndex });
                }
            } else {
                updatedQuotes.push(serverQuote);
            }
        });

        if (conflicts.length > 0) {
            showNotification(`⚠ ${conflicts.length} conflicts detected. Auto-resolving by default...`);

            conflicts.forEach(c => {
                // Ask user to manually choose
                const resolvedQuote = showConflictModal(c);
                updatedQuotes[c.index] = resolvedQuote;
            });
        } else {
            showNotification("✅ Quotes updated from server.");
        }

        quotes = updatedQuotes;
        saveQuotes();
        populateCategories();
        displayQuotes(quotes);

        console.log("Quotes fetched from API:", serverQuotes);
        console.log("All quotes now:", quotes);
    } catch (error) {
        console.error("Error fetching quotes:", error);
    }
}

// Post new quote to mock API
async function postQuote(newQuote) {
    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newQuote)
        });

        const data = await res.json();
        console.log("Quote posted to API:", data);
    } catch (error) {
        console.error("Error posting quote:", error);
    }
}

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
        const newDiv = document.createElement('div');
        newDiv.id = 'quoteDisplay';
        document.body.appendChild(newDiv);
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
    const newQuote = { text: quoteValue, category: categoryValue };
    // Add quote to array
    quotes.push(newQuote);
    saveQuotes();

    //Create new quote to the array
    const quotesDisplay = document.getElementById("quoteDisplay")
    quotesDisplay.innerHTML = ""; // Clear previous content

    const blockquote = document.createElement("blockquote")
    blockquote.textContent = quoteValue;

    const category = document.createElement('p')
    category.innerHTML = `<em>— ${categoryValue}</em>`;

    quotesDisplay.appendChild(blockquote);
    quotesDisplay.appendChild(category);

    postQuote(newQuote);

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

        //Clear input
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

    populateCategories()

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
        saveQuotes();
    } else {
        const filtered = quotes.filter(q => q.category === selectedCategory);
        displayQuotes(filtered);
    }
};

// Call once when page loads
populateCategories();
fetchQuotesFromServer();
// displayQuotes(quotes);
// Periodic fetch to simulate live updates

setInterval(fetchQuotesFromServer, 10000); // every 10 seconds

// Event listeners
document.getElementById('newQuote').addEventListener('click', showRandomQuotes);
document.getElementById('addQuote').addEventListener('click', createAddQuoteForm);
document.getElementById('exportQuotes').addEventListener('click', exportQuotes);
document.getElementById('displayAll').addEventListener('click', () => displayQuotes(quotes));
document.getElementById('categoryFilter').addEventListener('click', populateCategories);


document.addEventListener("DOMContentLoaded", () => {
    fetch('/api/random').then(response => response.json())
    .then (data => {
        document.getElementById('quote-text').textContent = `"${data.text}"`;
        document.getElementById('quote-author').textContent = `-${data.author || 'Unknown'}`;
    })
    .catch(error => {
        console.error('Error fetching quote:', error);
        document.getElementById('quote-text').textContent = "Failed to load quote";
    })

    const searchBtn = document.getElementById('search-btn');

    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const author = document.getElementById('author-input').value.trim();
            if (!author) return;

            fetch(`http://localhost:3000/api/search?author=${encodeURIComponent(author)}`)
                .then(response => response.json())
                .then(results => {
                    const resultsDiv = document.getElementById('search-results');
                    resultsDiv.innerHTML = '';

                    if (results.length === 0) {
                        resultsDiv.textContent = 'No quotes found.';
                    } else {
                        results.forEach(quote => {
                            const quoteEl = document.createElement('p');
                            quoteEl.innerHTML = `"${quote.text}" <br> <em>- ${quote.author}</em>`;
                            resultsDiv.appendChild(quoteEl);
                        });
                    }
                })
                .catch(error => {
                    console.error('Search error:', error);
                    document.getElementById('search-results').textContent = 'Error searching quotes.';
                });
        });
    }
})
document.addEventListener('DOMContentLoaded', function() {
    window.location.hash = 'home';
});
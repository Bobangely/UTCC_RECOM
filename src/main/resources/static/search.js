const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const resultsDiv = document.getElementById('results');

searchButton.addEventListener('click', async () => {
    const searchTerm = searchInput.value;
    resultsDiv.innerHTML = '<p>Searching...</p>';
    try {
        const response = await fetch('/api/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: searchTerm }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }
        
        displayResults(data);

    } catch (error) {
        console.error('Error:', error);
        resultsDiv.innerHTML = `<p style="color: red;"><strong>Error:</strong> ${error.message}</p>`;
    }
});

function displayResults(locations) {
    if (locations.length === 0) {
        resultsDiv.innerHTML = '<p>No results found.</p>';
        return;
    }

    let html = locations.map(location => {
        const imageHtml = location.imageUrl
            ? `<img src="${location.imageUrl}" alt="${location.name}" class="result-image">`
            : `<div class="result-image placeholder-image"><span>No Image</span></div>`;

        return `
            <div class="result-item">
                ${imageHtml}
                <div class="result-details">
                    <h3>${location.name}</h3>
                    <p>${location.description}</p>
                </div>
            </div>
        `;
    }).join('');

    resultsDiv.innerHTML = html;
}
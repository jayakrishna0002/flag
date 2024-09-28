class Flag {
    constructor(name, population, region, capital, flagUrl, subregion, languages, currencies, borders) {
        this.name = name;
        this.population = population;
        this.region = region;
        this.capital = capital;
        this.flagUrl = flagUrl;
        this.subregion = subregion;
        this.languages = languages;
        this.currencies = currencies;
        this.borders = borders;
    }

    render() {
        return `
            <div class="flag-card" data-name="${this.name}">
                <img src="${this.flagUrl}" alt="Flag of ${this.name}">
                <h2>${this.name}</h2>
                <p>Population: ${this.population}</p>
                <p>Region: ${this.region}</p>
                <p>Capital: ${this.capital}</p>
            </div>
        `;
    }
}


async function fetchFlags() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const countries = await response.json();

        // Create Flag objects for each country
        const flags = countries.map(country => {
            return new Flag(
                country.name.common,
                country.population.toLocaleString(),
                country.region,
                country.capital ? country.capital[0] : 'N/A',
                country.flags.svg,
                country.subregion || 'N/A',
                country.languages ? Object.values(country.languages).join(', ') : 'N/A',
                country.currencies ? Object.values(country.currencies).map(curr => curr.name).join(', ') : 'N/A',
                country.borders ? country.borders.join(', ') : 'N/A'
            );
        });

        renderFlags(flags);
        setupSearchAndFilter(flags);
    } catch (error) {
        console.error("Error fetching flag data:", error);
    }
}

// Function to render flags on the page
const flagsContainer = document.getElementById('flagsContainer');
function renderFlags(flags) {
    flagsContainer.innerHTML = flags.map(flag => flag.render()).join('');
    setupFlagClickEvents(flags);
}

// Function to setup flag click events to show country details
function setupFlagClickEvents(flags) {
    const flagCards = document.querySelectorAll('.flag-card');
    flagCards.forEach(card => {
        card.addEventListener('click', () => {
            const clickedFlag = flags.find(flag => flag.name === card.getAttribute('data-name'));
            showCountryDetails(clickedFlag);
        });
    });
}

// Function to display country details in a modal
function showCountryDetails(flag) {
    const modal = document.getElementById('countryModal');
    const modalDetails = document.getElementById('modalDetails');
    
    modalDetails.innerHTML = `
        <img src="${flag.flagUrl}" alt="Flag of ${flag.name}" style="width: 100%; height: auto; border-radius: 5px;">
        <h2>${flag.name}</h2>
        <p><strong>Population:</strong> ${flag.population}</p>
        <p><strong>Region:</strong> ${flag.region}</p>
        <p><strong>Subregion:</strong> ${flag.subregion}</p>
        <p><strong>Capital:</strong> ${flag.capital}</p>
        <p><strong>Languages:</strong> ${flag.languages}</p>
        <p><strong>Currencies:</strong> ${flag.currencies}</p>
        <p><strong>Borders:</strong> ${flag.borders}</p>
    `;
    
    modal.style.display = "block";
}

// Close modal when clicking the close button or outside the modal
const modal = document.getElementById('countryModal');
const span = document.getElementsByClassName("close")[0];
span.onclick = () => modal.style.display = "none";
window.onclick = event => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

// Setup search and filter
function setupSearchAndFilter(flags) {
    const searchInput = document.getElementById('search');
    const regionFilter = document.getElementById('regionFilter');

    searchInput.addEventListener('input', () => filterFlags(flags));
    regionFilter.addEventListener('change', () => filterFlags(flags));
}

// Function to filter flags based on search and region
function filterFlags(flags) {
    const searchQuery = document.getElementById('search').value.toLowerCase();
    const regionQuery = document.getElementById('regionFilter').value;

    const filteredFlags = flags.filter(flag => {
        const matchesSearch = flag.name.toLowerCase().includes(searchQuery);
        const matchesRegion = regionQuery === 'all' || flag.region === regionQuery;
        return matchesSearch && matchesRegion;
    });

    renderFlags(filteredFlags);
}

// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Fetch flags and initialize the page
fetchFlags();

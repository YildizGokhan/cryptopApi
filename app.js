const coinTable = document.getElementById("coinTable");
const searchInput = document.querySelector("#searchInput");
const resultCount = document.querySelector("#resultCount");
const lastUpdated = document.querySelector("#lastUpdated");
const sortSelect = document.querySelector("#sortSelect");
const refreshBtn = document.querySelector("#refreshBtn");
const totalCoins = document.querySelector("#totalCoins");
const topMarketCap = document.querySelector("#topMarketCap");
const gainersCount = document.querySelector("#gainersCount");
const losersCount = document.querySelector("#losersCount");

let coinData = [];

const formatCurrency = (value, withDecimals = false) => {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: withDecimals ? 2 : 0,
        maximumFractionDigits: withDecimals ? 2 : 0,
    });
    return formatter.format(value);
};

const setResultCount = (count) => {
    resultCount.textContent = `${count} coins`;
};

const setLastUpdated = () => {
    const now = new Date();
    lastUpdated.textContent = `Updated: ${now.toLocaleTimeString('en-US')}`;
};

const showStatus = (message) => {
    coinTable.innerHTML = `<tbody><tr><td class="status-message" colspan="5">${message}</td></tr></tbody>`;
};

const changePrice = (changeValue) => {
    const icon = document.createElement("i");

    if (changeValue > 0) {
        icon.className = "fa-solid fa-arrow-trend-up";
        icon.style.color = "#6fe6bf";
    } else if (changeValue < 0) {
        icon.className = "fa-solid fa-arrow-trend-down";
        icon.style.color = "#ff6a7a";
    } else {
        icon.className = "fa-solid fa-minus";
        icon.style.color = "#9fb0d8";
    }

    return icon;
};

const renderStats = (data) => {
    totalCoins.textContent = data.length;

    const top10Cap = data
        .slice(0, 10)
        .reduce((acc, item) => acc + Number(item.marketCap || 0), 0);

    const gainers = data.filter((item) => Number(item.change) > 0).length;
    const losers = data.filter((item) => Number(item.change) < 0).length;

    topMarketCap.textContent = formatCurrency(top10Cap);
    gainersCount.textContent = gainers;
    losersCount.textContent = losers;
};

const sortData = (data, sortMode) => {
    const copied = [...data];

    switch (sortMode) {
        case "rankDesc":
            copied.sort((a, b) => Number(b.rank) - Number(a.rank));
            break;
        case "priceDesc":
            copied.sort((a, b) => Number(b.price) - Number(a.price));
            break;
        case "priceAsc":
            copied.sort((a, b) => Number(a.price) - Number(b.price));
            break;
        case "changeDesc":
            copied.sort((a, b) => Number(b.change) - Number(a.change));
            break;
        case "changeAsc":
            copied.sort((a, b) => Number(a.change) - Number(b.change));
            break;
        case "rankAsc":
        default:
            copied.sort((a, b) => Number(a.rank) - Number(b.rank));
            break;
    }

    return copied;
};

const createTable = (data) => {
    let tableHTML = `<thead>
      <tr>
        <th>#</th>
        <th>Name</th>
        <th>Price</th>
        <th>Market Cap</th>
        <th>24h Change</th>
      </tr>
    </thead>
    <tbody>`;

    if (!data.length) {
        tableHTML += `<tr><td class="status-message" colspan="5">No coin found for this query.</td></tr>`;
    }

    data.forEach((item) => {
        const numericChange = Number(item.change);
        tableHTML += `
        <tr>
            <td>${item.rank}</td>
            <td>
                <div class="coin-name">
                    <img src="${item.iconUrl}" class="coin-icon" alt="${item.name}" />
                    <div>
                        ${item.name}
                        <sup class="coin-symbol">${item.symbol}</sup>
                    </div>
                </div>
            </td>
            <td>${formatCurrency(Number(item.price), true)}</td>
            <td>${formatCurrency(Number(item.marketCap))}</td>
            <td class="stonks" data-change="${numericChange}">${numericChange}%</td>
        </tr>`;
    });

    tableHTML += `</tbody>`;
    coinTable.innerHTML = tableHTML;
    setResultCount(data.length);

    const changeCells = coinTable.querySelectorAll(".stonks");
    changeCells.forEach((cell) => {
        const change = Number(cell.dataset.change);
        const icon = changePrice(change);
        cell.appendChild(icon);
        cell.style.color = change >= 0 ? "#6fe6bf" : "#ff6a7a";
    });
};

const getData = async () => {
    showStatus("Loading market data...");
    try {
        const response = await fetch('https://api.coinranking.com/v2/coins');
        if (!response.ok) {
            throw new Error(`There was an error: ${response.status}`);
        }

        const data = await response.json();
        coinData = data.data.coins;
        renderStats(coinData);
        setLastUpdated();
        applyFilters();
    } catch (error) {
        console.log('An error occurred while fetching data:', error);
        showStatus("Data could not be fetched. Please try again later.");
        setResultCount(0);
    }
};

const applyFilters = () => {
    const searchText = searchInput.value.trim().toLowerCase();
    const filtered = coinData.filter((item) => {
        return item.name.toLowerCase().includes(searchText) || item.symbol.toLowerCase().includes(searchText);
    });

    const sorted = sortData(filtered, sortSelect.value);
    createTable(sorted);
};

const debounce = (fn, delay = 220) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
};

searchInput.addEventListener("input", debounce(applyFilters));
sortSelect.addEventListener("change", applyFilters);
refreshBtn.addEventListener("click", getData);

if (!window.fetch) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/fetch-polyfill@3.0.0/dist/fetch-polyfill.min.js';
    document.head.appendChild(script);
}

getData();

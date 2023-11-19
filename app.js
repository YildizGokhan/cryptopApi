const getData = async () => {
    try {
        const response = await fetch('https://api.coinranking.com/v2/coins');
        if (response.ok) {
            const data = await response.json();
            createTable(data.data.coins);
            return data.data.coins;
        } else {
            console.log(`There was an error: ${response.status}`);
        }
    } catch (error) {
        console.log('An error occurred while fetching data:', error);
    }
}


let coinData = [];

const createTable = (data) => {
    const table = document.getElementById("coinTable")
    let tableHTML = `<table class="table">
    <thead>
      <tr>
        <th>#</th>
        <th>Name</th>
        <th>Price</th>
        <th>Market Cap</th>
        <th>Change</th>
      </tr>
    </thead>
    <tbody>
`
    data.forEach((item) => {
        tableHTML += `
        <tr>
            <td>${item.rank}</td>
            <td><span><img src="${item.iconUrl}" class="spanBorder" alt="" width="30px" /></span>${item.name}  <sup class="bg-warning border-rounded rounded-1 text-white">${item.symbol}</sup></td>
            <td>&dollar; ${Number(item.price).toFixed(4)}</td>
            <td> ${formatMarketCap(item.marketCap)}</td>
            <td class="stonks"> ${item.change}</td>
        </tr>

    `
    })
    tableHTML += `
    </tbody>
    `
    table.innerHTML = tableHTML
    coinData = data

    const changeCells = table.querySelectorAll(".stonks");
    data.forEach((item, index) => {
        const changeCell = changeCells[index];
        const icon = changePrice(item.change);
        changeCell.appendChild(icon);
        if (item.change > 0) {
            changeCell.style.color = "green"
        } else {
            changeCell.style.color = "red"
        }
    });
}

const formatMarketCap = (marketCap) => {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })
    return formatter.format(marketCap)
}

//color değişimi
const changePrice = (data) => {
    const stonks = document.createElement("i")

    if (data > 0) {
        stonks.className = "fa-solid fa-arrow-trend-up"
        stonks.style.color = "green"

    } else if (data === 0) {
        stonks.style.color = "gray"
    } else {
        stonks.className = "fa-solid fa-arrow-trend-down"
        stonks.style.color = "red"

    }
    return stonks
}

const filterData = (searchText) => {
    searchText = searchText.toLowerCase();
    const filteredData = coinData.filter((item) => {
        return item.name.toLowerCase().includes(searchText) || item.symbol.toLowerCase().includes(searchText);
    });
    createTable(filteredData);
    
}

const searchInput = document.querySelector("#searchInput");
searchInput.addEventListener("input",(e) => {
    const searchText = e.target.value;
    filterData(searchText);
    if(searchText.length === 0){
        getData()
    }
});



getData();
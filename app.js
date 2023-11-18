const getData = async () => {
    try {
        const response = await fetch('https://api.coinranking.com/v2/coins');
        const data = await response.json();
        console.log(data.data.coins);
        // getCoin();
        createTable(data.data.coins)
    } catch (error) {
        console.log('Veri çekme işlemi başarısız oldu: ', error);

    }
}

getData();

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
            <td><span><img src="${item.iconUrl}" alt="" width="30px" /></span>${item.name}  <sup class="bg-warning bd-rounded rounded-1 text-white">${item.symbol}</sup></td>
            <td>&dollar; ${Number(item.price).toFixed(4)}</td>
            <td> ${formatMarketCap(item.marketCap)}</td>
            <td><i class="fa-solid fa-arrow-up-right-dots" id="stonks"></i> ${item.change}</td>
        </tr>

    `
    })
    tableHTML += `
    </tbody>
    `
    table.innerHTML = tableHTML
}

const formatMarketCap = (marketCap) =>{
    const formatter = new Intl.NumberFormat('en-US',{
        style:'currency',
        currency:'USD',
        minimumFractionDigits: 0, 
        maximumFractionDigits: 0,
    })
    return formatter.format(marketCap)
}

//color değişimi
const changePrice = () => {
    const stonks = document.getElementById("")
}


/* <i class="fa-solid fa-arrow-trend-down"></i> */
/* <i class="fa-solid fa-arrow-trend-up"></i> */

//name symbol price marketcap


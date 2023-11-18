const getData = async () => {
    try {
        const response = await fetch('https://api.coinstats.app/public/v1/coins');
        const data = await response.json();
        fetchCoinStats()
        
        return data;
    } catch (error) {
        console.log('Veri çekme işlemi başarısız oldu: ', error);

    }
}

// Veri çekme işlemini çağırma
const fetchCoinStats = () => {
    if (data) {
        console.log('Gelen veriler: ', data);
        // Verileri kullanarak istediğiniz işlemleri yapabilirsiniz
    } else {
        throw new Error('Veri bulunamadı.');
    }
}

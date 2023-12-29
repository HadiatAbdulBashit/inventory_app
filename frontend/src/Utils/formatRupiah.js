const formatRupiah = (angka) => {
    const numberString = angka.toString().replace(/\D/g, '');
    const formattedNumber = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(numberString);

    return formattedNumber;
};

export default formatRupiah;
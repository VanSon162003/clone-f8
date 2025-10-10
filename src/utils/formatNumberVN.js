function formatNumberVN(number) {
    if (number == null || isNaN(number)) return "";
    return Number(number).toLocaleString("vi-VN");
}
export default formatNumberVN;

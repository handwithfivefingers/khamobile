import currencyFormat from "currency-formatter";

const formatCurrency = (str) => {
  //   let result;

  const option = {
    symbol: "VNĐ",
    precision: 0,
    thousang: ",",
    format: "%v %s",
  };
  const result = currencyFormat.format(str, option);
  return result;
};

export { formatCurrency };

import currencyFormat from 'currency-formatter'

const formatCurrency = (str, options) => {
  //   let result;

  const option = {
    symbol: 'VNĐ',
    precision: 0,
    thousang: ',',
    format: '%v %s',
    ...options,
  }
  const result = currencyFormat.format(str, option)
  return result
}
const imageLoader = ({ src, width, quality }) => {
  return process.env.API + src + `?w=${width}&q=${quality || 75}`
}

export { formatCurrency, imageLoader }

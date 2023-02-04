import currencyFormat from 'currency-formatter'
import { Message } from 'rsuite'

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

const message = (type, header) => <Message showIcon type={type} header={header} closable />

export { formatCurrency, imageLoader, message }

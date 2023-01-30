import { Schema } from 'rsuite'

const CheckoutModel = Schema.Model({
  deliveryType: Schema.Types.StringType().isRequired('Dịch vụ giao hàng không chính xác, vui lòng thử lại'),
})

const DeliveryModel = Schema.Model({
  address: Schema.Types.StringType().isRequired('Địa chỉ giao hàng không chính xác,vui lòng thử lại'),
  city: Schema.Types.StringType().isRequired('Thành phố không chính xác,vui lòng thử lại'),
  district: Schema.Types.StringType().isRequired('Quận/Huyện không chính xác,vui lòng thử lại'),
  wards: Schema.Types.StringType().isRequired('Phường/Thị xã/Trấn không chính xác,vui lòng thử lại'),
})
const UserInformationModel = Schema.Model({
  fullName: Schema.Types.StringType().isRequired('Họ và tên không chính xác, vui lòng thử lại'),
  email: Schema.Types.StringType().isRequired('Địa chỉ email không chính xác,vui lòng thử lại'),
  phone: Schema.Types.StringType().isRequired('Số điện thoại không chính xác,vui lòng thử lại'),
})

const AttributeModel = Schema.Model({
  key: Schema.Types.StringType().isRequired('Thuộc tính không chính xác, vui lòng thử lại'),
})

const ProductModel = Schema.Model({
  quantity: Schema.Types.StringType().isRequired('Số lượng không chính xác, vui lòng thử lại').minLength(1),
  price: Schema.Types.StringType().isRequired('Giá tiền không chính xác, vui lòng reload lại page'),
})
export { CheckoutModel, AttributeModel, DeliveryModel, UserInformationModel, ProductModel }

import { Schema } from 'rsuite'

const CheckoutModel = Schema.Model({
  deliveryType: Schema.Types.StringType().isRequired('Dịch vụ giao hàng không chính xác, vui lòng thử lại'),
})

const DeliveryModel = Schema.Model({
  address_1: Schema.Types.StringType().isRequired('Địa chỉ giao hàng không chính xác,vui lòng thử lại'),
  city: Schema.Types.StringType().isRequired('Thành phố không chính xác,vui lòng thử lại'),
  postCode: Schema.Types.StringType().isRequired('Mã vùng không chính xác,vui lòng thử lại'),
})
const UserInformationModel = Schema.Model({
  fullName: Schema.Types.StringType().isRequired('Họ và tên không chính xác, vui lòng thử lại'),
  email: Schema.Types.StringType().isRequired('Địa chỉ email không chính xác,vui lòng thử lại'),
  phone: Schema.Types.StringType().isRequired('Số điện thoại không chính xác,vui lòng thử lại'),
})

const AttributeModel = Schema.Model({
  key: Schema.Types.StringType().isRequired('Thuộc tính không chính xác, vui lòng thử lại'),
})

export { CheckoutModel, AttributeModel, DeliveryModel, UserInformationModel }

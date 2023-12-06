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

const CategoryModel = Schema.Model({
  name: Schema.Types.StringType().isRequired('Tên danh mục là bắt buộc').minLength(3, 'Tên danh mục thấp hơn 3 kí tự'),
  slug: Schema.Types.StringType().isRequired('Đường dẫn là bắt buộc'),
})

const LoginModel = Schema.Model({
  username: Schema.Types.StringType()
    .isRequired('Tên tài khoản là bắt buộc')
    .minLength(3, 'Tên tài khoản thấp hơn 3 kí tự'),
  password: Schema.Types.StringType().isRequired('Mật khẩu là bắt buộc').minLength(8, 'Mật khẩu thấp hơn 8 kí tự'),
})

export { CheckoutModel, AttributeModel, DeliveryModel, UserInformationModel, ProductModel, CategoryModel, LoginModel }

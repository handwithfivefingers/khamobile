import clsx from 'clsx'
import CardBlock from 'component/UI/Content/CardBlock'
import CardPost from 'component/UI/Content/CardPost'
import { KMInput, KMInputPassword } from 'component/UI/Content/KMInput'
import PageHeader from 'component/UI/Content/PageHeader'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState, useRef, useEffect, useMemo } from 'react'
import { Button, Form, Nav, Pagination, Panel, PanelGroup, Schema } from 'rsuite'
import AuthenticateService from 'service/authenticate/Authenticate.service'
import { useAuthorizationStore } from 'src/store/authenticateStore'
import HomeIcon from '@rsuite/icons/legacy/Home'
import styles from './styles.module.scss'
import Heading from 'component/UI/Content/Heading'

export default function Policy() {
  const router = useRouter()
  const [active, setActive] = useState('protection')
  const onSelect = (v) => {
    setActive(v)
  }

  const renderPolicyByType = useMemo(() => {
    let html = null
    switch (active) {
      case 'protection':
        html = <ProtectionPolicy />
        break
      case 'warranty':
        break

      case 'refund':
        break
    }
    return html
  }, [active])
  return (
    <div className="row p-0">
      <div className="col-12 p-0">
        <PageHeader type="h3" left>
          Chính sách
        </PageHeader>
      </div>
      <div className="col-12 p-0 py-2 border-top">
        <div className="container">
          <div className="row gy-4">
            <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
              <Nav vertical activeKey={active} onSelect={onSelect} appearance="tabs" style={{ height: '100%' }}>
                <Nav.Item eventKey="protection">Chính sách bảo mật</Nav.Item>
                <Nav.Item eventKey="warranty">Chính sách mua hàng</Nav.Item>
                <Nav.Item eventKey="refund">Chính sách hoàn / hủy</Nav.Item>
              </Nav>
            </div>
            <div className="col-12 col-sm-6 col-md-8 col-lg-9 col-xl-10">{renderPolicyByType}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

const ProtectionPolicy = () => {
  return (
    <>
      <Heading type="h5">CHÍNH SÁCH BẢO MẬT THÔNG TIN KHÁCH HÀNG</Heading>
      <CardBlock style={{ border: 'unset' }}>
        <div className={clsx('row gy-2', styles.policy)}>
          <div className="col-12">
            <h5>
              I. Chính sách bảo mật thông tin người dùng khi sử dụng dịch vụ đăng ký doanh nghiệp của Khamobile.vn
            </h5>
            <PanelGroup>
              <Panel header="I. Mục đích và phạm vi thu thập" collapsible bordered defaultExpanded>
                <p>
                  - Để truy cập và sử dụng một số dịch vụ tại khamobile.vn, bạn có thể sẽ được yêu cầu cung cấp chúng
                  tôi thông tin cá nhân (Email, Họ tên, Số ĐT liên lạc…). Mọi thông tin khai báo phải đảm bảo tính chính
                  xác và hợp pháp. Khamobile.vn không chịu mọi trách nhiệm liên quan đến pháp luật của thông tin khai
                  báo.
                </p>
                <p>
                  - Chúng tôi cũng có thể thu thập thông tin về số lần viếng thăm, bao gồm số trang bạn xem, số links
                  (liên kết) bạn click và những thông tin khác liên quan đến việc kết nối đến site Khamobile.vn. Chúng
                  tôi cũng thu thập các thông tin mà trình duyệt Web (Browser) bạn sử dụng mỗi khi truy cập vào
                  Khamobile.vn, bao gồm: địa chỉ IP, loại Browser, ngôn ngữ sử dụng, thời gian và những địa chỉ mà
                  Browser truy xuất đến.
                </p>
              </Panel>

              <Panel header="II. Phạm vi sử dụng thông tin" collapsible bordered>
                <p>
                  Khamobile.vn thu thập và sử dụng thông tin cá nhân với mục đích phù hợp và hoàn toàn tuân thủ nội dung
                  của “Chính sách bảo mật” này. Cụ thể:
                </p>
                <p> Khi cần thiết, chúng tôi có thể sử dụng những thông tin này vào các mục đích:</p>
                <ul>
                  <li>
                    Xử lý đơn hàng: gọi điện/tin nhắn xác nhận việc đặt hàng, thông báo về trạng thái đơn hàng & thời
                    gian giao hàng, xác nhận việc huỷ đơn hàng (nếu có).
                  </li>
                  <li>
                    Gởi thư ngỏ/thư cảm ơn, giới thiệu sản phẩm mới, dịch vụ mới hoặc các chương trình khuyến mãi của
                    Khamobile.vn
                  </li>
                  <li>Gởi thông tin về bảo hành sản phẩm.</li>
                  <li>Giải quyết khiếu nại của khách hàng.</li>
                  <li>Thông tin trao thưởng (của Khamobile.vn hoặc của hãng).</li>
                  <li>Gởi thông tin cho công ty tài chính để tiếp nhận, thẩm định & duyệt hồ sơ trả góp.</li>
                  <li>Các khảo sát để chăm sóc khách hàng tốt hơn.</li>
                  <li>Xác nhận các thông tin về kỹ thuật & bảo mật thông tin khách hàng.</li>
                  <li>
                    Các trường hợp có sự yêu cầu của cơ quan nhà nước có thẩm quyền, theo đúng quy định của pháp luật.
                  </li>
                </ul>
              </Panel>
              <Panel header="III. Thời gian lưu trữ thông tin" collapsible bordered>
                <p>
                  Dữ liệu cá nhân của Khách hàngsẽ được lưu trữ cho đến khi có yêu cầu hủy bỏ. Còn lại trong mọi trường
                  hợp thông tin cá nhân khách hàng sẽ được bảo mật trên máy chủ của Khamobile.vn.
                </p>
              </Panel>

              <Panel header="IV. Địa chỉ của đơn vị thu thập và quản lý thông tin" collapsible bordered>
                <h6></h6>
                <p>- Địa chỉ đăng ký kinh doanh: 30B Hồ Hảo Hớn, Phường Cô Giang, Q.1, TP.HCM.</p>
                <p>- Điện thoại văn phòng: 1800.2063</p>
              </Panel>
              <Panel
                header="V. Phương tiện và công cụ để người dùng tiếp cận và chỉnh sửa dữ liệu cá nhân"
                collapsible
                bordered
              >
                <p>
                  - Người dùng có quyền tự kiểm tra, điều chỉnh các thông tin cá nhân của mình bao gồm: họ và tên, giới
                  tính, ngày sinh, quốc tịch, dân tộc, điện thoại, mật khẩu đăng nhập bằng cách đăng nhập vào tài khoản
                  người dùng và truy cập vào mục quản lý thông tin cá nhân.
                </p>
                <p>
                  - Trong trường hợp người dùng muốn vô hiệu hóa tài khoản đăng nhập, vui lòng liên hệ tổng đài số
                  0798341239 hoặc gửi yêu cầu theo thư điện tử tới địa chỉ email: truyenmai95@gmail.com để được hỗ trợ.
                </p>
              </Panel>
              <Panel header="VI. Cam kết bảo mật thông tin của người dùng" collapsible bordered>
                <p>- Thông tin của người dùng được bảo mật theo chính sách bảo mật của Khamobile.vn;</p>
                <p>
                  - Không sử dụng, chuyển giao, cung cấp hay tiết lộ cho bên thứ 3 nào về thông tin cá nhân của người
                  dùng khi chưa có sự đồng ý của người dùng;
                </p>
                <p>
                  - Trong trường hợp máy chủ lưu trữ thông tin bị hacker tấn công dẫn đến mất mát dữ liệu cá nhân người
                  dùng, thanhlapcongtyonline.vn sẽ chịu trách nhiệm thông báo vụ việc cho cơ quan chức năng điều tra và
                  người dùng;
                </p>
                <p>
                  - Các cá nhân khi đăng ký tài khoản người dùng cần kê khai đầy đủ thông tin, bao gồm: họ và tên, ngày
                  sinh, giới tính, email, số điện thoại và chịu trách nhiệm về tính chính xác của thông tin kê khai.
                  Thanhlapcongtyonline.vn không chịu trách nhiệm cũng như không giải quyết mọi khiếu nại liên quan đến
                  quyền lợi của người dùng trong trường hợp thông tin cá nhân của người dùng cung cấp khi đăng ký ban
                  đầu không chính xác.
                </p>
              </Panel>
            </PanelGroup>
          </div>
          <div className="col-12">
            <h5>II. Điều khoản và điều kiện về bảo mật khi sử dụng các dịch vụ của Khamobile.vn</h5>
            <PanelGroup>
              <Panel header="I. Mật khẩu:" collapsible bordered>
                <p>
                  Người sử dụng phải có trách nhiệm tự bảo mật Mật khẩu đăng nhập, các thông tin của giao dịch. Bất cứ
                  hành động truy cập hoặc giao dịch nào bằng tài khoản giao dịch của người sử dụng với đúng Mật khẩu
                  đăng nhập hoặc các yếu tố định danh khác do hệ thống cung cấp cho người sử dụng đều được coi là người
                  sử dụng truy cập hoặc giao dịch. Thanhlapcongtyonline.vn sẽ không chịu trách nhiệm đối với trường hợp
                  rủi ro phát sinh trong quá trình giao dịch từ trường hợp người sử dụng để lộ mật khẩu cho người khác.
                  Trường hợp phát hiện Mật khẩu bị lộ, người sử dụng cần nhanh chóng thay đổi lại Mật khẩu mới hoặc liên
                  hệ với thanhlapcongtyonline.vn để nhận được sự hỗ trợ.
                </p>
              </Panel>

              <Panel header="II. Lỗi hệ thống:" collapsible bordered>
                <p>
                  Khi sử dụng giao dịch trực tuyến, người sử dụng có thể gặp phải trường hợp bị lỗi khi truy cập vào
                  Internet hoặc các thiết bị điện tử khác; mất đường truyền, và chậm trễ trong việc truyền, nhận do việc
                  tắc nghẽn đường truyền hoặc vì lý do khác không thể dự báo trước, ngoài tầm kiểm soát của
                  thanhlapcongtyonline.vn và do vậy có thể dẫn đến các chậm trễ trong việc thực hiện các giao dịch trên
                  thanhlapcongtyonline.vn. Ngoài ra, người sử dụng mặc nhiên thừa nhận rằng thông tin và dữ liệu cá nhân
                  có thể bị bên thứ ba truy cập bất hợp pháp. Vì vậy người sử dụng mặc nhiên chấp nhận tất cả các rủi ro
                  có thể xảy ra khi truy cập và/hoặc thực hiện các giao dịch qua thanhlapcongtyonline.vn.
                </p>
              </Panel>
              <Panel header="III. Virút:" collapsible bordered>
                <p>
                  thanhlapcongtyonline.vn sẽ không chịu trách nhiệm về bất cứ bồi thường, yêu cầu, hình phạt, tổn thất,
                  trách nhiệm, chi phí, hành động và phí tổn nào mà người sử dụng gánh chịu do hệ thống máy tính hoặc
                  thiết bị di động của người sử dụng kết nối với máy tính hoặc thiết bị di động khác bị vi rút trong
                  thời gian người sử dụng truy cập, sử dụng, tải dữ liệu trên thanhlapcongtyonline.vn. Người sử dụng
                  phải có trách nhiệm tự trang bị các phần mềm diệt vi rút cho máy tính hoặc thiết bị di động sử dụng để
                  truy cập thanhlapcongtyonline.vn.
                </p>
              </Panel>

              <Panel header="IV. Lỗi đường truyền Internet:" collapsible bordered>
                <p>
                  Người sử dụng nên dùng các gói thuê bao có tốc độ đường truyền cao và ổn định để việc giao dịch trực
                  tuyến qua Internet được nhanh, và ổn định nhất. Thanhlapcongtyonline.vn sẽ không chịu trách nhiệm
                  trong trường hợp mất lệnh, không thể hủy lệnh do lỗi đường truyền của người sử dụng.
                </p>
              </Panel>
              <Panel
                header="V. Người sử dụng cần phải thông báo với thanhlapcongtyonline.vn trong vòng không quá 01 giờ kể từ khi người sử dụng nhận thấy có những tình trạng sau:"
                collapsible
                bordered
              >
                <p>- Thất lạc hoặc bị đánh cắp tên sử dụng, mật khẩu.</p>
                <p>- Mọi sự chiếm dụng một cách bất hợp pháp tên truy cập, mật khẩu.</p>
                <p>- Sử dụng các dịch vụ được cung cấp trên thanhlapcongtyonline.vn một cách bất hợp pháp.</p>
                <p>
                  - Các dấu hiệu sử dụng tài khoản/mật khẩu để thực hiện các giao dịch mà không có sự đồng ý, cho phép
                  của người sử dụng.
                </p>
                <p>
                  Bằng việc sử dụng các dịch vụ trên thanhlapcongtyonline.vn, người sử dụng mặc nhiên chấp thuận các
                  điều kiện và điều khoản sử dụng nêu trên. Trong trường hợp sửa đổi nội dung các điều kiện, điều khoản
                  sử dụng của thanhlapcongtyonline.vn, các nội dung sửa đổi sẽ được thông báo trên
                  thanhlapcongtyonline.vn. Việc người sử dụng tiếp tục sử dụng và tiếp tục thực hiện các yêu cầu dịch vụ
                  trên thanhlapcongtyonline.vn có nghĩa là người sử dụng đã chấp nhận hoàn toàn các sửa đổi đó.
                </p>
              </Panel>
            </PanelGroup>
          </div>
        </div>
      </CardBlock>
    </>
  )
}

const WarrantyPolicy = () => {
  return (
    <>
      <Heading type="h5">CHÍNH SÁCH BẢO MẬT THÔNG TIN KHÁCH HÀNG</Heading>
      <CardBlock style={{ border: 'unset' }}>
        <div className="row gy-2">
          <div className="col-12">
            <h5>
              I. Chính sách bảo mật thông tin người dùng khi sử dụng dịch vụ đăng ký doanh nghiệp của Khamobile.vn
            </h5>
            <PanelGroup>
              <Panel header="I. Mục đích và phạm vi thu thập" collapsible bordered defaultExpanded>
                <p>
                  - Để truy cập và sử dụng một số dịch vụ tại khamobile.vn, bạn có thể sẽ được yêu cầu cung cấp chúng
                  tôi thông tin cá nhân (Email, Họ tên, Số ĐT liên lạc…). Mọi thông tin khai báo phải đảm bảo tính chính
                  xác và hợp pháp. Khamobile.vn không chịu mọi trách nhiệm liên quan đến pháp luật của thông tin khai
                  báo.
                </p>
                <p>
                  - Chúng tôi cũng có thể thu thập thông tin về số lần viếng thăm, bao gồm số trang bạn xem, số links
                  (liên kết) bạn click và những thông tin khác liên quan đến việc kết nối đến site Khamobile.vn. Chúng
                  tôi cũng thu thập các thông tin mà trình duyệt Web (Browser) bạn sử dụng mỗi khi truy cập vào
                  Khamobile.vn, bao gồm: địa chỉ IP, loại Browser, ngôn ngữ sử dụng, thời gian và những địa chỉ mà
                  Browser truy xuất đến.
                </p>
              </Panel>

              <Panel header="II. Phạm vi sử dụng thông tin" collapsible bordered>
                <p>
                  Khamobile.vn thu thập và sử dụng thông tin cá nhân với mục đích phù hợp và hoàn toàn tuân thủ nội dung
                  của “Chính sách bảo mật” này. Cụ thể:
                </p>
                <p> Khi cần thiết, chúng tôi có thể sử dụng những thông tin này vào các mục đích:</p>
                <ul style={{ listStyle: 'none' }}>
                  <li>
                    - Xử lý đơn hàng: gọi điện/tin nhắn xác nhận việc đặt hàng, thông báo về trạng thái đơn hàng & thời
                    gian giao hàng, xác nhận việc huỷ đơn hàng (nếu có).
                  </li>
                  <li>
                    - Gởi thư ngỏ/thư cảm ơn, giới thiệu sản phẩm mới, dịch vụ mới hoặc các chương trình khuyến mãi của
                    Khamobile.vn
                  </li>
                  <li>- Gởi thông tin về bảo hành sản phẩm.</li>
                  <li>- Giải quyết khiếu nại của khách hàng.</li>
                  <li>- Thông tin trao thưởng (của Khamobile.vn hoặc của hãng).</li>
                  <li>- Gởi thông tin cho công ty tài chính để tiếp nhận, thẩm định & duyệt hồ sơ trả góp.</li>
                  <li>- Các khảo sát để chăm sóc khách hàng tốt hơn.</li>
                  <li>- Xác nhận các thông tin về kỹ thuật & bảo mật thông tin khách hàng.</li>
                  <li>
                    - Các trường hợp có sự yêu cầu của cơ quan nhà nước có thẩm quyền, theo đúng quy định của pháp luật.
                  </li>
                </ul>
              </Panel>

              <Panel header="III. Thời gian lưu trữ thông tin" collapsible bordered>
                <p>
                  Dữ liệu cá nhân của Khách hàngsẽ được lưu trữ cho đến khi có yêu cầu hủy bỏ. Còn lại trong mọi trường
                  hợp thông tin cá nhân khách hàng sẽ được bảo mật trên máy chủ của Khamobile.vn.
                </p>
              </Panel>

              <Panel header="IV. Địa chỉ của đơn vị thu thập và quản lý thông tin" collapsible bordered>
                <h6></h6>
                <p>- Địa chỉ đăng ký kinh doanh: 30B Hồ Hảo Hớn, Phường Cô Giang, Q.1, TP.HCM.</p>
                <p>- Điện thoại văn phòng: 1800.2063</p>
              </Panel>

              <Panel
                header="V. Phương tiện và công cụ để người dùng tiếp cận và chỉnh sửa dữ liệu cá nhân"
                collapsible
                bordered
              >
                <p>
                  - Người dùng có quyền tự kiểm tra, điều chỉnh các thông tin cá nhân của mình bao gồm: họ và tên, giới
                  tính, ngày sinh, quốc tịch, dân tộc, điện thoại, mật khẩu đăng nhập bằng cách đăng nhập vào tài khoản
                  người dùng và truy cập vào mục quản lý thông tin cá nhân.
                </p>
                <p>
                  - Trong trường hợp người dùng muốn vô hiệu hóa tài khoản đăng nhập, vui lòng liên hệ tổng đài số
                  0798341239 hoặc gửi yêu cầu theo thư điện tử tới địa chỉ email: truyenmai95@gmail.com để được hỗ trợ.
                </p>
              </Panel>

              <Panel header="VI. Cam kết bảo mật thông tin của người dùng" collapsible bordered>
                <p>- Thông tin của người dùng được bảo mật theo chính sách bảo mật của Khamobile.vn;</p>
                <p>
                  - Không sử dụng, chuyển giao, cung cấp hay tiết lộ cho bên thứ 3 nào về thông tin cá nhân của người
                  dùng khi chưa có sự đồng ý của người dùng;
                </p>
                <p>
                  - Trong trường hợp máy chủ lưu trữ thông tin bị hacker tấn công dẫn đến mất mát dữ liệu cá nhân người
                  dùng, thanhlapcongtyonline.vn sẽ chịu trách nhiệm thông báo vụ việc cho cơ quan chức năng điều tra và
                  người dùng;
                </p>
                <p>
                  - Các cá nhân khi đăng ký tài khoản người dùng cần kê khai đầy đủ thông tin, bao gồm: họ và tên, ngày
                  sinh, giới tính, email, số điện thoại và chịu trách nhiệm về tính chính xác của thông tin kê khai.
                  Thanhlapcongtyonline.vn không chịu trách nhiệm cũng như không giải quyết mọi khiếu nại liên quan đến
                  quyền lợi của người dùng trong trường hợp thông tin cá nhân của người dùng cung cấp khi đăng ký ban
                  đầu không chính xác.
                </p>
              </Panel>
            </PanelGroup>
          </div>
        </div>
      </CardBlock>
    </>
  )
}

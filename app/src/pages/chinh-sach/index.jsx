import clsx from 'clsx'
// import CardBlock from 'component/UI/Content/CardBlock'
// import Heading from 'component/UI/Content/Heading'
// import PageHeader from 'component/UI/Content/PageHeader'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { Nav, Panel, PanelGroup, Tag } from 'rsuite'
import styles from './styles.module.scss'
import dynamic from 'next/dynamic'

const PageHeader = dynamic(() => import('component/UI/Content/PageHeader'))
const CardBlock = dynamic(() => import('component/UI/Content/CardBlock'))
const Heading = dynamic(() => import('component/UI/Content/Heading'))
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
        html = <WarrantyPolicy />
        break
      case 'sell':
        html = <SellingPolicy />
        break
      case 'refund':
        html = <RefundPolicy />

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
                <Nav.Item eventKey="warranty">Chính sách bảo hành</Nav.Item>
                <Nav.Item eventKey="sell">Chính sách mua hàng</Nav.Item>
                <Nav.Item eventKey="refund">Chính sách hoàn tiền </Nav.Item>
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
      <Heading type="h5" center>
        CHÍNH SÁCH BẢO MẬT THÔNG TIN KHÁCH HÀNG
      </Heading>
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
                <p>
                  - Địa chỉ đăng ký kinh doanh: 220/9A, Đường Xô Viết Nghệ Tĩnh, Phường 21, Bình Thạnh, Hồ Chí Minh.
                </p>
                <p>- Điện thoại văn phòng: 0777 9999 66</p>
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
                  - Trong trường hợp người dùng muốn vô hiệu hóa tài khoản đăng nhập, vui lòng liên hệ tổng đài số 0777
                  9999 66 hoặc gửi yêu cầu theo thư điện tử tới địa chỉ email: kha44mobile@gmail.com để được hỗ trợ.
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
                  dùng, Khamobile.vn sẽ chịu trách nhiệm thông báo vụ việc cho cơ quan chức năng điều tra và người dùng;
                </p>
                <p>
                  - Các cá nhân khi đăng ký tài khoản người dùng cần kê khai đầy đủ thông tin, bao gồm: họ và tên, ngày
                  sinh, giới tính, email, số điện thoại và chịu trách nhiệm về tính chính xác của thông tin kê khai.
                  Khamobile.vn không chịu trách nhiệm cũng như không giải quyết mọi khiếu nại liên quan đến quyền lợi
                  của người dùng trong trường hợp thông tin cá nhân của người dùng cung cấp khi đăng ký ban đầu không
                  chính xác.
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
                  sử dụng truy cập hoặc giao dịch. Khamobile.vn sẽ không chịu trách nhiệm đối với trường hợp rủi ro phát
                  sinh trong quá trình giao dịch từ trường hợp người sử dụng để lộ mật khẩu cho người khác. Trường hợp
                  phát hiện Mật khẩu bị lộ, người sử dụng cần nhanh chóng thay đổi lại Mật khẩu mới hoặc liên hệ với
                  Khamobile.vn để nhận được sự hỗ trợ.
                </p>
              </Panel>

              <Panel header="II. Lỗi hệ thống:" collapsible bordered>
                <p>
                  Khi sử dụng giao dịch trực tuyến, người sử dụng có thể gặp phải trường hợp bị lỗi khi truy cập vào
                  Internet hoặc các thiết bị điện tử khác; mất đường truyền, và chậm trễ trong việc truyền, nhận do việc
                  tắc nghẽn đường truyền hoặc vì lý do khác không thể dự báo trước, ngoài tầm kiểm soát của Khamobile.vn
                  và do vậy có thể dẫn đến các chậm trễ trong việc thực hiện các giao dịch trên Khamobile.vn. Ngoài ra,
                  người sử dụng mặc nhiên thừa nhận rằng thông tin và dữ liệu cá nhân có thể bị bên thứ ba truy cập bất
                  hợp pháp. Vì vậy người sử dụng mặc nhiên chấp nhận tất cả các rủi ro có thể xảy ra khi truy cập
                  và/hoặc thực hiện các giao dịch qua Khamobile.vn.
                </p>
              </Panel>
              <Panel header="III. Virút:" collapsible bordered>
                <p>
                  Khamobile.vn sẽ không chịu trách nhiệm về bất cứ bồi thường, yêu cầu, hình phạt, tổn thất, trách
                  nhiệm, chi phí, hành động và phí tổn nào mà người sử dụng gánh chịu do hệ thống máy tính hoặc thiết bị
                  di động của người sử dụng kết nối với máy tính hoặc thiết bị di động khác bị vi rút trong thời gian
                  người sử dụng truy cập, sử dụng, tải dữ liệu trên Khamobile.vn. Người sử dụng phải có trách nhiệm tự
                  trang bị các phần mềm diệt vi rút cho máy tính hoặc thiết bị di động sử dụng để truy cập Khamobile.vn.
                </p>
              </Panel>

              <Panel header="IV. Lỗi đường truyền Internet:" collapsible bordered>
                <p>
                  Người sử dụng nên dùng các gói thuê bao có tốc độ đường truyền cao và ổn định để việc giao dịch trực
                  tuyến qua Internet được nhanh, và ổn định nhất. Khamobile.vn sẽ không chịu trách nhiệm trong trường
                  hợp mất lệnh, không thể hủy lệnh do lỗi đường truyền của người sử dụng.
                </p>
              </Panel>
              <Panel
                header="V. Người sử dụng cần phải thông báo với Khamobile.vn trong vòng không quá 01 giờ kể từ khi người sử dụng nhận thấy có những tình trạng sau:"
                collapsible
                bordered
              >
                <p>- Thất lạc hoặc bị đánh cắp tên sử dụng, mật khẩu.</p>
                <p>- Mọi sự chiếm dụng một cách bất hợp pháp tên truy cập, mật khẩu.</p>
                <p>- Sử dụng các dịch vụ được cung cấp trên Khamobile.vn một cách bất hợp pháp.</p>
                <p>
                  - Các dấu hiệu sử dụng tài khoản/mật khẩu để thực hiện các giao dịch mà không có sự đồng ý, cho phép
                  của người sử dụng.
                </p>
                <p>
                  Bằng việc sử dụng các dịch vụ trên Khamobile.vn, người sử dụng mặc nhiên chấp thuận các điều kiện và
                  điều khoản sử dụng nêu trên. Trong trường hợp sửa đổi nội dung các điều kiện, điều khoản sử dụng của
                  Khamobile.vn, các nội dung sửa đổi sẽ được thông báo trên Khamobile.vn. Việc người sử dụng tiếp tục sử
                  dụng và tiếp tục thực hiện các yêu cầu dịch vụ trên Khamobile.vn có nghĩa là người sử dụng đã chấp
                  nhận hoàn toàn các sửa đổi đó.
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
      <Heading type="h5" center>
        CHÍNH SÁCH BẢO HÀNH
      </Heading>
      <CardBlock style={{ border: 'unset' }}>
        <div className="row gy-2">
          <div className="col-12">
            <h5>MÁY CHÍNH HÃNG SẼ ĐƯỢC BẢO HÀNH THEO QUI ĐỊNH CỦA HÃNG.</h5>
            <PanelGroup>
              <Panel header="I. CHÍNH SÁCH BẢO HÀNH – ĐỔI TRẢ" collapsible bordered defaultExpanded>
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th scope="col">
                          <div className="d-flex justify-content-center  align-items-left flex-column">
                            CÁC DÒNG MÁY
                          </div>
                        </th>
                        <th scope="col">
                          <div className="d-flex justify-content-center align-items-left flex-column">
                            <span>BAO ĐỔI (*)</span>
                            <span>( máy lỗi do NSX)</span>
                          </div>
                        </th>
                        <th scope="col">
                          <div className="d-flex justify-content-center  align-items-left flex-column">
                            THỜI GIAN BẢO HÀNH
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>MÁY MỚI ,CPO</th>
                        <td>03 NGÀY</td>
                        <td>12 THÁNG</td>
                      </tr>
                      <tr>
                        <th>MÁY TRẢ BẢO HÀNH</th>
                        <td>03 NGÀY</td>
                        <td></td>
                      </tr>
                      <tr>
                        <th>MÁY CŨ</th>
                        <td>07 NGÀY</td>
                        <td>KHÔNG BẢO HÀNH ( có thể mua thêm bảo hành trong 7 ngày )</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>
                  (*)Máy mới đã active  không đổi về ngoại hình ( trầy xước,tróc sơn,bụi camera…..) máy lỗi đổi khác
                  model,khác màu mất 5%  giá trị hiện tại. 
                </p>
                <p>
                  Trong trường hợp máy không lỗi, khách muốn đổi sản phẩm sẽ được tính như sau:
                  <ul>
                    <li>{`Máy mới = giá máy hiện tại  – 15% => máy y như tình trạng ban đầu.`}</li>
                    <li>{`Máy cũ = giá máy hiện tại – 10%  => máy y như tình trạng ban đầu.`}</li>
                    <li>Gói bảo hành: trong 7 ngày nhập lại 50% , sau 7 ngày không hỗ trợ nhập lại.</li>
                  </ul>
                  Máy không đúng với tình trạng ban đầu, sau 7 ngày ( kể từ ngày mua)  sẽ tính theo giá thỏa thuận.  Đổi
                  máy tương đương trọn đời máy nếu máy lỗi khóa sim hoặc khóa mạng không rõ lý do.
                </p>
              </Panel>

              <Panel header="II. CHÍNH SÁCH BẢO HÀNH" collapsible bordered>
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th scope="col">
                          <div className="d-flex justify-content-center  align-items-left flex-column">
                            PHẠM VI BẢO HÀNH
                          </div>
                        </th>
                        <th scope="col" style={{ width: 275 }}>
                          <div className="d-flex justify-content-center align-items-left flex-column">
                            <span>BẢO HÀNH SỬA CHỮA 6 THÁNG</span>
                          </div>
                        </th>
                        <th scope="col">
                          <div className="d-flex justify-content-center  align-items-left flex-column">
                            1 ĐỔI 1 VIP 12 THÁNG (**)
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>NGUỒN</th>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr>
                        <th>Ổ CỨNG</th>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr>
                        <th>MÀN HÌNH, CẢM ỨNG(***)</th>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr>
                        <th>VÂN TAY, FACE ID</th>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr>
                        <th>PIN, PHÍM VẬT LÝ</th>
                        <td></td>
                        <td>SỮA CHỮA, THAY THẾ LINH KIỆN</td>
                      </tr>
                      <tr>
                        <th>LỖI PHẦN MỀM, ỨNG DỤNG</th>
                        <td colSpan={2}>HỖ TRỢ CHẠY PHẦN MỀM MIỄN PHÍ  (****)</td>
                      </tr>
                      <tr>
                        <th>KHÁCH HÀNG GÂY NÊN TÌNH TRẠNG: CẤN MÓP, RƠI VỠ, ẨM ƯỚT…..</th>
                        <td colSpan={2}>KHÔNG BẢO HÀNH, (SỮA CHỮA HỖ TRỢ GIÁ GỐC )</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>
                  <i>
                    (**) Đổi máy  đúng model , đúng  màu. Đối với máy fullbox sẽ đổi máy trả  bảo hành, máy mới trần
                    chưa active.  
                  </i>
                </p>
                <p>
                  Lưu ý: Nếu máy bị trầy xước ngoại hình không đạt chuẩn máy  99% khách hàng sẽ được bảo hành,sữa chữa
                  miễn phí. Nếu đổi sang máy khác cần bù giá chênh lệch máy 98% – 99% hoặc trừ tiền vỏ theo bảng giá
                  niêm yết tại cửa hàng.
                </p>
                <p>
                  <i>(***) Hỗ trợ sửa chữa giá gốc, tùy thời giá khi màn hình sọc, chảy mực.</i>
                </p>
                <p>
                  <i>
                    (****) Trường hợp chạy phầm mềm nhiều lần, từ 03 lần, sẽ được đổi máy like new tương đương tình
                    trạng ngoại hình.
                  </i>{' '}
                </p>
              </Panel>

              <Panel header="III. TRƯỜNG HỢP TỪ CHỐI BẢO HÀNH:" collapsible bordered>
                <ul>
                  <li>
                    Máy không nhận sim do hỏng chân sim, máy bị mất icloud, máy bị mất Imei  mà không còn tem bảo hành.
                  </li>
                  <li>
                    Sản phẩm sử dụng không đúng qui cách của nhà sản xuất ( vô nước, ẩm móc, cháy chập, va đập,cong
                    vênh, bể nức, tróc sơn.) hoặc do nguyên nhân tự nhiên ( thiên tai, lũ lụt ….)
                  </li>
                  <li>
                    Người dung tự ý sữa chữa can thiệp phần mềm hoặc phần cứng, IMEI không trùng với thân máy hoặc số
                    hiệu lưu hệ thống.
                  </li>
                  <li>
                    <p>
                      <i>
                        ** Khi mang máy đến sữa chữa bảo hành , Qúi khách vui lòng lưu lại danh bạ, dữ liệu và tự bảo
                        quản sim, thẻ nhớ, tài khoản cá nhân, ( Icloud, google, facebook, zalo …)
                      </i>
                    </p>
                  </li>
                </ul>
              </Panel>
            </PanelGroup>
          </div>
        </div>
      </CardBlock>
    </>
  )
}

const SellingPolicy = () => {
  return (
    <>
      <Heading type="h5" center>
        CHÍNH SÁCH MUA HÀNG
      </Heading>
      <CardBlock style={{ border: 'unset' }}>
        <div className={clsx('row gy-2', styles.policy)}>
          <div className="col-12">
            <PanelGroup>
              <Panel header="I. Quy trình thanh toán" collapsible bordered defaultExpanded>
                <p>
                  Khách hàng và bên bán có thể tham khảo các phương thức thanh toán sau đây và lựa chọn áp dụng phương
                  thức phù hợp:
                </p>
                <ul>
                  Cách 1: Thanh toán trực tiếp (Khách hàng nhận hàng tại địa chỉ cửa hàng ):
                  <li>Bước 1: Khách hàng tìm hiểu thông tin về sản phẩm, dịch vụ được đăng tin.</li>
                  <li>Bước 2: Khách hàng đến địa chỉ bán hàng là các siêu thị bán hàng của www.khanmobile.com.</li>
                  <li>Bước 3: Khách hàng thanh toán bằng tiền mặt, thẻ ATM nội địa hoặc thẻ tín dụng và nhận hàng.</li>
                </ul>
                <ul>
                  Cách 2: Thanh toán sau (COD – giao hàng và thu tiền tận nơi):
                  <li>Bước 1: Khách hàng tìm hiểu thông tin về sản phẩm, dịch vụ được đăng tin.</li>
                  <li>Bước 2: Khách hàng xác thực đơn hàng (điện thoại, tin nhắn, email).</li>
                  <li>Bước 3: Khamobile xác nhận thông tin Khách hàng.</li>
                  <li>Bước 4: Khamobile chuyển hàng.</li>
                  <li>Bước 5: Khách hàng nhận hàng và thanh toán bằng tiền mặt cho nhân viên vận chuyển.</li>
                </ul>
                <ul>
                  Cách 3: Thanh toán online qua thẻ tín dụng:
                  <li>Bước 1: Khách hàng tìm hiểu thông tin về sản phẩm, dịch vụ được đăng tin.</li>
                  <li>Bước 2: Khách hàng xác thực đơn hàng (điện thoại, tin nhắn, email).</li>
                  <li>Bước 3: Khách hàng xác nhận thông tin Người mua.</li>
                  <li>Bước 4: Khách hàng thanh toán.</li>
                  <li>Bước 5: Khamobile chuyển hàng.</li>
                  <li>Bước 6: Khách hàng nhận hàng.</li>
                </ul>

                <ul>
                  Cách 4: Thanh toán online bằng hình thức chuyển khoản:
                  <li>Bước 1: Khách hàng tìm hiểu thông tin về sản phẩm, dịch vụ được đăng tin.</li>
                  <li>Bước 2: Khách hàng xác thực đơn hàng (điện thoại, tin nhắn, email).</li>
                  <li>Bước 3: Khách hàng xác nhận thông tin Người mua.</li>
                  <li>
                    Bước 4: Khách hàng thanh toán bằng hình thức chuyển khoản cho Kha Mobile qua các thông tin tài khoản
                    sau(Chi phí phát sinh khi chuyển khoản do khách hàng chịu):
                    <ol>
                      <li className="d-flex flex-column">
                        <span> Tài khoản 1</span>
                        <span>
                          Sồ tài khoản: <Tag color="blue">19033978628016</Tag> hoặc <Tag color="blue">0777999966</Tag>
                        </span>
                        <span>Ngân hàng: Techcombank</span>
                        <span>Chủ tài khoản: Lê Thành Kha</span>
                      </li>
                      <li className="d-flex flex-column">
                        <span> Tài khoản 1:</span>
                        <span>
                          Sồ tài khoản: <Tag color="blue">Khamobile</Tag>
                        </span>
                        <span>Ngân hàng: Vietcombank</span>
                        <span>Chủ tài khoản: Lê Thành Kha</span>
                      </li>
                    </ol>
                  </li>
                  <li>Bước 5: Khamobile chuyển hàng.</li>
                  <li>Bước 6: Khách hàng nhận hàng.</li>
                </ul>
              </Panel>

              <Panel header="II. Đảm bảo an toàn giao dịch" collapsible bordered>
                <p>
                  Ban quản lý đã sử dụng các dịch vụ để bảo vệ thông tin về nội dung mà người bán đăng sản phẩm trên
                  Khamobile.com. Để đảm bảo các giao dịch được tiến hành thành công, hạn chế tối đa rủi ro có thể phát
                  sinh.
                </p>
                <p>
                  Khách hàng nên cung cấp thông tin đầy đủ (tên, địa chỉ, số điện thoại, email) khi tham gia mua hàng
                  của Khamobile.com để Khamobile.com có thể liên hệ nhanh lại với người mua trong trường hợp xảy ra lỗi.
                </p>
                <p>
                  Trong trường hợp giao dịch nhận hàng tại nhà của người mua, thì người mua chỉ nên thanh toán sau khi
                  đã kiểm tra hàng hoá chi tiết và hài lòng với sản phẩm.
                </p>
                <p>
                  Khi thanh toán trực tuyến bằng thẻ ATM nội địa, Visa, Master người mua nên tự mình thực hiện và không
                  được để lộ thông tin thẻ. Khamobile.com không lưu trữ thông tin thẻ của người mua sau khi thanh toán,
                  mà thông qua hệ thống của ngân hàng liên kết. Nên tuyệt đối bảo mật thông tin thẻ cho khách hàng.
                </p>
                <p>
                  Trong trường lỗi xảy ra trong quá trình thanh toán trực tuyến, Khamobile.com sẽ là đơn vị giải quyết
                  cho khách hàng trong vòng 1 giờ làm việc từ khi tiếp nhận thông tin từ người thực hiện giao dịch.
                </p>
              </Panel>
            </PanelGroup>
          </div>
        </div>
      </CardBlock>
    </>
  )
}

const RefundPolicy = () => {
  return (
    <>
      <Heading type="h5" center>
        QUY ĐỊNH VỀ HOÀN TRẢ TIỀN KHI THANH TOÁN TRỰC TUYẾN
      </Heading>
      <CardBlock style={{ border: 'unset' }}>
        <div className={clsx('row gy-2', styles.policy)}>
          <div className="col-12">
            <PanelGroup>
              <Panel defaultExpanded header="QUY ĐỊNH VỀ HOÀN TRẢ TIỀN KHI THANH TOÁN TRỰC TUYẾN" collapsible bordered>
                <p>
                  Trong trường hợp quý khách hàng đã mua hàng & thanh toán trực tuyến thành công nhưng dư tiền, hoặc trả
                  sản phẩm, Kha mobile sẽ hoàn tiền vào thẻ quý khách đã dùng để thanh toán, theo thời hạn như sau:
                </p>
                <ul>
                  <li>
                    Đối với thẻ ATM: Thời gian khách hàng nhận được tiền hoàn từ 7 – 10 ngày (trừ Thứ 7, Chủ Nhật và
                    Ngày lễ) kể từ khi Khamobile nhận được đề nghị của khách hàng. Nếu qua thời gian trên không nhận
                    được tiền, Khamobile sẽ hỗ trợ liên hệ ngân hàng của khách hàng để giải quyết.
                  </li>
                  <li>
                    Đối với thẻ Visa/Master card/JCB: Thời gian khách hàng nhận được tiền hoàn từ 7-15 ngày làm việc kể
                    từ khi Khanmobile nhận được đề nghị của khách hàng. Nếu qua thời gian trên không nhận được tiền,
                    khách hàng liên hệ ngân hàng để giải quyết.
                  </li>
                </ul>
              </Panel>
            </PanelGroup>
          </div>
        </div>
      </CardBlock>
    </>
  )
}

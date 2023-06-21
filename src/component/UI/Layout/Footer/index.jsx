import MessageIcon from '@rsuite/icons/Message'
import PhoneIcon from '@rsuite/icons/Phone'
import BCT from 'assets/img/bct.png'
import LOGO from 'assets/img/logo.png'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { BsCashCoin, BsTelephoneFill } from 'react-icons/bs'
import { FaCcJcb, FaCcPaypal, FaCcStripe, FaCcVisa } from 'react-icons/fa'
import { FcIphone } from 'react-icons/fc'
import { IconButton, Panel } from 'rsuite'
import styles from './styles.module.scss'
import { useRouter } from 'next/router'
export default function Footer() {
  const [expand, setExpand] = useState(false)
  const router = useRouter()
  useEffect(() => {
    if (window.FB) {
      window.FB.XFBML.parse()
    }
  }, [])
  return (
    <div className="container-fluid border-top mt-4">
      <div id="fb-root"></div>

      <div className={styles.contact}>
        <div className={clsx(styles.activeExpand)}>
          <a className={styles.contactItem} href="tel:+84777999966">
            <div className={styles.icon}>
              <FcIphone />
            </div>
          </a>
          <a className={styles.contactItem} href="https://zalo.me/0777999966" target="_blank">
            <div className={styles.icon}>
              <img src="/zalo-icon.png" />
            </div>
          </a>

          <a className={styles.contactItem} href="https://www.messenger.com/t/104893688607812" target="_blank">
            <div className={styles.icon}>
              <img src="/messenger-icon.webp" />
            </div>
          </a>
        </div>
      </div>

      <div className="row p-0">
        <div className="col-12 p-0">
          <div className="container p-0">
            <div className="row p-2 py-4 gy-4">
              <div className="col-12 col-lg-2 col-md-4 col-sm-12">
                <Panel onClick={() => router.push('/')}>
                  <Image src={LOGO} alt="Kha mobile" priority />
                </Panel>
              </div>
              <div className="col-12 col-lg-2 col-md-4 col-sm-6">
                <ul className={styles.listLink}>
                  <h6>Thông tin</h6>
                  <Link href="/chinh-sach" passHref>
                    <li>
                      <a>Chính sách</a>
                    </li>
                  </Link>
                  {/* <Link href="/chinh-sach" passHref>
                    <li>
                      <a>Liên hệ</a>
                    </li>
                  </Link> */}
                </ul>
              </div>
              <div className="col-12 col-lg-3  col-md-4 col-sm-6">
                <ul className={styles.listLink}>
                  <h6>Địa chỉ liên hệ</h6>
                  <li>
                    <IconButton icon={<MessageIcon />} appearance="subtle" />
                    <span>
                      <a href="https://goo.gl/maps/SZuQkWvbjciy9pyp6" target="_blank">
                        220/9A, Đường Xô Viết Nghệ Tĩnh, Phường 21, Bình Thạnh, Hồ Chí Minh
                      </a>
                    </span>
                  </li>
                  <li>
                    <IconButton icon={<PhoneIcon />} appearance="subtle" />
                    <span>
                      <a href="tel:+0777999966">0777 9999 66</a>
                    </span>
                  </li>
                  <li>
                    <IconButton icon={<MessageIcon />} appearance="subtle" />
                    <span>
                      <a href="mailto:kha44mobile@gmail.com">kha44mobile@gmail.com</a>
                    </span>
                  </li>
                </ul>
              </div>
              <div className="col-12 col-lg-2 col-md-6 col-sm-6">
                <ul className={styles.listLink}>
                  <li className={styles.bct}>
                    <Image src={BCT} alt="Kha mobile" priority width={200} height={77} />
                  </li>
                  <li>Hộ kinh doanh Kha Mobile - www.khamobile.vn</li>
                  <li>Giấy chứng nhận ĐKKD số 41O8041012 do UBND quận Bình Thạnh cấp ngày 07/08/2020</li>
                </ul>
              </div>
              <div className="col-12 col-lg-3  col-md-6 col-sm-6 text-center">
                <div
                  className="fb-page"
                  data-href="https://www.facebook.com/Kha44Mobile/"
                  data-tabs="timeline"
                  data-width=""
                  data-height="250"
                  data-small-header="true"
                  data-adapt-container-width="true"
                  data-hide-cover="false"
                  data-show-facepile="true"
                >
                  <blockquote cite="https://www.facebook.com/Kha44Mobile/" className="fb-xfbml-parse-ignore">
                    <a href="https://www.facebook.com/Kha44Mobile/">Kha Mobile - Giá tốt mỗi ngày</a>
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 py-2" style={{ background: 'var(--rs-red-900)' }}>
          <div className="container p-0">
            <div
              className={clsx(
                'd-flex flex-row justify-content-between align-items-center flex-wrap',
                styles.copyRightWrapper,
              )}
            >
              <div className={clsx('text-light', styles.copyRight)}>
                © {new Date().getFullYear()}{' '}
                <a href="https://truyenmai.com" target="_blank" style={{ textDecoration: 'none', color: '#fff' }}>
                  Truyen Mai
                </a>{' '}
                & Kha Mobile.
              </div>
              <div className={clsx('payment-icons d-flex flex-row', styles.payment)} style={{ gap: 8 }}>
                <IconButton
                  className="px-2 py-1"
                  icon={<FaCcVisa />}
                  appearance="subtle"
                  size="md"
                  style={{ fontSize: 16 }}
                />
                <IconButton
                  className="px-2 py-1"
                  icon={<FaCcPaypal />}
                  appearance="subtle"
                  size="md"
                  style={{ fontSize: 16 }}
                />
                <IconButton
                  className="px-2 py-1"
                  icon={<FaCcStripe />}
                  appearance="subtle"
                  size="md"
                  style={{ fontSize: 16 }}
                />
                <IconButton
                  className="px-2 py-1"
                  icon={<FaCcJcb />}
                  appearance="subtle"
                  size="md"
                  style={{ fontSize: 16 }}
                />
                <IconButton
                  className="px-2 py-1"
                  icon={<BsCashCoin />}
                  appearance="subtle"
                  size="md"
                  style={{ fontSize: 16 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

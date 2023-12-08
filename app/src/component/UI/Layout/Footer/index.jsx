import MessageIcon from '@rsuite/icons/Message'
import PhoneIcon from '@rsuite/icons/Phone'
import BCT from 'assets/img/bct.png'
import LOGO from 'assets/img/logo.png'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { BsCashCoin } from 'react-icons/bs'
import { FaCcJcb, FaCcPaypal, FaCcStripe, FaCcVisa } from 'react-icons/fa'
import { FcIphone } from 'react-icons/fc'
import { IconButton } from 'rsuite'
import styles from './styles.module.scss'
export default function Footer() {
  useEffect(() => {
    if (window.FB) {
      window.FB.XFBML.parse()
    }
  }, [])
  return (
    <div className="container max-w-[100vw] border-t-1 mt-4">
      <div id="fb-root"></div>

      <div className={styles.contact}>
        <div className={clsx(styles.activeExpand)}>
          <a className={styles.contactItem} href="tel:+84777999966">
            <div className={styles.icon}>
              <FcIphone />
            </div>
          </a>
          <a className={clsx(styles.contactItem)} href="https://zalo.me/0777999966" target="_blank">
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

      <div className="grid grid-span-12 p-0 border-t">
        <div className="col-span-12 px-4">
          <div className="container p-0 mx-auto">
            <div className="grid grid-cols-12 p-2 gap-4">
              <div className="col-span-12 lg:col-span-2 md:col-span-4 sm:col-span-12">
                <Link href="/">
                  <Image src={LOGO} alt="Kha mobile" priority />
                </Link>
              </div>
              <div className="col-span-12 lg:col-span-2 md:col-span-4 sm:col-span-6">
                <ul className={styles.listLink}>
                  <h6>Thông tin</h6>
                  <Link href="/chinh-sach" passHref>
                    <li>Chính sách</li>
                  </Link>
                </ul>
              </div>
              <div className="col-span-12 lg:col-span-2 md:col-span-4 sm:col-span-6">
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
              <div className="col-span-12 lg:col-span-2 md:col-span-6 sm:col-span-6">
                <ul className={styles.listLink}>
                  <li className={styles.bct}>
                    <Image src={BCT} alt="Kha mobile" priority width={200} height={77} />
                  </li>
                  <li>Hộ kinh doanh Kha Mobile - www.khamobile.vn</li>
                  <li>Giấy chứng nhận ĐKKD số 41O8041012 do UBND quận Bình Thạnh cấp ngày 07/08/2020</li>
                </ul>
              </div>
              <div className="col-span-12 lg:col-span-3  md:col-span-6 sm:col-span-6 text-center">
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

        <div className="col-span-12 py-2" style={{ background: 'var(--rs-red-900)' }}>
          <div className="container mx-auto p-0">
            <div className={clsx('flex flex-row justify-between items-center flex-wrap', styles.copyRightWrapper)}>
              <div className={clsx('text-[#ccc]', styles.copyRight)}>
                © {new Date().getFullYear()}{' '}
                <a href="https://truyenmai.com" target="_blank" style={{ textDecoration: 'none', color: '#fff' }}>
                  Truyen Mai
                </a>{' '}
                & Kha Mobile.
              </div>
              <div className={clsx('payment-icons flex flex-row', styles.payment)} style={{ gap: 8 }}>
                <IconButton
                  className="px-2 py-1 bg-blue-500 shadow-lg shadow-blue-500/50 "
                  icon={<FaCcVisa />}
                  appearance="primary"
                  size="md"
                  style={{ fontSize: 16 }}
                />
                <IconButton
                className="px-2 py-1 bg-blue-500 shadow-lg shadow-blue-500/50 "
                  icon={<FaCcPaypal />}
                  appearance="primary"
                  size="md"
                  style={{ fontSize: 16 }}
                />
                <IconButton
                className="px-2 py-1 bg-blue-500 shadow-lg shadow-blue-500/50 "
                  icon={<FaCcStripe />}
                  appearance="primary"
                  size="md"
                  style={{ fontSize: 16 }}
                />
                <IconButton
                className="px-2 py-1 bg-blue-500 shadow-lg shadow-blue-500/50 "
                  icon={<FaCcJcb />}
                  appearance="primary"
                  size="md"
                  style={{ fontSize: 16 }}
                />
                <IconButton
                className="px-2 py-1 bg-blue-500 shadow-lg shadow-blue-500/50 "
                  icon={<BsCashCoin />}
                  appearance="primary"
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

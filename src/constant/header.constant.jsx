import DeviceOtherIcon from '@rsuite/icons/DeviceOther'
import GridIcon from '@rsuite/icons/Grid'
import AlignRightIcon from '@rsuite/icons/legacy/AlignRight'
import HomeIcon from '@rsuite/icons/legacy/Home'
import ListIcon from '@rsuite/icons/List'
import MobileIcon from '@rsuite/icons/Mobile'
import PcIcon from '@rsuite/icons/Pc'
import PeoplesIcon from '@rsuite/icons/Peoples'
import TextImageIcon from '@rsuite/icons/TextImage'

const HEADER_MENU = [
  {
    path: '/',
    label: 'Trang chủ',
    icon: <HomeIcon />,
  },
  {
    path: '/about-us',
    label: 'Về chúng tôi',
    icon: <PeoplesIcon />,
  },
  {
    path: '/product',
    label: 'Sản phẩm',
    icon: <PcIcon />,
    subMenu: true,
  },
  {
    path: '/tin-tuc',
    label: 'Tin tức',
    icon: <TextImageIcon />,
  },
]

export { HEADER_MENU }

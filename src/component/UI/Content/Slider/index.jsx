import { TYPE_CAROUSEL } from 'src/constant/carousel.constant'
import MutiItem from './MutiItem'

const CustomSlider = (props) => {
  switch (props.type) {
    case TYPE_CAROUSEL.MUTI:
      return <MutiItem {...props}>{props.children}</MutiItem>
    case TYPE_CAROUSEL.SING:
      return <SingleSlider {...props}>{props.children}</SingleSlider>
  }
}

export default CustomSlider

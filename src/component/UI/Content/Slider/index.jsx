import { TYPE_CAROUSEL } from 'src/constant/carousel.constant';
import MutiItem from './MutiItem';

const CustomSlider = (props) => {
	// return null;

	switch (props.type) {
		case TYPE_CAROUSEL.MUTI:
			return <MutiItem {...props}>{props.children}</MutiItem>;
	}
};

export default CustomSlider;

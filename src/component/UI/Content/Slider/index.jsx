import MutiItem from './MutiItem';

const CustomSlider = ({ type, ...props }) => {
	// return null;

	switch (type) {
		case 'muti':
			return <MutiItem>{props.children}</MutiItem>;
	}
};

export default CustomSlider;

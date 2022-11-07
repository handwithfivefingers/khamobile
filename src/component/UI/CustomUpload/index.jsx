import React from 'react';
import { Uploader } from 'rsuite';
import AvatarIcon from '@rsuite/icons/legacy/Avatar';
function previewFile(file, callback) {
	const reader = new FileReader();
	reader.onloadend = () => {
		callback(reader.result);
	};
	reader.readAsDataURL(file);
}
const CustomUpload = React.forwardRef((props, ref) => {
	const [uploading, setUploading] = React.useState(false);
	const [fileInfo, setFileInfo] = React.useState(null);

	React.useEffect(() => {
		if (props.file) {
			props.file?.[0]?.blobFile &&
				previewFile(props.file?.[0]?.blobFile, (value) => {
					setFileInfo(value);
				});
		}
	}, [props.file]);

	return (
		<Uploader ref={ref} fileListVisible={false} name='upload' {...props}>
			<button style={{ width: 150, height: 150 }}>
				{uploading && <Loader backdrop center />}
				{fileInfo ? <img src={fileInfo} width='100%' height='100%' /> : <AvatarIcon style={{ fontSize: 80 }} />}
			</button>
		</Uploader>
	);
});

export default CustomUpload;

import React, { useState, forwardRef, useEffect } from 'react';
import { Uploader } from 'rsuite';
import AvatarIcon from '@rsuite/icons/legacy/Avatar';
function previewFile(file, callback) {
	const reader = new FileReader();
	reader.onloadend = () => {
		callback(reader.result);
	};
	reader.readAsDataURL(file);
}
const CustomUpload = forwardRef((props, ref) => {
	const [uploading, setUploading] = useState(false);
	const [fileInfo, setFileInfo] = useState(null);
	const [fileList, setFileList] = useState([]);
	useEffect(() => {
		if (props.file) {
			if (props.file[0]) {
				if (props.file?.[0]?.blobFile) {
					previewFile(props.file?.[0]?.blobFile, (value) => {
						setFileInfo(value);
					});
				} else {
					setFileInfo(`/public/${props.file[0]?.filename}`);
				}
			}
		}
	}, [props.file]);

	return (
		<>
			{props?.group ? (
				<Uploader
					ref={ref}
					name='upload'
					{...props}
					listType='picture-text'
					fileList={fileList}
					renderFileInfo={(file, fileElement) => {
						return (
							<>
								<span>File Name: {file.name}</span>
								<p>File URL: {file.url}</p>
							</>
						);
					}}
				>
				
				</Uploader>
			) : (
				<Uploader ref={ref} fileListVisible={false} name='upload' {...props}>
					<button style={{ width: 150, height: 150 }}>
						{uploading && <Loader backdrop center />}
						{fileInfo ? <img src={fileInfo} width='100%' height='100%' /> : <AvatarIcon style={{ fontSize: 80 }} />}
					</button>
				</Uploader>
			)}
		</>
	);
});

export default CustomUpload;

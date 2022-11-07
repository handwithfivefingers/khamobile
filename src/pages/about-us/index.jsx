import CommonLayout from 'component/UI/Layout';
import { useState } from 'react';

export default function AboutUs() {
	const [enabled, setEnabled] = useState(true);
	const [json, setJson] = useState(null);

	return <div>AboutUs</div>;
}
AboutUs.Layout = CommonLayout;

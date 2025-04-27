import { useEffect, useState } from 'react';
import { IData } from '../../Types/data.type';
import { fetchData, sortDataEvents } from '../../Services/getData.services';
import Dates from '../../Components/Dates';
import Loader from '../../Components/Loader';

const App = () => {
	const [data, setData] = useState<IData[]>([]);

	useEffect(() => {
		const loadData = async () => {
			const fetchedData = await fetchData();
			sortDataEvents(fetchedData);
			setData(fetchedData);
		};
		loadData();
	}, []);

	if (data.length === 0) {
		return <Loader />;
	} else {
		return (
			<div className='container'>
				<Dates data={data} />
			</div>
		);
	}
};

export default App;

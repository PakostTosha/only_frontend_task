import { IData } from '../Types/data.type';

// Имитация запроса получения данных с сервера
export const fetchData = async (): Promise<IData[]> => {
	try {
		const response = await fetch('http://localhost:3000/data.json');
		if (!response.ok) {
			throw new Error(`Ошибка HTTP: ${response.status}`);
		}
		const data: IData[] = await response.json();
		return data;
	} catch (err) {
		console.error('Ошибка при загрузке данных:', err);
		return [];
	}
};

// Сортировка событий каждой секции по годам (мутация переданного массива)
export const sortDataEvents = (data: IData[]) => {
	data.forEach((section) => {
		section.events.sort((a, b) => a.year - b.year);
	});
};

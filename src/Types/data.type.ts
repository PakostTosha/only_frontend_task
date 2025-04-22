export interface DatesProps {
	data: IData[];
}

export interface IData {
	section: string;
	id: number;
	events: IEvent[];
}

export interface IEvent {
	year: number;
	content: string;
}

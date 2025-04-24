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

export type TypeCircleParams = [
	centerX: number,
	centerY: number,
	radius: number
];

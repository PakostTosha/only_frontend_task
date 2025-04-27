import gsap from 'gsap';
import { IData, TypeCircleParams } from '../Types/data.type';
import { SwiperRef } from 'swiper/react';

// Расчёт координат точек
export const getPointsCoordinates = (
	pointsCount: number,
	startX: number,
	startY: number,
	r: number,
	angleDeg: number = 0
): number[][] => {
	// массив координат точек
	const pointsCoordinatesArr: number[][] = [];
	for (let i = 0; i < pointsCount; i++) {
		// "+"" для движения по часовой, "-" против часовой стрелки
		const rotationRad = (angleDeg * Math.PI) / 180;
		const endX =
			startX + r * Math.cos(((Math.PI * 2) / pointsCount) * i + rotationRad);
		const endY =
			startY + r * Math.sin(((Math.PI * 2) / pointsCount) * i + rotationRad);
		pointsCoordinatesArr.push([endX, endY]);
	}
	return pointsCoordinatesArr;
};

// Функция для установки точек в координаты без анимации
export const setPointsPosition = (pointsCoord: number[][]): void => {
	pointsCoord.forEach((point, index) => {
		gsap.set(`.culture-trends__item-${index}`, {
			x: point[0],
			y: point[1],
		});
	});
};

// Вычисление необходимого изменения угла для цикличного поворота с наименьшим пройденным расстоянием
export const getDeltaAngle = (
	sectionsCount: number,
	prevId: number,
	newId: number
): number => {
	// Разница между текущим и предыдущим индексом
	let diff = newId - prevId;
	// Приводим разницу к диапазону [-sectionsCount/2, sectionsCount/2]
	if (diff > sectionsCount / 2) {
		diff -= sectionsCount;
	} else if (diff < -sectionsCount / 2) {
		diff += sectionsCount;
	}
	// Вычисляем угол поворота
	const stepAngle = 360 / sectionsCount;
	const angleChange = diff * stepAngle;
	return angleChange;
};

// Рассчёт нового угла поворота
export const getNewRotationAngle = (
	rotationAngle: React.RefObject<{
		angle: number;
	}>,
	data: IData[],
	prevSelectedSectionId: React.RefObject<number>,
	selectedSectionId: number
): number =>
	rotationAngle.current.angle -
	getDeltaAngle(data.length, prevSelectedSectionId.current, selectedSectionId);

// Ради чистоты эксперимента вынесем функции из хука
// Определение функции в переданных условиях переключения секции
export const handleSectionSwitchSetOnComplete = (
	value: boolean | number,
	selectedSectionId: number,
	setSelectedSectionId: (value: number) => void,
	data: IData[]
): void => {
	// Обрабатываем переключение секции (toggle или номер секции), устанавливаем функцию
	switch (typeof value) {
		case 'boolean':
			if (selectedSectionId >= 0 && selectedSectionId < data.length) {
				return value
					? setSelectedSectionId(selectedSectionId + 1)
					: setSelectedSectionId(selectedSectionId - 1);
			} else {
				console.error('Ошибка в переключении секции');
				return;
			}
		case 'number':
			return setSelectedSectionId(value);
	}
};

// Функции ниже вынесены из хука useDatesAnimations в основном для соблюдение принципа единой ответственности, в принципе можно было обойтись и без этого

// Скрытие элементов
export const hideElements = (
	elements: (HTMLSpanElement | SwiperRef | null)[],
	onCompleteFunction: () => void
) =>
	gsap.to(elements, {
		opacity: 0,
		duration: 0.4,
		ease: 'power1.out',
		onComplete: onCompleteFunction,
	});

// Отображение спрятанных элементов
export const showElements = (
	elements: (HTMLSpanElement | SwiperRef | null)[]
) =>
	gsap.to(elements, {
		opacity: 1,
		duration: 0.4,
		ease: 'power1.out',
	});

// Анимация заголовка
export const sectionYearsRefAnimation = (
	yearsRef: React.RefObject<{
		startYear: number;
		endYear: number;
	}>,
	startYear: number,
	endYear: number,
	setYears: (
		newState: React.SetStateAction<{
			startYear: number;
			endYear: number;
		}>
	) => void
) =>
	gsap.to(yearsRef.current, {
		startYear: startYear,
		endYear: endYear,
		duration: 0.8,
		ease: 'power1.inOut',
		onUpdate: () => {
			setYears({
				startYear: Math.round(yearsRef.current.startYear),
				endYear: Math.round(yearsRef.current.endYear),
			});
		},
		onComplete: () => {
			yearsRef.current.startYear = startYear;
			yearsRef.current.endYear = endYear;
		},
	});

// Анимация поворот секций
export const rotationAnimation = (
	rotationAngle: React.RefObject<{
		angle: number;
	}>,
	newRotationAngle: number,
	data: IData[],
	initCircleParams: TypeCircleParams,
	prevSelectedSectionId: React.RefObject<number>,
	selectedSectionId: number
) =>
	gsap.to(rotationAngle.current, {
		angle: newRotationAngle,
		yoyo: true,
		duration: 0.8,
		ease: 'power1.inOut',
		onUpdate: () => {
			setPointsPosition(
				getPointsCoordinates(
					data.length,
					...initCircleParams,
					rotationAngle.current.angle
				)
			);
		},
		onComplete: () => {
			rotationAngle.current.angle = newRotationAngle;
			prevSelectedSectionId.current = selectedSectionId;
		},
	});

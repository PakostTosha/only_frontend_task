import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
	getNewRotationAngle,
	getPointsCoordinates,
	handleSectionSwitchSetOnComplete,
	hideElements,
	rotationAnimation,
	sectionYearsRefAnimation,
	setPointsPosition,
	showElements,
} from '../Services/points.services';
import { IData, TypeCircleParams } from '../Types/data.type';
import { SwiperRef } from 'swiper/react';

// Регистрация плагина GSAP
gsap.registerPlugin(useGSAP);

// Начальные параметры окружности
const initCircleParams: TypeCircleParams = [-23, -23, 265];
// Смещение секций на 60 градусов (против часовой)
const initRotationAngle: number = -60;

export const useDatesAnimations = (data: IData[]) => {
	// Текущая секция
	const [selectedSectionId, setSelectedSectionId] = useState<number>(0);
	// Числа заголовка
	const [years, setYears] = useState<{
		startYear: number;
		endYear: number;
	}>({
		startYear: data[selectedSectionId].events[0].year,
		endYear:
			data[selectedSectionId].events[
				data[selectedSectionId].events.length - 1
			].year,
	});

	// Ссылки на компоненты и переменные
	const swiperRef = useRef<SwiperRef | null>(null);
	const sectionYearsRef = useRef<{ startYear: number; endYear: number }>(
		years
	);
	const descriptionsRefs = useRef<(HTMLSpanElement | null)[]>([]);
	const sectionNameMobileRef = useRef<HTMLHeadingElement>(null);
	const rotationAngle = useRef<{ angle: number }>({
		angle: initRotationAngle - (360 / data.length) * selectedSectionId,
	});
	const prevSelectedSectionId = useRef<number>(selectedSectionId);

	// Таймлайн для анимации
	const tl = gsap.timeline();

	// Встроенный хук для оптимизации анимации
	useGSAP(() => {
		// Первый рендер (угол посчитан сразу при указании ссылки)
		if (prevSelectedSectionId.current === selectedSectionId) {
			// Получение координат точек
			const pointsCoordinates = getPointsCoordinates(
				data.length,
				...initCircleParams,
				rotationAngle.current.angle
			);
			// Расположение точек по координатам
			setPointsPosition(pointsCoordinates);
			// Показать описание активной секции
			gsap.set(descriptionsRefs.current[selectedSectionId], {
				opacity: 1,
			});
			// Прерывание дальнейшего блока кода
			return;
		}

		// При ререндере компонента
		const newRotationAngle = getNewRotationAngle(
			rotationAngle,
			data,
			prevSelectedSectionId,
			selectedSectionId
		);
		// Расчёт нового периода секции
		const newStateYears = {
			startYear: data[selectedSectionId].events[0].year,
			endYear:
				data[selectedSectionId].events[
					data[selectedSectionId].events.length - 1
				].year,
		};

		// Добавляем анимации в таймлайн
		// 1) hideElements - добавляется при обработке переключения секций
		// 2) rotationAnimation
		tl.add(
			rotationAnimation(
				rotationAngle,
				newRotationAngle,
				data,
				initCircleParams,
				prevSelectedSectionId,
				selectedSectionId
			),
			'>'
		);
		// 3) sectionYearsRefAnimation
		tl.add(
			sectionYearsRefAnimation(
				sectionYearsRef,
				newStateYears.startYear,
				newStateYears.endYear,
				setYears
			),
			'<'
		);
		// 4) showElements
		tl.add(
			showElements([
				descriptionsRefs.current[selectedSectionId],
				swiperRef.current,
				sectionNameMobileRef.current,
			]),
			'>'
		);
	}, [selectedSectionId, data.length]);

	// Обработчик переключения секций (кнопка или нажатие на номер секции)
	const handleSectionSwitch = (value: boolean | number) =>
		tl.add(
			hideElements(
				[
					descriptionsRefs.current[selectedSectionId],
					swiperRef.current,
					sectionNameMobileRef.current,
				],
				() =>
					handleSectionSwitchSetOnComplete(
						value,
						selectedSectionId,
						setSelectedSectionId,
						data
					)
			),
			0
		);

	return {
		selectedSectionId,
		years,
		swiperRef,
		sectionYearsRef,
		descriptionsRefs,
		sectionNameMobileRef,
		rotationAngle,
		setSelectedSectionId,
		handleSectionSwitch,
		setYears,
	};
};

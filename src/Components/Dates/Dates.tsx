import { FC, useRef, useState } from 'react';
import { DatesProps, TypeCircleParams } from '../../Types/data.type';
// Изображения
import arrowPrev from '../../Assets/Images/arrow-prev.svg';
import arrowNext from '../../Assets/Images/arrow-next.svg';
// Слайдер
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
// Анимация
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
	getDeltaAngle,
	getPointsCoordinates,
	setPointsPosition,
} from '../../Services/points.services';

gsap.registerPlugin(useGSAP);
// Начальные параметры окружности
const initCircleParams: TypeCircleParams = [-23, -23, 265];
// Смещение секций на 60 градусов (против часовой)
const initRotationAngle: number = -60;

const Dates: FC<DatesProps> = ({ data }) => {
	// Выбранная секция (по умолчанию - первая секция)
	const [selectedSectionId, setSelectedSectionId] = useState<number>(0);
	// Заголовок с периодом
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
	const swiperRef = useRef(null);
	const sectionYears = useRef(years);
	const descriptionsRefs = useRef<(HTMLSpanElement | null)[]>([]);
	const rotationAngle = useRef({
		angle: initRotationAngle - (360 / data.length) * selectedSectionId,
	});
	const prevSelectedSectionId = useRef(selectedSectionId);

	// Интегрируем таймлайн для анимации
	// animations:
	// 	1) = hideElements(hideDescription + hideSwiper) - duration: 0.4,
	// 	2) = rotationAnimation + sectionYearsAnimation - duration: 0.8
	// 	3) = showElements(showDescription + showSwiper) - duration: 0.4
	const tl = gsap.timeline();

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
			gsap.set(descriptionsRefs.current[selectedSectionId], { opacity: 1 });
			// Прерывание дальнейшего блока кода
			return;
		}

		// При ререндере компонента
		// Расчёт нового угла поворота
		const newRotationAngle =
			rotationAngle.current.angle -
			getDeltaAngle(
				data.length,
				prevSelectedSectionId.current,
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

		// Подготавливаем анимации
		// Поворот секций
		const rotationAnimation = () =>
			gsap.to(rotationAngle.current, {
				angle: newRotationAngle,
				// ! надо ли?
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
		// Анимация заголовка
		const sectionYearsAnimation = () =>
			gsap.to(sectionYears.current, {
				startYear: newStateYears.startYear,
				endYear: newStateYears.endYear,
				duration: 0.8,
				ease: 'power1.inOut',
				onUpdate: () => {
					setYears({
						startYear: Math.round(sectionYears.current.startYear),
						endYear: Math.round(sectionYears.current.endYear),
					});
				},
				onComplete: () => {
					sectionYears.current.startYear = newStateYears.startYear;
					sectionYears.current.endYear = newStateYears.endYear;
				},
			});
		// Отображение спрятанных элементов
		const showElements = () =>
			gsap.to(
				[descriptionsRefs.current[selectedSectionId], swiperRef.current],
				{
					opacity: 1,
					duration: 0.4,
					ease: 'power1.out',
				}
			);

		// Добавляем анимации в таймлайн
		// tl.add(hideElements, 0); - добавлен в handleSectionSwitch
		tl.add(rotationAnimation(), '>');
		tl.add(sectionYearsAnimation(), '<');
		tl.add(showElements(), '>');
		//
	}, [selectedSectionId, data.length]);

	// Переключение секций
	const handleSectionSwitch = (value: boolean | number) => {
		// Назначение функции на конец анимации по умолчанию
		let onCompleteFunction: () => void = () =>
			console.error('Ошибка в переключении секции');
		// Обрабатываем переключение секции (toggle или номер секции), устанавливаем функцию
		switch (typeof value) {
			case 'boolean':
				if (selectedSectionId >= 0 && selectedSectionId < data.length) {
					onCompleteFunction = () => {
						value
							? setSelectedSectionId(selectedSectionId + 1)
							: setSelectedSectionId(selectedSectionId - 1);
					};
				} else console.error('Ошибка в переключении секции');
				break;
			case 'number':
				onCompleteFunction = () => setSelectedSectionId(value);
				break;
		}
		// Описываем анимацию, добавляем её в таймлайн
		const hideElements = () =>
			gsap.to(
				[descriptionsRefs.current[selectedSectionId], swiperRef.current],
				{
					opacity: 0,
					duration: 0.4,
					ease: 'power1.out',
					onComplete: onCompleteFunction,
				}
			);
		tl.add(hideElements(), 0);
	};

	return (
		<section className='dates'>
			<h1 className='dates__title'>Исторические даты</h1>
			<div className='dates__sections sections'>
				<div className='sections__years'>
					<h2 className='sections__years_start'>
						{years.startYear}&nbsp;
					</h2>
					<h2 className='sections__years_end'>
						&nbsp;
						{years.endYear}
					</h2>
				</div>
				<div className='sections__list culture-trends'>
					<ul className='culture-trends__list'>
						{data.map((item, index) => (
							<li
								key={index}
								className={`culture-trends__item ${
									index === selectedSectionId
										? 'culture-trends__item_selected '
										: ''
								}culture-trends__item-${index}`}
								onClick={() => {
									if (index !== selectedSectionId) {
										handleSectionSwitch(index);
									}
								}}
							>
								<p className='culture-trends__number'>{index + 1}</p>
								<span
									className='culture-trends__description'
									ref={(el) => {
										descriptionsRefs.current[index] = el;
									}}
								>
									{item.section}
								</span>
							</li>
						))}
					</ul>
				</div>
				<div className='sections__toggle toggle'>
					<p className='toggle__section-number'>
						{/* Приводим к виду 01/06, 10/15, 103/150 */}
						{selectedSectionId < 10
							? `0${selectedSectionId + 1}`
							: `${selectedSectionId + 1}`}
						/{data.length > 9 ? data.length : `0${data.length}`}
					</p>
					{/* Переключение выбранной секции */}
					<div className='toggle__controllers'>
						<button
							type='button'
							className={`toggle__button toggle__button_prev ${
								selectedSectionId === 0 ? 'toggle__button_disabled' : ''
							}`}
							onClick={() => {
								handleSectionSwitch(false);
							}}
							disabled={selectedSectionId === 0}
						>
							<img src={arrowPrev} alt='Назад' />
						</button>
						<button
							type='button'
							className={`toggle__button toggle__button_next ${
								selectedSectionId + 1 === data.length
									? 'toggle__button_disabled'
									: ''
							}`}
							onClick={() => {
								handleSectionSwitch(true);
							}}
							disabled={selectedSectionId === data.length - 1}
						>
							<img src={arrowNext} alt='Вперёд' />
						</button>
					</div>
				</div>
				<Swiper
					modules={[Navigation, Mousewheel]}
					navigation={{
						nextEl: '.swiper-button-next',
						prevEl: '.swiper-button-prev',
						disabledClass: 'swiper-button-disabled',
					}}
					mousewheel={true}
					spaceBetween={80}
					slidesPerView={3}
					ref={swiperRef}
					className='sections__events events'
				>
					{data[selectedSectionId].events.map((item, index) => (
						<SwiperSlide key={index} className='events__item'>
							<h3 className='events__title'>{item.year}</h3>
							<p className='events__descriptions'>{item.content}</p>
						</SwiperSlide>
					))}
					<div className='swiper-button swiper-button-next'></div>
					<div className='swiper-button swiper-button-prev'></div>
				</Swiper>
				{/* Пагинация по секциям для мобильной версии */}
				<div className='sections__pagination pagination'>
					{data.map((item, index) => (
						<div
							key={index}
							className={`pagination__item ${
								index === selectedSectionId
									? 'pagination__item-active'
									: ''
							}`}
							onClick={() => {
								if (index !== selectedSectionId) {
									handleSectionSwitch(index);
								}
							}}
						></div>
					))}
				</div>
			</div>
			<div className='dates__decoration_vertical-line'></div>
			<div className='dates__decoration_horizontal-line'></div>
		</section>
	);
};

export default Dates;

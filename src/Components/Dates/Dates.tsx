import { FC, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { DatesProps } from '../../Types/data.type';
import arrowPrev from '../../Assets/Images/arrow-prev.svg';
import arrowNext from '../../Assets/Images/arrow-next.svg';
// Слайдер
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
// Анимация
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { getPointsCoordinates } from '../../Services/points.services';

gsap.registerPlugin(useGSAP);

const Dates: FC<DatesProps> = ({ data }) => {
	// Выбранная секция (по умолчанию - первая секция)
	const [selectedSectionId, setSelectedSectionId] = useState<number>(0);

	// Переключение секций
	const handleSectionClick = (increase: boolean) => {
		if (increase) {
			if (selectedSectionId < data.length - 1) {
				setSelectedSectionId(selectedSectionId + 1);
			} else return;
		} else {
			if (selectedSectionId > 0) {
				setSelectedSectionId(selectedSectionId - 1);
			} else return;
		}
	};

	const swiperRef = useRef(null);

	// useGSAP(() => {
	// 	const pointsCoord = getPointsCoordinates(
	// 		data.length,
	// 		-8,
	// 		-8,
	// 		265,
	// 		(360 / data.length) * (selectedSectionId + 1)
	// 	);
	// 	pointsCoord.forEach((point, index) => {
	// 		// Начальное положение точек
	// 		gsap.to(`.culture-trends__item-${index}`, {
	// 			x: point[0],
	// 			y: point[1],
	// 		});
	// 	});
	// }, [selectedSectionId]);

	const rotation = useRef({ angle: 0 });
	const prevSelectedSectionId = useRef(selectedSectionId);

	useEffect(() => {
		const pointsCount = data.length;
		const centerX = -23;
		const centerY = -23;
		const radius = 265;

		// Функция для установки точек в координаты без анимации
		const setPointsPosition = (angle: number) => {
			const pointsCoord = getPointsCoordinates(
				pointsCount,
				centerX,
				centerY,
				radius,
				angle
			);
			pointsCoord.forEach((point, index) => {
				gsap.set(`.culture-trends__item-${index}`, {
					x: point[0],
					y: point[1],
				});
			});
		};

		// При первом рендере (или когда prevSelectedSectionId === selectedSectionId)
		if (prevSelectedSectionId.current === selectedSectionId) {
			// Устанавливаем точки сразу в нужную позицию
			const initialAngle = (360 / pointsCount) * (selectedSectionId + 1);
			rotation.current.angle = initialAngle;
			setPointsPosition(initialAngle);
			return;
		}

		// Определяем направление вращения
		const prevId = prevSelectedSectionId.current;
		const currId = selectedSectionId;
		const pointsPerFullRotation = pointsCount;

		// Угол для текущего и предыдущего selectedSectionId
		const prevAngle = (360 / pointsPerFullRotation) * (prevId + 1);
		const currAngle = (360 / pointsPerFullRotation) * (currId + 1);

		// Вычисляем разницу углов с учётом направления
		// Если selectedSectionId увеличился, вращаем против часовой стрелки (angle уменьшается)
		// Если уменьшился — по часовой стрелке (angle увеличивается)

		let targetAngle;
		if (currId > prevId) {
			// Вращаем против часовой стрелки: уменьшаем угол
			// Чтобы анимация была плавной, можно учесть переход через 0
			targetAngle = rotation.current.angle + (currAngle - prevAngle);
		} else {
			// Вращаем по часовой стрелке: увеличиваем угол
			targetAngle = rotation.current.angle - (prevAngle - currAngle);
		}

		// Запускаем анимацию угла
		gsap.to(rotation.current, {
			angle: targetAngle,
			duration: 1,
			ease: 'power1.inOut',
			onUpdate: () => {
				setPointsPosition(rotation.current.angle);
			},
			onComplete: () => {
				// Обновляем текущий угол и prevSelectedSectionId
				rotation.current.angle = targetAngle;
				prevSelectedSectionId.current = currId;
			},
		});
	}, [selectedSectionId, data.length]);

	// useGSAP(() => {
	// 	const rotation = { angle: 0 };
	// 	gsap.to(rotation, {
	// 		angle: (360 / data.length) * (selectedSectionId + 1),
	// 		duration: 1,
	// 		ease: 'power1.inOut',
	// 		onUpdate: () => {
	// 			const pointsCoord = getPointsCoordinates(
	// 				data.length,
	// 				-8,
	// 				-8,
	// 				265,
	// 				rotation.angle
	// 			);
	// 			pointsCoord.forEach((point, index) => {
	// 				gsap.set(`.culture-trends__item-${index}`, {
	// 					x: point[0],
	// 					y: point[1],
	// 				});
	// 			});
	// 		},
	// 	});
	// }, [selectedSectionId]);

	return (
		<section className='dates'>
			<h1 className='dates__title'>
				Исторические <br /> даты
			</h1>
			<div className='dates__sections sections'>
				<div className='sections__years'>
					{/* Цифра анимируется от 5 до 9, проходя через каждую цифру. Т.е. 5, 6, 7, 8, 9 */}
					<h2 className='sections__years_start'>
						{data[selectedSectionId].events[0].year}&nbsp;
					</h2>
					<h2 className='sections__years_end'>
						&nbsp;
						{
							data[selectedSectionId].events[
								data[selectedSectionId].events.length - 1
							].year
						}
					</h2>
				</div>
				<div className='sections__list culture-trends'>
					<ul className='culture-trends__list'>
						{data.map((item, index) => (
							<li
								key={index}
								className={`culture-trends__item${
									index === selectedSectionId ? '_selected' : ''
								} culture-trends__item-${index}`}
							>
								<p className='culture-trends__number'>
									{/* <span className='culture-trends__number-content'> */}
									{index + 1}
									{/* </span> */}
								</p>
								<p className='culture-trends__description'>
									{item.section}
								</p>
							</li>
						))}
					</ul>
				</div>
				<div className='sections__toggle toggle'>
					<p className='toggle__section-number'>
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
								handleSectionClick(false);
							}}
						>
							<img src={arrowPrev} alt='Назад' />
						</button>
						<button
							type='button'
							className={`toggle__button toggle__button_next
								${selectedSectionId + 1 === data.length ? 'toggle__button_disabled' : ''}`}
							onClick={() => {
								handleSectionClick(true);
							}}
						>
							<img src={arrowNext} alt='Вперёд' />
						</button>
					</div>
				</div>
				<Swiper
					modules={[Navigation, Pagination, Mousewheel]}
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
				{/* дополнительный свайпер с пагинацией СЕКЦИЙ (от 0 до 6) для мобилок? */}
			</div>
			<div className='dates__decoration_vertical-line'></div>
			<div className='dates__decoration_horizontal-line'></div>
		</section>
	);
};

export default Dates;

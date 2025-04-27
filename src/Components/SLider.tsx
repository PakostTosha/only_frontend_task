import React, { FC } from 'react';
// Слайдер
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';
import { Navigation, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { IData } from '../Types/data.type';

interface ISliderProps {
	data: IData[];
	selectedSectionId: number;
	swiperRef: React.RefObject<SwiperRef | null>;
}

const Slider: FC<ISliderProps> = ({ data, selectedSectionId, swiperRef }) => {
	return (
		<div className='sections__events'>
			<Swiper
				modules={[Navigation, Mousewheel]}
				navigation={{
					nextEl: '.swiper-button-next',
					prevEl: '.swiper-button-prev',
					disabledClass: 'swiper-button-disabled',
				}}
				mousewheel={true}
				spaceBetween={25}
				slidesPerView={'auto'}
				ref={swiperRef}
				className='events'
			>
				{data[selectedSectionId].events.map((item, index) => (
					<SwiperSlide key={index} className='events__item'>
						<h3 className='events__title'>{item.year}</h3>
						<p className='events__descriptions'>{item.content}</p>
					</SwiperSlide>
				))}
			</Swiper>
			<div className='swiper-button swiper-button-next'></div>
			<div className='swiper-button swiper-button-prev'></div>
		</div>
	);
};

export default Slider;

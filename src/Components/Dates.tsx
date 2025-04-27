import { FC } from 'react';
import { DatesProps } from '../Types/data.type';
// Анимация
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
// Компоненты и хуки
import PaginationMobile from './PaginationMobile';
import Slider from './SLider';
import SectionToggleButton from './SectionToggleButton';
import SectionsList from './SectionsList';
import '../Hooks/useDatesAnimation';
import { useDatesAnimations } from '../Hooks/useDatesAnimation';

gsap.registerPlugin(useGSAP);

const Dates: FC<DatesProps> = ({ data }) => {
	const {
		selectedSectionId,
		years,
		swiperRef,
		descriptionsRefs,
		sectionNameMobileRef,
		handleSectionSwitch,
	} = useDatesAnimations(data);

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
					<SectionsList
						data={data}
						descriptionsRefs={descriptionsRefs}
						handleSectionSwitch={handleSectionSwitch}
						selectedSectionId={selectedSectionId}
					/>
				</div>
				<h3
					ref={sectionNameMobileRef}
					className='section__name section__name-mobile'
				>
					{data[selectedSectionId].section}&nbsp;
				</h3>
				<div className='sections__toggle toggle'>
					<p className='toggle__section-number'>
						{selectedSectionId < 10
							? `0${selectedSectionId + 1}`
							: `${selectedSectionId + 1}`}
						/{data.length > 9 ? data.length : `0${data.length}`}
					</p>
					<div className='toggle__controllers'>
						<SectionToggleButton
							data={data}
							selectedSectionId={selectedSectionId}
							handleSectionSwitch={handleSectionSwitch}
							className='toggle__button_prev'
						/>
						<SectionToggleButton
							data={data}
							selectedSectionId={selectedSectionId}
							handleSectionSwitch={handleSectionSwitch}
							className='toggle__button_next'
						/>
					</div>
				</div>
				<Slider
					data={data}
					selectedSectionId={selectedSectionId}
					swiperRef={swiperRef}
				/>
				<PaginationMobile
					data={data}
					selectedSectionId={selectedSectionId}
					handleSectionSwitch={handleSectionSwitch}
				/>
			</div>
			<div className='dates__decoration_vertical-line'></div>
			<div className='dates__decoration_horizontal-line'></div>
		</section>
	);
};

export default Dates;

import { FC } from 'react';
import { IPopularDatesComponentsProps } from '../Types/data.type';

interface ISectionsListProps extends IPopularDatesComponentsProps {
	descriptionsRefs: React.RefObject<(HTMLSpanElement | null)[]>;
}

const SectionsList: FC<ISectionsListProps> = ({
	data,
	selectedSectionId,
	handleSectionSwitch,
	descriptionsRefs,
}) => {
	return (
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
	);
};

export default SectionsList;

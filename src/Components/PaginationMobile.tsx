import { FC } from 'react';
import { IPopularDatesComponentsProps } from '../Types/data.type';

const PaginationMobile: FC<IPopularDatesComponentsProps> = ({
	data,
	selectedSectionId,
	handleSectionSwitch,
}) => {
	return (
		<div className='sections__pagination pagination'>
			{data.map((_, index) => (
				<div
					key={index}
					className={`pagination__item ${
						index === selectedSectionId ? 'pagination__item-active' : ''
					}`}
					onClick={() => {
						if (index !== selectedSectionId) {
							handleSectionSwitch(index);
						}
					}}
				></div>
			))}
		</div>
	);
};

export default PaginationMobile;

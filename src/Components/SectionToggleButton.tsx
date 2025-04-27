import { FC } from 'react';
// Изображения
import arrowPrev from '../Assets/Images/arrow-prev.svg';
import arrowNext from '../Assets/Images/arrow-next.svg';
import { IPopularDatesComponentsProps } from '../Types/data.type';

interface ISectionToggleButtonProps extends IPopularDatesComponentsProps {
	className: string;
}

interface IToggleParam {
	classStyle: string;
	onClick: () => void;
	isDisabled: boolean;
	src: string;
	alt: string;
}

const SectionToggleButton: FC<ISectionToggleButtonProps> = ({
	data,
	selectedSectionId,
	handleSectionSwitch,
	className,
}) => {
	const toggleParams: IToggleParam = {
		classStyle: `toggle__button ${className}`,
		onClick: () => {},
		isDisabled: false,
		src: '',
		alt: '',
	};

	let { classStyle, onClick, isDisabled, src, alt } = toggleParams;

	if (className === 'toggle__button_prev') {
		classStyle += selectedSectionId === 0 ? 'toggle__button_disabled' : '';
		onClick = () => {
			handleSectionSwitch(false);
		};
		isDisabled = selectedSectionId === 0;
		src = arrowPrev;
		alt = 'Назад';
	} else if (className === 'toggle__button_next') {
		classStyle +=
			selectedSectionId + 1 === data.length ? 'toggle__button_disabled' : '';
		onClick = () => {
			handleSectionSwitch(true);
		};
		isDisabled = selectedSectionId === data.length - 1;
		src = arrowNext;
		alt = 'Вперёд';
	}

	return (
		<button
			type='button'
			className={classStyle}
			onClick={onClick}
			disabled={isDisabled}
		>
			<img className='toggle__image' src={src} alt={alt} />
		</button>
	);
};

export default SectionToggleButton;

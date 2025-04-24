import gsap from 'gsap';

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

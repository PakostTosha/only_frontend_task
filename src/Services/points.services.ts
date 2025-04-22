// Координаты точек
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
		const rotationRad = (angleDeg * Math.PI) / 180;
		const endX =
			startX + r * Math.cos(((Math.PI * 2) / pointsCount) * i - rotationRad);
		const endY =
			startY + r * Math.sin(((Math.PI * 2) / pointsCount) * i - rotationRad);
		pointsCoordinatesArr.push([endX, endY]);
	}
	return pointsCoordinatesArr;
};

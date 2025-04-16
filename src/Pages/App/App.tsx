import './App.scss';
import arrow from '../../Assets/Images/arrow.svg';

const App = () => {
	return (
		<div className='container'>
			<section className='dates'>
				<h1 className='dates__title'>
					Исторические <br /> даты
				</h1>

				<div className='dates__sections sections'>
					<div className='sections__years'>
						<h2 className='sections__years_start'>2015&nbsp;</h2>
						<h2 className='sections__years_end'>&nbsp;2022</h2>
					</div>

					<div className='sections__list culture-trends'>
						<ul className='culture-trends__list'>
							{/* <li className='culture-trends__item'>
								<p className='culture-trends__number'>1</p>
								<p className='culture-trends__description'>
									Литература
								</p>
							</li>
							<li className='culture-trends__item'>
								<p className='culture-trends__number'>2</p>
								<p className='culture-trends__description'>Театр</p>
							</li>
							<li className='culture-trends__item'>
								<p className='culture-trends__number'>3</p>
								<p className='culture-trends__description'>Кино</p>
							</li>
							<li className='culture-trends__item'>
								<p className='culture-trends__number'>4</p>
								<p className='culture-trends__description'>Наука</p>
							</li> */}
						</ul>
					</div>

					{/* слайдер */}
					<div className='sections__toggle toggle'>
						<p className='toggle__section-number'>{`06`}/06</p>
						<button
							type='button'
							className='toggle__button toggle__button_prev'
							onClick={() => {}}
						>
							<img src={arrow} alt='Назад' />
						</button>
						<button
							type='button'
							className='toggle__button toggle__button_next
							toggle__button_disabled'
							onClick={() => {}}
						>
							<img src={arrow} alt='Вперёд' />
						</button>
					</div>

					<div className='sections__events events'>
						<ul className='events__list'>
							<li className='events__item'>
								<h3 className='events__title'>2015</h3>
								<p className='events__descriptions'>
									13 сентября — частное солнечное затмение, видимое в
									Южной Африке и части Антарктиды
								</p>
							</li>
							<li className='events__item'>
								<h3 className='events__title'>2016</h3>
								<p className='events__descriptions'>
									Телескоп «Хаббл» обнаружил самую удалённую из всех
									обнаруженных галактик, получившую обозначение GN-z11
								</p>
							</li>
							<li className='events__item'>
								<h3 className='events__title'>2017</h3>
								<p className='events__descriptions'>
									Компания Tesla официально представила первый в мире
									электрический грузовик Tesla Semi
								</p>
							</li>
						</ul>
					</div>
					{/* слайдер */}
				</div>

				<div className='dates__decoration_vertical-line'></div>
				<div className='dates__decoration_horizontal-line'></div>
			</section>
		</div>
	);
};

export default App;

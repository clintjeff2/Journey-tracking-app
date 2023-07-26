import React from 'react';
import styles from './CityItem.module.css';
import { Link } from 'react-router-dom';
import { useCities } from '../contexts/CitiesContext';
import { Navigate } from 'react-router-dom';

const formatDate = (date) =>
	new Intl.DateTimeFormat('en', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	}).format(new Date(date));

function CityItem({ city }) {
	const { cityName, emoji, date, id, position } = city;
	const { lat, lng } = position;
	const { currentCity, deleteCity } = useCities();
	// console.log(currentCity.id, id);

	const handleDeleteCity = (e) => {
		e.preventDefault();

		deleteCity(id);
	};
	return (
		<li>
			<Link
				className={`${styles.cityItem} ${
					currentCity.id === id ? styles['cityItem--active'] : ''
				}`}
				to={`${id}?lat=${lat}&lng=${lng}`}
			>
				<span className={styles.emoji}>{emoji}</span>
				<h3 className={styles.name}>{cityName}</h3>
				<time className={styles.date}>({formatDate(date)})</time>
				<button className={styles.deleteBtn} onClick={handleDeleteCity}>
					&times;
				</button>
			</Link>
		</li>
	);
}

export default CityItem;

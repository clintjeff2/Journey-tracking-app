import styles from './City.module.css';
import { useParams, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCities } from '../contexts/CitiesContext';
import Spinner from './Spinner';
import { useNavigate } from 'react-router-dom';

const formatDate = (date) =>
	new Intl.DateTimeFormat('en', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		weekday: 'long',
	}).format(new Date(date));

function City() {
	const { id } = useParams();

	let { getCity, currentCity, isLoading } = useCities();

	useEffect(() => {
		//Learn to always clear up the effect with the return function
		getCity(id);

		return () => (currentCity = {});
	}, [id]);

	const navigate = useNavigate();

	if (isLoading) return <Spinner />;
	// console.log(params)
	const { cityName, emoji, date, notes } = currentCity;

	return (
		<div className={styles.city}>
			<div className={styles.row}>
				<h6>City name</h6>
				<h3>
					<span>{emoji}</span> {cityName}
				</h3>
			</div>

			<div className={styles.row}>
				<h6>You went to {cityName} on</h6>
				<p>{formatDate(date || null)}</p>
			</div>

			{notes && (
				<div className={styles.row}>
					<h6>Your notes</h6>
					<p>{notes}</p>
				</div>
			)}

			<div className={styles.row}>
				<h6>Learn more</h6>
				<a
					href={`https://en.wikipedia.org/wiki/${cityName}`}
					target='_blank'
					rel='noreferrer'
				>
					Check out {cityName} on Wikipedia &rarr;
				</a>
			</div>

			<div>
				<button type='back' onClick={(e) => navigate(-1)}>
					&larr; Back
				</button>
			</div>
		</div>
	);
}

export default City;

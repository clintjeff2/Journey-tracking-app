// import React from 'react'
import styles from './CountryList.module.css';
import Spinner from './Spinner';
import CountryItem from './CountryItem';
import Message from './Message';
import { useCities } from '../contexts/CitiesContext';

function CountriesList() {
	const { cities, isLoading } = useCities();
	if (isLoading) return <Spinner />;
	if (!cities.length)
		return (
			<Message
				message={'👋 Add your first city by clicking on a city on the map'}
			/>
		);
	const countries = cities.reduce((acc, cur, index, arr) => {
		if (!acc?.map((el) => el?.country).includes(cur.country)) {
			return [...acc, { country: cur.country, emoji: cur.emoji }];
		} else {
			return acc;
		}
	}, []);
	console.log(countries);
	return (
		<ul className={styles.countryList}>
			{countries.map((country, index) => (
				<CountryItem country={country} key={index} />
			))}
		</ul>
	);
}

export default CountriesList;

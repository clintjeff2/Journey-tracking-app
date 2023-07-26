// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCities } from '../contexts/CitiesContext';
import Message from './Message';
import styles from './Form.module.css';
import Button from './Button';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Spinner from './Spinner';

export function convertToEmoji(countryCode) {
	const codePoints = countryCode
		.toUpperCase()
		.split('')
		.map((char) => 127397 + char.charCodeAt());
	return String.fromCodePoint(...codePoints);
}

function Form() {
	const [cityName, setCityName] = useState('');
	const [country, setCountry] = useState('');
	const [date, setDate] = useState(new Date());
	const [notes, setNotes] = useState('');
	const [isLoadingGeo, setIsLoadingGeo] = useState(false);
	const [emoji, setEmoji] = useState('');
	const [geoError, setGeoError] = useState('');

	const { createCity, isLoading } = useCities();

	const [searchParams, setSearchParams] = useSearchParams();
	const lat = searchParams.get('lat');
	const lng = searchParams.get('lng');

	useEffect(() => {
		if (!lat && !lng) return;
		async function getLocationUrl() {
			try {
				setIsLoadingGeo(true);
				setGeoError('');
				const data = await fetch(
					`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
				);

				const res = await data.json();

				if (!res.countryCode)
					throw new Error(
						'That does not seem to be a city, please try anywhere else'
					);

				setCityName(res.city || res.locality || '');
				setCountry(res.countryName);
				setEmoji(convertToEmoji(res.countryCode));
			} catch (err) {
				console.log(err);
				setGeoError(err.message);
			} finally {
				setIsLoadingGeo(false);
			}
		}
		getLocationUrl();
	}, [lat, lng]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const data = {
			cityName,
			country,
			emoji,
			date,
			notes,
			position: {
				lat: searchParams.get('lat'),
				lng: searchParams.get('lng'),
			},
		};

		await createCity(data);
		navigate('/app/cities');
	};

	const navigate = useNavigate();

	if (isLoadingGeo) return <Spinner />;
	if (geoError) return <Message message={geoError} />;
	return (
		<form
			className={`${styles.form} ${isLoading ? styles.loading : ''}`}
			onSubmit={handleSubmit}
		>
			<div className={styles.row}>
				<label htmlFor='cityName'>City name</label>
				<input
					id='cityName'
					onChange={(e) => setCityName(e.target.value)}
					value={cityName}
				/>
				<span className={styles.flag}>{emoji}</span>
			</div>

			<div className={styles.row}>
				<label htmlFor='date'>When did you go to {cityName}?</label>
				{/* <input
					id='date'
					onChange={(e) => setDate(e.target.value)}
					value={date}
				/> */}
				<DatePicker
					id='date'
					dateFormat='dd/MM/yyyy'
					selected={date}
					onChange={(date) => setDate(date)}
				/>
			</div>

			<div className={styles.row}>
				<label htmlFor='notes'>Notes about your trip to {cityName}</label>
				<textarea
					id='notes'
					onChange={(e) => setNotes(e.target.value)}
					value={notes}
				/>
			</div>

			<div className={styles.buttons}>
				<button>Adding</button>
				<Button type='primary'>Add</Button>
				<Button type='back' onClick={() => navigate(-1)}>
					&larr; Back
				</Button>
				{/* <Button>&larr; Back</Button> */}
			</div>
		</form>
	);
}

export default Form;

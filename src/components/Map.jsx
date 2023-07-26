import { useNavigate, useSearchParams } from 'react-router-dom';
import style from './Button.module.css';
import {
	MapContainer,
	TileLayer,
	Marker,
	Popup,
	useMap,
	useMapEvents,
} from 'react-leaflet';
import { useEffect, useState } from 'react';
import styles from './Map.module.css';
import { useCities } from './../contexts/CitiesContext';
import { useGeolocation } from '../hooks/useGeolocation';

function Map() {
	const [searchParams, setSearchParams] = useSearchParams();
	const lat = searchParams.get('lat');
	const lng = searchParams.get('lng');
	const { cities } = useCities();
	const {
		isLoading: isLoadingPosition,
		position: geolocationPosition,
		getPosition,
	} = useGeolocation();
	// console.log(lat, lng);

	const [mapPosition, setMapPosition] = useState([40, 0]);

	useEffect(() => {
		if (lat && lng) setMapPosition([lat, lng]);
	}, [lat, lng]);

	useEffect(() => {
		if (geolocationPosition)
			setMapPosition([geolocationPosition.lat, geolocationPosition.lat]);
	}, [geolocationPosition]);

	return (
		<div className={styles.mapContainer}>
			{!geolocationPosition && (
				<button className={style.position} onClick={getPosition}>
					{isLoadingPosition ? 'Loading...' : 'Use your position'}
				</button>
			)}
			<MapContainer
				className={styles.mapContainer}
				center={mapPosition}
				zoom={13}
				scrollWheelZoom={true}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url='https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
				/>
				{cities.map((city, index) => (
					<Marker
						position={[city.position.lat, city.position.lng]}
						key={city.id}
					>
						<Popup>The city of {city.cityName}</Popup>
					</Marker>
				))}
				<ChangeCenter position={mapPosition} />
				<DetectClick data={mapPosition} />
			</MapContainer>
		</div>
	);
}

function ChangeCenter({ position }) {
	const map = useMap();
	map.setView(position);

	return null;
}

function DetectClick() {
	const navigate = useNavigate();

	useMapEvents({
		click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
	});
}

export default Map;

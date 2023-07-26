import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useReducer,
} from 'react';

const CitiesContext = createContext();

const BASE_URL = 'http://localhost:8000';

function reducer(state, action) {
	switch (action.type) {
		case 'loading':
			return { ...state, isLoading: true };
		case 'cities/loaded':
			return { ...state, isLoading: false, cities: action.payload };
		case 'city/loaded':
			return { ...state, isLoading: false, currentCity: action.payload };
		case 'cities/created':
			return {
				...state,
				isLoading: false,
				cities: [...state.cities, action.payload],
			};
		case 'cities/deleted':
			return {
				...state,
				isLoading: false,
				cities: state.cities.filter((city) => city.id !== action.payload),
			};

		case 'rejected':
			return { ...state, isLoading: false, error: action.payload };

		default:
			throw new Error('Unkown action type');
	}
}
const initialState = {
	cities: [],
	isLoading: false,
	currentCity: {},
	error: '',
};

function CitiesProvider({ children }) {
	// const [cities, setCities] = useState([]);
	// const [isLoading, setIsLoading] = useState(false);
	// const [currentCity, setCurrentCity] = useState({});

	const [{ isLoading, cities, currentCity }, dispatch] = useReducer(
		reducer,
		initialState
	);

	useEffect(() => {
		async function fetchCities() {
			try {
				dispatch({ type: 'loading' });
				const res = await fetch(`${BASE_URL}/cities`);
				const data = await res.json();

				dispatch({ type: 'cities/loaded', payload: data });
			} catch (err) {
				console.log(err);
				dispatch({
					type: 'rejected',
					payload: 'There was an error loading data...',
				});
			}
		}
		fetchCities();
	}, []);

	async function getCity(id) {
		try {
			dispatch({ type: 'loading' });
			const res = await fetch(`${BASE_URL}/cities/${id}`);
			const data = await res.json();

			dispatch({ type: 'city/loaded', payload: data });
		} catch (err) {
			console.log(err);
			dispatch({
				type: 'rejected',
				payload: 'There was an error loading data...',
			});
		}
	}
	async function createCity(newCity) {
		try {
			dispatch({ type: 'loading' });
			const res = await fetch(`${BASE_URL}/cities`, {
				method: 'POST',
				body: JSON.stringify(newCity),
				headers: { 'Content-Type': 'application/json' },
			});

			const data = await res.json();
			dispatch({ type: 'cities/created', payload: data });
		} catch (err) {
			console.log('There was an error creating the city');
			dispatch({
				type: 'rejected',
				payload: 'There was an error loading data...',
			});
		}
	}
	async function deleteCity(id) {
		try {
			dispatch({ type: 'loading' });

			const res = await fetch(`${BASE_URL}/cities/${id}`, {
				method: 'DELETE',
			});

			// setCities((cities) => cities.filter((city) => city.id !== id));
			dispatch({ type: 'city/deleted', payload: id });
		} catch (err) {
			dispatch({
				type: 'rejected',
				payload: 'There was an error loading data...',
			});
		}
	}

	const context = {
		cities,
		isLoading,
		currentCity,
		getCity,
		createCity,
		deleteCity,
	};
	return (
		<CitiesContext.Provider value={context}>{children}</CitiesContext.Provider>
	);
}

function useCities() {
	if (useContext(CitiesContext) === undefined)
		throw new Error('Cannot use context');
	return useContext(CitiesContext);
}
export { useCities };
export default CitiesProvider;

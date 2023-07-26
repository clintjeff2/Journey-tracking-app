import PageNav from '../components/PageNav';
import styles from './Login.module.css';
import { useAuth } from '../contexts/FakeAuthContext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
	// PRE-FILL FOR DEV PURPOSES
	const { login, isAuthenticated } = useAuth();

	const [email, setEmail] = useState('jack@example.com');
	const [password, setPassword] = useState('qwerty');
	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();
		if (email && password) login(email, password);

		if (isAuthenticated === false)
			alert(
				'Please input \nthe email: "jack@example.com" and\nthe password: "qwerty" to view the application'
			);
	};

	useEffect(() => {
		if (isAuthenticated) navigate('/app', { replace: true });
	}, [isAuthenticated, navigate]);
	return (
		<main className={styles.login}>
			<PageNav />
			<form className={styles.form} onSubmit={handleSubmit}>
				<div className={styles.row}>
					<label htmlFor='email'>Email address</label>
					<input
						type='email'
						id='email'
						onChange={(e) => setEmail(e.target.value)}
						value={email}
					/>
				</div>

				<div className={styles.row}>
					<label htmlFor='password'>Password</label>
					<input
						type='password'
						id='password'
						onChange={(e) => setPassword(e.target.value)}
						value={password}
					/>
				</div>

				<div>
					<button className={styles.primary}>Login</button>
				</div>
			</form>
		</main>
	);
}

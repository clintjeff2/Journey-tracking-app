import styles from './SideBar.module.css';
import { Outlet } from 'react-router-dom';
import Logo from './Logo';
import AppNav from './AppNav';

function SideBar() {
	return (
		<div className={styles.sidebar}>
			<Logo />
			<AppNav />

			<Outlet />

			<footer className={styles.footer}>
				<p className={styles.copyright}>
					&copy; Copyright {new Date(Date.now()).getFullYear()} by Jefferson
					Youashi
				</p>
			</footer>
		</div>
	);
}

export default SideBar;

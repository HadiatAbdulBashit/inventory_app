import styles from "./styles.module.css";

const Filter = ({ listFilter, filter, setFilter, title }) => {
	const onChange = ({ currentTarget: input }) => {
		if (input.checked) {
			const state = [...filter, input.value];
			setFilter(state);
		} else {
			const state = filter.filter((val) => val !== input.value);
			setFilter(state);
		}
	};

	return (
		<div className={styles.container}>
			<h1 className={styles.heading}>Filter By {title}</h1>
			<div className={styles.genre_container}>
				{listFilter.map((genre) => (
					<div className={styles.genre} key={genre}>
						<input
							className='form-check-input'
							type="checkbox"
							value={genre}
							onChange={onChange}
						/>
						<p className={styles.genre_label}>{genre}</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default Filter;

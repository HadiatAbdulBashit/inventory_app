import styles from "./styles.module.css";

const Sort = ({ sort, setSort }) => {
	const onSelectChange = ({ currentTarget: input }) => {
		setSort({ sort: input.value, order: sort.order });
	};

	const onArrowChange = () => {
		if (sort.order === "asc") {
			setSort({ sort: sort.sort, order: "desc" });
		} else {
			setSort({ sort: sort.sort, order: "asc" });
		}
	};

	return (
		<div className='row me-1'>
			<div className="col-auto align-self-center">
				Sort By :
			</div>
			<select
				onChange={onSelectChange}
				className='form-select col'
				defaultValue={sort.sort}
			>
				<option value="name">Name</option>
				<option value="category">Category</option>
				<option value="merk">Merk</option>
			</select>
			<button className={styles.arrow_btn + ' col'} onClick={onArrowChange}>
				<p className={styles.up_arrow}>&uarr;</p>
				<p className={styles.down_arrow}>&darr;</p>
			</button>
		</div>
	);
};

export default Sort;

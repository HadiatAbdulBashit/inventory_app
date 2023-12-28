import Select from 'react-select'



const Filter = ({ listFilter, setFilter, title }) => {
	const onChange = (e) => {
		const state = [];
		e.map((filter) => {
			state.push(filter.value)
		})
		setFilter(state);
	};

	let options = []

	listFilter.map((filter) => {
		options.push({ value: filter, label: filter })
	})

	return (
		<Select
			options={options}
			isMulti
			onChange={onChange}
			placeholder={`Filter by ${title}...`}
		/>
	);
};

export default Filter;

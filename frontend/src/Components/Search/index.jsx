const Search = ({ setSearch }) => {
	return (
		<div className="me-2" style={{ width: '150px' }}>
			<input
				type="text"
				className="form-control"
				placeholder="Search"
				onChange={({ currentTarget: input }) => setSearch(input.value)}
			/>
		</div>
	);
};

export default Search;

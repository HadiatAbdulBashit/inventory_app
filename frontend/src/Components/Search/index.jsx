const Search = ({ setSearch }) => {
	return (
		<div className="input-group col">
			<span className="input-group-text">Search</span>
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

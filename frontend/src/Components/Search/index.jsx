const Search = ({ setSearch }) => {
	return (
		<div className="col">
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

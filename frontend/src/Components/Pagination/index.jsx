const Pagination = ({ page, total, limit, setPage }) => {
	const totalPages = Math.ceil(total / limit);

	const onClick = (newPage) => {
		setPage(newPage);
	};

	const handleFirst = () => {
		setPage(1)
	}

	const handleLast = () => {
		setPage(totalPages)
	}

	const renderPageNumbers = () => {
		let visiblePages = [];
		const minPage = Math.max(1, page - 1);
		const maxPage = Math.min(totalPages, page + 1);

		for (let i = minPage; i <= maxPage; i++) {
			visiblePages.push(
				<li className="page-item" key={i}>
					<button
						onClick={() => onClick(i)}
						className={page === i ? `page-link active` : 'page-link'}
					>
						{i}
					</button>
				</li>
			);
		}

		return visiblePages;
	};

	return (
		<>
			<ul className="pagination justify-content-end m-0">
				<li className={"page-item " + (page === 1 ? 'disabled' : null)}>
					<button className="page-link" onClick={() => handleFirst()}>&laquo;</button>
				</li>
				{renderPageNumbers()}
				<li className="page-item">
					<button className={"page-link " + (page === totalPages || totalPages === 0 ? 'disabled' : null)} onClick={() => handleLast()}>&raquo;</button>
				</li>
			</ul>
			of <b>{String(totalPages)}</b> pages
		</>
	);
};

export default Pagination;

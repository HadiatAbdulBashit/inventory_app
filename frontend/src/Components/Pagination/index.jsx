const Pagination = ({ page, total, limit, setPage }) => {
	const totalPages = Math.ceil(total / limit);

	const onClick = (newPage) => {
		setPage(newPage);
	};

	const handlePrevious = () => {
		if (page === 1) {
			return
		}
		setPage(page - 1)
	}

	const handleNext = () => {
		if (page === total) {
			return
		}
		setPage(page + 1)
	}

	const renderPageNumbers = () => {
		const visiblePages = [];
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
		<ul className="pagination justify-content-end">
			<li className={"page-item " + (page === 1 ? 'disabled' : null)}>
				<button className="page-link" onClick={() => handlePrevious()}>&laquo;</button>
			</li>
			{renderPageNumbers()}
			<li className="page-item">
				<button className={"page-link " + (page === totalPages ? 'disabled' : null)} onClick={() => handleNext()}>&raquo;</button>
			</li>
		</ul>
	);
};

export default Pagination;

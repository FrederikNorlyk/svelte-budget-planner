export const load = async (event) => {
	const id = +event.params.accountId;

	return {
		title: 'editAccount.title',
		details: 'editAccount.details',
		editHref: undefined,
		backHref: id === 0 ? '/' : '.'
	};
};

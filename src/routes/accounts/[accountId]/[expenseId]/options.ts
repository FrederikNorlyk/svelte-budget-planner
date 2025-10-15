import type { SelectOption } from '$lib/components/types/SelectOption';
import { DateUtil } from '$lib/util/DateUtil';

export const shareOptions: SelectOption<string>[] = [
	{
		value: 'false',
		label: 'expense.notShared'
	},
	{
		value: 'true',
		label: 'expense.isShared'
	}
];

export const monthOptions: SelectOption<string>[] = Array.from({ length: 12 }, (_, i) => ({
	value: String(i),
	label: DateUtil.getMonthName(i)
}));

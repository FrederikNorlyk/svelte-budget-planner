export class AmountUtil {
	private static formatter = Intl.NumberFormat('da-DK', { style: 'currency', currency: 'DKK' });

	public static localize(amount: number) {
		return AmountUtil.formatter.format(amount);
	}
}

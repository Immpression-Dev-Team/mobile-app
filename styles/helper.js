export const marginBottom = (arg) => {return arg ? arg : 10}

export const marginBottom20 = () => {return marginBottom(20)}

export const LEMON_MILK_BOLD_FONT = "LEMON MILK Bold"

export const headerContainer = (marginBottom,marginTop,paddingHorizontal) => {
	return {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: marginBottom ? marginBottom : null,
        marginTop: marginTop ? marginTop : null,
		alignSelf: 'flex-start',
        paddingHorizontal: paddingHorizontal ? paddingHorizontal : null
	}
}
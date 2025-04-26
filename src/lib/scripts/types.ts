/**
 * The type for the random character generator configs.
 *
 * Includes a `passwordLength` number, and booleans for `includesNumbers` and `includesSymbols`
 */
export type RandomConfigs = {
	passwordLength: number;
	includesNumbers: boolean;
	includesSymbols: boolean;
};

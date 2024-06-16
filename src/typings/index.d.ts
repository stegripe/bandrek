interface BaseAPIResult {
	code: number;
	status: string;
}

interface ErrorAPIResult extends BaseAPIResult {
	message: string;
}

interface SuccessAPIResult extends BaseAPIResult {
	data: any;
}

type APIResult = ErrorAPIResult | SuccessAPIResult;

interface BigInt {
	toJSON(): string;
}

interface DatabaseDataType {
	name: string;
	collation: string;
}

interface CollationType {
	charset: string;
	index: string;
	maxLength: number;
	name: string;
}

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
	type: string;
}

interface TableDataType {
	name: string;
	type: string;
	length: string;
	isUnsigned?: boolean;
	isAutoIncrement?: boolean;
	isPrimaryKey?: boolean;
	isUnique?: boolean;
	isNotNull?: boolean;
	isZerofill?: boolean;
}

interface CollationType {
	charset: string;
	index: string;
	maxLength: number;
	name: string;
}

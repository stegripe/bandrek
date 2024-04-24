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

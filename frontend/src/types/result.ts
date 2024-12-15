export interface CaseResult {
    id: number;
    case_id: string;
    case_name: string;
    start_time: string;
    result: boolean;
    guardian: number;
    handler: number;
    conclusion: number;
    detail: string;
    report_url: string;
    dts: string;
}
export interface TestUserType {
    id: number;
    username: string;
    nickname: string;
}

export const conclusionOptions = [
    { value: 1, label: '代码误检' },
    { value: 2, label: '环境错误' },
    { value: 3, label: '历史问题' },
    { value: 4, label: '版本问题' }
]



export type SearchFormFieldType = Pick<CaseResult, "case_name" | "result" | "case_id" | "start_time" | "guardian" | "handler" | "conclusion">;
interface PaginationData<T> {
    page: number,
    page_size: number,
    total: number,
    data: T[]
}
export interface PaginationResultInterface<PaginationEntity> {
  status: boolean;
  page_total: number;
  results: PaginationEntity[];
  total: number;
  next?: string;
  previous?: string;
  last?: string;
}

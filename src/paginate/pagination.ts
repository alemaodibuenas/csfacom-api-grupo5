import { PaginationResultInterface } from './pagination.results.interface';

export class Pagination<PaginationEntity> {
  public results: PaginationEntity[];
  public page_total: number;
  public total: number;
  public next: string;
  public previous: string;
  public last: string;
  public status: boolean;

  constructor(paginationResults: PaginationResultInterface<PaginationEntity>) {
    this.status = paginationResults.status;
    this.results = paginationResults.results;
    this.total = paginationResults.total;
    this.page_total = paginationResults.page_total;
    this.next = paginationResults.next;
    this.previous = paginationResults.previous;
    this.last = paginationResults.last;
  }
}

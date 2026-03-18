import { PageNumberPaginationMeta } from 'prisma-extension-pagination';

export type PaginationSpacer = 'SPACER';

export default class PaginationWindow {
  static SPACER: PaginationSpacer = 'SPACER';

  protected pagination;
  protected onEachSide = 3;

  constructor(pagination: PageNumberPaginationMeta<true>) {
    this.pagination = pagination;
  }

  make(): (PaginationSpacer | number)[] {
    if (this.pagination.pageCount < this.onEachSide * 2 + 8) {
      return this.getSmallSlider();
    }

    return this.getSlider();
  }

  getSmallSlider() {
    return this.getRange(1, this.pagination.pageCount);
  }

  getSlider() {
    const window = this.onEachSide + 4;

    if (this.pagination.currentPage <= window) {
      return this.getSliderTooCloseToBeginning();
    } else if (
      this.pagination.currentPage >
      this.pagination.pageCount - window
    ) {
      return this.getSliderTooCloseToEnd();
    }

    return this.getFullSlider();
  }

  getSliderTooCloseToBeginning() {
    return [
      ...this.getRange(1, this.pagination.currentPage + this.onEachSide),
      PaginationWindow.SPACER,
      ...this.getFinish(),
    ];
  }

  getSliderTooCloseToEnd() {
    return [
      ...this.getStart(),
      PaginationWindow.SPACER,
      ...this.getRange(
        this.pagination.currentPage - this.onEachSide,
        this.pagination.pageCount
      ),
    ];
  }

  getFullSlider() {
    return [
      ...this.getStart(),
      PaginationWindow.SPACER,
      ...this.getAdjacentRange(),
      PaginationWindow.SPACER,
      ...this.getFinish(),
    ];
  }

  getStart() {
    return [1, 2];
  }

  getFinish() {
    return this.getRange(
      this.pagination.pageCount - 1,
      this.pagination.pageCount
    );
  }

  getAdjacentRange() {
    return this.getRange(
      this.pagination.currentPage - this.onEachSide,
      this.pagination.currentPage + this.onEachSide
    );
  }

  getRange(from: number, to: number) {
    const result = [];

    for (let i = from; i < to + 1; i++) {
      result.push(i);
    }

    return result;
  }
}

export interface IPaginationProps {
  hasNext: boolean;
  hasPrev: boolean;
  count: number;
  limit: number;
  offset: number;
  onNext: VoidFunction;
  onPrev: VoidFunction;
}

export interface ProfilerChild {
  Id: string;
  Name: string;
  DurationMilliseconds: number | number;
  StartMilliseconds: number | number;
  IsClosed: boolean;
  Children?: ProfilerChild[];
}

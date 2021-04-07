import { SafeResourceUrl } from '@angular/platform-browser';
import { ProfilerChild } from './profiler-child';

export interface ProfilerResponse {
  Id: string;
  Name: string;
  Started: Date;
  DurationMilliseconds: number;
  MachineName: string;
  Root: ProfilerChild;
  User: string;
  HasUserViewed: boolean;
  IsOpen: boolean;
  IsLoaded: boolean;
  Url: string;
  SafeUrl: SafeResourceUrl;
  HasValue: boolean;
  Colour: string | null;
  Duplicates: number;
}

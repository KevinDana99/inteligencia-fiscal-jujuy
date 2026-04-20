import type { IAdminPanelData } from '../models/AdminPanel';

export interface IAdminPanelQueryPort {
  getAdminPanelData(): Promise<IAdminPanelData>;
}

export type IAdminPanelSource = IAdminPanelQueryPort;

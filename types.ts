
export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export interface MachineState {
  model: string;
  controller: string;
  activeAlarms: string[];
}

export enum Feature {
  MAZATROL = 'Mazatrol Programming',
  GCODE = 'EIA/ISO G-Code',
  TOOLING = 'Tooling Setup',
  MAINTENANCE = 'Maintenance/Alarms'
}

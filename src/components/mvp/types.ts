// Type definitions for MVP components

export type AgentStatus = 'idle' | 'working' | 'thinking' | 'collaborating' | 'error';

export type AgentType = 
  | 'discovery' 
  | 'requirements' 
  | 'architecture' 
  | 'backend' 
  | 'frontend' 
  | 'database' 
  | 'testing' 
  | 'devops';

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  status: AgentStatus;
  currentTask?: string;
  progress?: number;
  lastActivity?: Date;
  metrics?: {
    tasksCompleted: number;
    linesOfCode: number;
    testsWritten: number;
  };
}

export interface Activity {
  id: string;
  agentId: string;
  agentName: string;
  type: 'info' | 'success' | 'warning' | 'error';
  description: string;
  timestamp: Date;
  progress?: number;
  details?: any;
}

export interface CompanyContext {
  tools: string[];
  repositories: Repository[];
  documentation: Documentation[];
  standards: CodingStandards;
}

export interface Repository {
  name: string;
  language: string;
  framework?: string;
  structure: any;
}

export interface Documentation {
  title: string;
  type: string;
  content: string;
  url?: string;
}

export interface CodingStandards {
  language: string;
  linter: string;
  formatter: string;
  testFramework: string;
  conventions: any;
}

export interface ProjectSpec {
  name: string;
  description: string;
  components: Component[];
  requirements: string[];
  techStack: TechStack;
}

export interface Component {
  name: string;
  type: string;
  path: string;
  dependencies: string[];
}

export interface TechStack {
  frontend?: string;
  backend?: string;
  database?: string;
  deployment?: string;
}

export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: Date;
}
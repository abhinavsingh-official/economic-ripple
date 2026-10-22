export type Country = {
  code: string;
  name: string;
};

export type Scenario = {
  id: string;
  name: string;
  description: string;
};

export type Insight = {
  id: string;
  title: string;
  value: string;
  delta?: number;
};

export type SimulationDataRow = {
  step: number;
  country: string;
  // Core variables
  depression_prev: number;
  gdp_growth: number;
  inflation: number;
  unemployment_rate: number;
  poverty_rate: number;
  urbanization: number;
  homicide_rate: number;
  // Derived: depression_prev
  depression_prev_delta: number;
  depression_prev_system_delta: number;
  depression_prev_shock: number;
  depression_prev_noise: number;
  // Derived: gdp_growth
  gdp_growth_delta: number;
  gdp_growth_system_delta: number;
  gdp_growth_shock: number;
  gdp_growth_noise: number;
  // Derived: inflation
  inflation_delta: number;
  inflation_system_delta: number;
  inflation_shock: number;
  inflation_noise: number;
  // Derived: unemployment_rate
  unemployment_rate_delta: number;
  unemployment_rate_system_delta: number;
  unemployment_rate_shock: number;
  unemployment_rate_noise: number;
  // Derived: poverty_rate
  poverty_rate_delta: number;
  poverty_rate_system_delta: number;
  poverty_rate_shock: number;
  poverty_rate_noise: number;
  // Derived: urbanization
  urbanization_delta: number;
  urbanization_system_delta: number;
  urbanization_shock: number;
  urbanization_noise: number;
  // Derived: homicide_rate
  homicide_rate_delta: number;
  homicide_rate_system_delta: number;
  homicide_rate_shock: number;
  homicide_rate_noise: number;
  [key: string]: number | string;
};

export type SimulationResult = {
  data: SimulationDataRow[];
  run_id: string;
  steps: number;
  countries: string[];
  scenario: string | null;
  timestamp: string;
};

export type SimulationRequest = {
  countries: string[];
  steps: number;
  scenario?: string;
  scale?: number;
  manual?: Record<string, number>;
  timeline?: Record<string, Array<Record<string, unknown>>>;
};

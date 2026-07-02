export type Metrica = {
  status: boolean;
  signal: number;
  bateria: number;
  created_at: string;
  time: number;
};

export type Location = {
  id: number;
  latitude: number;
  longitude: number;
  created_at: string;
};

export type Nodo = {
  id: number;
  name: string;
  installed_at: string;
  red: number;
  ultima_metrica: Metrica | null;
  locations: Location[];
};

export type Red = {
  id: number;
  name: string;
  created_at: string;
  sync_seconds: number;
  rio: number;
  nodos: Nodo[];
};

export type Rio = {
  id: string;
  name: string;
}




export type Warnings_node = {
  id: number;
  nodo: number;
  message: string;
  status: boolean;
  created_at: string;
}
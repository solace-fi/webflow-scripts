export type ProtocolListResponse = {
  metadata: {
    seriesName: string;
    version: string;
    dateCreated: string;
    provenance: string;
  };
  function: {
    name: string;
    description: string;
    provenance: string;
  };
  data: {
    protocolMap: {
      appId: string;
      category: string;
      tier: number;
    }[];
  };
};

export type Protocol = {
  appId: string;
  category: string;
  tier: number;
};

export type Sorteable = "protocol" | "category" | "risk";
export type SortDirection = "asc" | "desc";
export type Sort = {
  sorteable: Sorteable;
  direction: SortDirection;
};
export type CurrentSort = [Sort, Sort] | [Sort];

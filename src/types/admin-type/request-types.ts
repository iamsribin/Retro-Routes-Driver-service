export interface AdminUpdateDriverStatusReq{
  id:string;
  status: "Good" | "Warning" | "Rejected" | "Blocked";
  reason: string;
  fields?: string[];
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  search?: string;
  status: "Good" | "Block";
}
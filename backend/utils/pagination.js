export const getPagination = (query) => {
  const page = Math.max(parseInt(query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit) || 20, 1), 100);
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

export const buildPaginatedResponse = (rows, totalCount, page, limit) => ({
  data: rows,
  pagination: {
    page,
    limit,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
  },
});

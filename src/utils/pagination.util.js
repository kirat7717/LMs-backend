
// ==================== PAGINATION UTILITY ====================

const paginate = async ({
  model,
  filter = {},
  page = 1,
  limit = 10,
  select,
  populate = [],
  sort = { createdAt: -1 },
}) => {
  // Calculate documents to skip
  const skip = (page - 1) * limit;

  // Fetch data and total count in parallel
  const [data, totalDocuments] = await Promise.all([
    model
      .find(filter)
      .select(select)
      .populate(populate)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),

    model.countDocuments(filter),
  ]);

  // Calculate total pages
  const totalPages = Math.ceil(totalDocuments / limit);

  return {
    data,
    pagination: {
      currentPage: page,
      limit,
      totalDocuments,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

export default paginate;
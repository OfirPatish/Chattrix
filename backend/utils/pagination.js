/**
 * Pagination utility functions
 */

/**
 * Calculate pagination metadata
 * @param {number} total - Total number of items
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @param {number} count - Current page item count
 * @returns {object} Pagination metadata
 */
export const getPaginationMeta = (total, page, limit, count) => {
  return {
    page,
    pages: Math.ceil(total / limit),
    total,
    count,
  };
};

/**
 * Calculate skip value for database queries
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @returns {number} Skip value
 */
export const getSkip = (page, limit) => {
  return (page - 1) * limit;
};


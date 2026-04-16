import { getReviews } from "./reviewService";

export const getDashboardStats = async () => {
  const reviewsResult = await Promise.allSettled([getReviews()]);

  const reviews =
    reviewsResult[0].status === "fulfilled" ? reviewsResult[0].value : [];

  return {
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    totalReviews: reviews.length,
    recentOrders: [],
    errors: {
      orders: "Orders endpoint unavailable",
      users: "Users endpoint unavailable",
      reviews:
        reviewsResult[0].status === "rejected" ? reviewsResult[0].reason : null,
    },
  };
};

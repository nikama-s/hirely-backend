import { prisma } from "../utils/db";

interface MonthlyStats {
  month: string;
  users: number;
  applications: number;
}

interface WeeklyStats {
  week: string;
  users: number;
  applications: number;
}

interface AdminAnalyticsData {
  monthlyStats: MonthlyStats[];
  weeklyStats: WeeklyStats[];
  averageApplicationsPerUser: number;
  totalUsers: number;
  totalApplications: number;
}

export class AdminAnalyticsService {
  static async getAdminAnalytics(): Promise<AdminAnalyticsData> {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const twelveWeeksAgo = new Date(now);
    twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 84); // 12 weeks ago

    // Get all users and applications
    const [users, applications] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          createdAt: true
        }
      }),
      prisma.jobApplication.findMany({
        select: {
          id: true,
          createdAt: true
        }
      })
    ]);

    const totalUsers = users.length;
    const totalApplications = applications.length;
    const averageApplicationsPerUser =
      totalUsers > 0 ? totalApplications / totalUsers : 0;

    // Initialize monthly stats
    const monthlyStatsMap = new Map<string, MonthlyStats>();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      const monthLabel = date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric"
      });
      monthlyStatsMap.set(monthKey, {
        month: monthLabel,
        users: 0,
        applications: 0
      });
    }

    // Initialize weekly stats
    const weeklyStatsMap = new Map<string, WeeklyStats>();
    const getMonday = (date: Date) => {
      const d = new Date(date);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      return new Date(d.setDate(diff));
    };
    const currentMonday = getMonday(now);

    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date(currentMonday);
      weekStart.setDate(weekStart.getDate() - i * 7);
      const weekKey = `${weekStart.getFullYear()}-${String(
        weekStart.getMonth() + 1
      ).padStart(2, "0")}-${String(weekStart.getDate()).padStart(2, "0")}`;
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      const weekLabel = `${weekStart.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
      })} - ${weekEnd.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
      })}`;

      weeklyStatsMap.set(weekKey, {
        week: weekLabel,
        users: 0,
        applications: 0
      });
    }

    // Process users
    users.forEach((user) => {
      const date = new Date(user.createdAt);

      // Monthly stats
      if (date >= sixMonthsAgo) {
        const monthKey = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;
        const monthStats = monthlyStatsMap.get(monthKey);
        if (monthStats) {
          monthStats.users++;
        }
      }

      // Weekly stats
      if (date >= twelveWeeksAgo) {
        const weekStart = getMonday(new Date(date));
        const weekKey = `${weekStart.getFullYear()}-${String(
          weekStart.getMonth() + 1
        ).padStart(2, "0")}-${String(weekStart.getDate()).padStart(2, "0")}`;
        const weekStats = weeklyStatsMap.get(weekKey);
        if (weekStats) {
          weekStats.users++;
        }
      }
    });

    // Process applications
    applications.forEach((app) => {
      const date = new Date(app.createdAt);

      // Monthly stats
      if (date >= sixMonthsAgo) {
        const monthKey = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;
        const monthStats = monthlyStatsMap.get(monthKey);
        if (monthStats) {
          monthStats.applications++;
        }
      }

      // Weekly stats
      if (date >= twelveWeeksAgo) {
        const weekStart = getMonday(new Date(date));
        const weekKey = `${weekStart.getFullYear()}-${String(
          weekStart.getMonth() + 1
        ).padStart(2, "0")}-${String(weekStart.getDate()).padStart(2, "0")}`;
        const weekStats = weeklyStatsMap.get(weekKey);
        if (weekStats) {
          weekStats.applications++;
        }
      }
    });

    return {
      monthlyStats: Array.from(monthlyStatsMap.values()),
      weeklyStats: Array.from(weeklyStatsMap.values()),
      averageApplicationsPerUser,
      totalUsers,
      totalApplications
    };
  }
}

import { prisma } from "../utils/db";
import { ApplicationStatus } from "../schemas/jobApplication";

interface MonthlyStats {
  month: string;
  total: number;
  offers: number;
  rejected: number;
}

interface WeeklyStats {
  week: string;
  total: number;
  offers: number;
  rejected: number;
}

interface StatusDistribution {
  status: string;
  count: number;
  percentage: number;
}

interface AnalyticsData {
  monthlyStats: MonthlyStats[];
  weeklyStats: WeeklyStats[];
  statusDistribution: StatusDistribution[];
  totalApplications: number;
  offerRate: number;
  rejectionRate: number;
}

export class AnalyticsService {
  static async getUserAnalytics(userId: string): Promise<AnalyticsData> {
    const applications = await prisma.jobApplication.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        dateApplied: "desc"
      }
    });

    const totalApplications = applications.length;

    // Calculate monthly statistics
    const monthlyStatsMap = new Map<string, MonthlyStats>();
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    // Initialize last 6 months
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
        total: 0,
        offers: 0,
        rejected: 0
      });
    }

    // Calculate weekly statistics (last 12 weeks)
    const weeklyStatsMap = new Map<string, WeeklyStats>();
    const twelveWeeksAgo = new Date(now);
    twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 84); // 12 weeks ago

    // Get Monday of current week
    const getMonday = (date: Date) => {
      const d = new Date(date);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
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
        total: 0,
        offers: 0,
        rejected: 0
      });
    }

    // Process applications
    applications.forEach((app) => {
      // Use dateApplied if available, otherwise use createdAt
      const date = app.dateApplied
        ? new Date(app.dateApplied)
        : new Date(app.createdAt);

      // Monthly stats
      if (date >= sixMonthsAgo) {
        const monthKey = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;
        const monthStats = monthlyStatsMap.get(monthKey);
        if (monthStats) {
          monthStats.total++;
          if (
            app.status === ApplicationStatus.OFFERED ||
            app.status === ApplicationStatus.ACCEPTED
          ) {
            monthStats.offers++;
          }
          if (
            app.status === ApplicationStatus.REJECTED ||
            app.status === ApplicationStatus.GHOSTED
          ) {
            monthStats.rejected++;
          }
        }
      }

      // Weekly stats
      if (date >= twelveWeeksAgo) {
        const getMonday = (d: Date) => {
          const day = d.getDay();
          const diff = d.getDate() - day + (day === 0 ? -6 : 1);
          return new Date(d.setDate(diff));
        };
        const weekStart = getMonday(new Date(date));
        const weekKey = `${weekStart.getFullYear()}-${String(
          weekStart.getMonth() + 1
        ).padStart(2, "0")}-${String(weekStart.getDate()).padStart(2, "0")}`;
        const weekStats = weeklyStatsMap.get(weekKey);
        if (weekStats) {
          weekStats.total++;
          if (
            app.status === ApplicationStatus.OFFERED ||
            app.status === ApplicationStatus.ACCEPTED
          ) {
            weekStats.offers++;
          }
          if (
            app.status === ApplicationStatus.REJECTED ||
            app.status === ApplicationStatus.GHOSTED
          ) {
            weekStats.rejected++;
          }
        }
      }
    });

    // Calculate status distribution
    const statusCounts = new Map<string, number>();
    applications.forEach((app) => {
      const count = statusCounts.get(app.status) || 0;
      statusCounts.set(app.status, count + 1);
    });

    const statusDistribution: StatusDistribution[] = Array.from(
      statusCounts.entries()
    ).map(([status, count]) => ({
      status: status.replace(/_/g, " "),
      count,
      percentage: totalApplications > 0 ? (count / totalApplications) * 100 : 0
    }));

    // Calculate rates
    const offers = applications.filter(
      (app) =>
        app.status === ApplicationStatus.OFFERED ||
        app.status === ApplicationStatus.ACCEPTED
    ).length;
    const rejected = applications.filter(
      (app) =>
        app.status === ApplicationStatus.REJECTED ||
        app.status === ApplicationStatus.GHOSTED
    ).length;

    const appliedCount = applications.filter(
      (app) => app.status !== ApplicationStatus.NOT_APPLIED
    ).length;

    return {
      monthlyStats: Array.from(monthlyStatsMap.values()),
      weeklyStats: Array.from(weeklyStatsMap.values()),
      statusDistribution,
      totalApplications,
      offerRate: appliedCount > 0 ? (offers / appliedCount) * 100 : 0,
      rejectionRate: appliedCount > 0 ? (rejected / appliedCount) * 100 : 0
    };
  }
}

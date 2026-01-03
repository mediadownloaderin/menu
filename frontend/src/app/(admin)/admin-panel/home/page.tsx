"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, CreditCard, ArrowRight, Star, Settings } from "lucide-react";
import { config } from "@/lib/config";

interface DashboardStats {
  totalUsers: number;
  totalCards: number;
  activeMemberships: number;
  expiredMemberships: number;
  recentActivity?: {
    newUsers: number;
    newCards: number;
    expiringSoon: number;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getDashboardStats();
  }, []);

  const getDashboardStats = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${config.backend_url}/api/admin/stats`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch dashboard stats");
      }

      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    {
      title: "All vCards",
      url: `/admin-panel/menus`,
      icon: CreditCard,
      description: "Manage all vCards and memberships",
      color: "bg-blue-500",
    },
    {
      title: "Pricing Plans",
      url: `/admin-panel/plans`,
      icon: Star,
      description: "Configure subscription plans",
      color: "bg-green-500",
    },
    {
      title: "Settings",
      url: `/admin-panel/settings`,
      icon: Settings,
      description: "Platform configuration",
      color: "bg-purple-500",
    },
  ];

  const StatCard = ({
    title,
    value,
    icon: Icon,
    description,
    trend,
    color = "bg-blue-500"
  }: {
    title: string;
    value: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: React.ComponentType<any>;
    description: string;
    trend?: string;
    color?: string;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-bold">{value.toLocaleString()}</h2>
              {trend && (
                <span className="text-sm text-green-600 font-medium">{trend}</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <div className={`p-3 rounded-full ${color} text-white`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const QuickActionCard = ({
    title,
    url,
    icon: Icon,
    description,
    color = "bg-blue-500"
  }: {
    title: string;
    url: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: React.ComponentType<any>;
    description: string;
    color?: string;
  }) => (
    <Card className="group cursor-pointer transition-all hover:shadow-lg hover:border-primary">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className={`p-2 rounded-lg ${color} text-white w-fit`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        {/* Header Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <Skeleton className="h-9 w-9 rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-3 w-40" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your platform statistics and quick access to management tools
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={Users}
          description="Registered users on platform"
          color="bg-blue-500"
        />
        <StatCard
          title="Total vCards"
          value={stats?.totalCards || 0}
          icon={CreditCard}
          description="Active digital business cards"
          color="bg-green-500"
        />
      </div>


      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Quick Actions</h2>
        <p className="text-muted-foreground">
          Quickly access frequently used management sections
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action) => (
            <div
              key={action.title}
              onClick={() => window.location.href = action.url}
            >
              <QuickActionCard
                title={action.title}
                url={action.url}
                icon={action.icon}
                description={action.description}
                color={action.color}
              />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
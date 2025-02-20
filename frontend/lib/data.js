'use server'

import { fetchWithAuth } from "./session";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchDashboardData() {
  try {
    const data = await fetch(`${API_URL}/api/table/dashboard`);
    const dashboard_data = await data.json();
    return dashboard_data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch dashboard data.");
  }
}

export async function fetchChartData() {
  try {
    const data = await fetch(`${API_URL}/api/charts`);
    const chart_data = await data.json();
    return chart_data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch dashboard chart data.");
  }
}

export async function fetchTimelineData() {
  try {
    const data = await fetchWithAuth(`${API_URL}/api/table`);
    const timeline_data = await data.json();
    return timeline_data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch timeline data.");
  }
}

export async function fetchUsersData() {
  try {
    const data = await fetchWithAuth(`${API_URL}/api/users`);
    const users_data = await data.json();
    console.log(users_data);
    return users_data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch users data.");
  }
}

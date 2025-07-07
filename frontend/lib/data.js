'use server'

import { fetchWithAuth } from "./session";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchDashboardData() {
  try {
    console.log(API_URL);
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

    return users_data.map((user) => ({
      ...user,
      last_login: user.last_login ? new Date(user.last_login).toISOString() : null,
      date_joined: user.date_joined ? new Date(user.date_joined).toISOString() : null,
    }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch users data.");
  }
}

export async function fetchVideoStream() {
  try {
    const response = await fetchWithAuth(`${API_URL}/api/video_feed`);
    if (!response.ok) {
      throw new Error("Failed to fetch video stream.");
    }
    const blob = await response.blob(); // Convert response to Blob
    return blob;
  } catch (error) {
    console.error("Video Stream Error:", error);
    throw new Error("Failed to fetch video stream.");
  }
}




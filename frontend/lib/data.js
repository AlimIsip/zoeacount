'use server'

import { fetchWithAuth } from "./session";


export async function fetchDashboardData() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await fetch("http://127.0.0.1:8000/api/table/dashboard");
    const dashboard_data = await data.json();
    // console.log('Data fetch completed after 3 seconds.');

    return dashboard_data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch dashboard data.");
  }
}

export async function fetchChartData() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await fetch("http://127.0.0.1:8000/api/charts");
    const chart_data = await data.json();
    // console.log('Data fetch completed after 3 seconds.');

    return chart_data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch dashboard chart data.");
  }
}

export async function fetchTimelineData() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await fetchWithAuth('http://127.0.0.1:8000/api/table');
    const timeline_data = await data.json();
    // console.log('Data fetch completed after 3 seconds.');

    return timeline_data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch timeline data.");
  }
}

export async function fetchUsersData() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await fetchWithAuth('http://127.0.0.1:8000/api/users');
    const users_data = await data.json();
    // console.log('Data fetch completed after 3 seconds.');
    console.log(users_data);
    
    return users_data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch users data.");
  }
}




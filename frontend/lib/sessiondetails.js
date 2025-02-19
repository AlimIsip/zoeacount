"use server";

import "server-only";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { createSession } from "./session";
import { redirect } from 'next/navigation'

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

export async function isRole(requiredRole) {
  const cookieStore = await cookies();
  const accessToken = await cookieStore.get("access_token")?.value; 

  if (!accessToken) {
    return false;
  }

  try {
    const decodedToken = await decrypt(accessToken);
    // Check if the user's role matches the required role
    return decodedToken.user.role === requiredRole;
  } catch (error) {
    return false;
  }
}

export async function isActive(){
  const cookieStore = await cookies();
  const status = await cookieStore.has("access_token");

  return status;
  }

export async function getUser() {
   "use server"
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value; // Replace with your token storage strategy
  if (!accessToken) {
    return false;
  }
  
  try {
    const decodedToken = await decrypt(accessToken);
    
    // Check if the user's role matches the required role
    return decodedToken.name;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return false;
  }
}


export async function decrypt(session) {
   "use server"
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log("Failed to verify session to decrypt");
  }
}

export async function handleLogin(formData){
  await createSession(formData);
  redirect('/');
}

export async function fetchCurrentUser() {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    
    if (!accessToken) {
      throw new Error("No access token found");
    }

    const userData = await decrypt(accessToken);
    console.log(userData)
    return {
      username: userData.name,
      last_login: userData.last_login,
      date_joined: userData.date_joined,
      role: userData.role,
    };
  } catch (error) {
    console.error("Failed to fetch current user:", error);
    throw new Error("Failed to retrieve user data");
  }
}
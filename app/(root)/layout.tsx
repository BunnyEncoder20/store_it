import React from "react";
import { redirect } from "next/navigation";

// Component Imports
import Header from "@/components/Header";
import MobileNavigation from "@/components/MobileNavigation";
import Sidebar from "@/components/Sidebar";

// server actions import
import { getCurrentUser } from "@/lib/actions/user.actions";

// curernt layout 🏠
const layout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    console.error("User not found");
    redirect("/sign-in");
  }
  console.log(currentUser);

  return (
    <main className="flex h-screen">
      <Sidebar {...currentUser} />

      <section className="flex h-full flex-1 flex-col">
        <MobileNavigation {...currentUser} />
        <Header />
        <div className="main-content">{children}</div>
      </section>
    </main>
  );
};

export default layout;

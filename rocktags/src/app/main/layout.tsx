"use client";

import { auth } from "@/config/firebase";

import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();
  const [isUserValid, setIsUserValid] = useState(false);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        if (user.emailVerified) {
          setIsUserValid(true);
          console.log("This is the logged in user", user);
        } else {
          console.log("email not verified");
          router.push("/login");
        }
      } else {
        console.log("no user found");
        router.push("/login");
      }
    });

    // Clean up the listener when component unmounts
    return () => unsubscribe();
  }, [router]);

  if (isUserValid) {
    return (
      <div>
        {/* Include shared UI here e.g. a header or sidebar */}
        {/* <NavBar /> */}
        <div className="">{children}</div>
      </div>
    );
  }

}
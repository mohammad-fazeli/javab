import type { NextPage } from "next";
import React, { useEffect } from "react";

import { useRouter } from "next/router";

const Practice: NextPage = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/lesson");
  }, [router]);
  return <div></div>;
};

export default Practice;

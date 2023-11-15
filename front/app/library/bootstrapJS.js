"use client";
import { useEffect } from "react";

export default function ImportBsJS() {
  useEffect(() => {
    require("bootstrap");
  }, []);
  return null;
}

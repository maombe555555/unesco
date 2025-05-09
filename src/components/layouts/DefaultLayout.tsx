import Navbar from "../common/Navbar";
import Footer from "../common/Footer";
import React from "react";

function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default DefaultLayout;
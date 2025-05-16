
import React, {Suspense} from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | UNESCO CNRU",
};



function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <main>{children}</main>
     </Suspense>
    
  );
}

export default ResetPasswordLayout;
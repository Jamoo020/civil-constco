import React from "react";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-white mt-12">
      <div className="container py-8 flex flex-col md:flex-row justify-between items-start">
        <div>
          <h4 className="font-bold">Coast Infrastructure</h4>
          <p className="text-sm text-gray-600">Civil engineering & construction — Mombasa, Kilifi, Malindi</p>
        </div>
        <div className="mt-6 md:mt-0 text-sm text-gray-600">© {new Date().getFullYear()} Coast Infrastructure. All rights reserved.</div>
      </div>
    </footer>
  );
}

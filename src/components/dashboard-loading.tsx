"use client";

import React from "react";

export default function DashboardLoading() {
  return (
    <div
      className="animate-pulse space-y-6 p-4"
      role="status"
      aria-busy="true"
      aria-label="Loading dashboard"
    >
      {/* header placeholder */}
      <div className="flex items-center justify-between">
        <div className="h-6 w-40 rounded bg-gray-200 dark:bg-slate-700" />
        <div className="h-6 w-20 rounded bg-gray-200 dark:bg-slate-700" />
      </div>

      {/* top cards */}
      <div className="grid">
        <div className="rounded-lg border bg-white/50 p-4 dark:bg-slate-800/60">
          <div className="h-4 w-32 rounded bg-gray-200 dark:bg-slate-700 mb-4" />
          <div className="h-8 w-full rounded bg-gray-200 dark:bg-slate-700" />
          <div className="mt-3 h-3 w-3/4 rounded bg-gray-200 dark:bg-slate-700" />
        </div>
      </div>

      {/* main content */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-4 bg-white/50 dark:bg-slate-800/60 ">
        <div className="flex justify-between">
          <div className="h-6 w-48 rounded bg-gray-200 dark:bg-slate-700 mb-4" />
          <div className="h-6 w-15 rounded bg-gray-200 dark:bg-slate-700 mb-4" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-slate-700" />
                <div className="h-4 w-20 rounded bg-gray-200 dark:bg-slate-700" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border p-4 bg-white/50 dark:bg-slate-800/60">
          <div className="h-6 w-48 rounded bg-gray-200 dark:bg-slate-700 mb-4" />
          <div className="h-56 rounded bg-gray-200 dark:bg-slate-700" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg border bg-white/50 p-4 dark:bg-slate-800/60"
          >
            <div className="h-4 w-32 rounded bg-gray-200 dark:bg-slate-700 mb-4" />
            <div className="h-8 w-full rounded bg-gray-200 dark:bg-slate-700" />
            <div className="mt-3 h-3 w-3/4 rounded bg-gray-200 dark:bg-slate-700" />
          </div>
        ))}
      </div>
    </div>
  );
}
// ```// filepath: d:\Projects\wealth-ai-tsx\src\components\dashboard-loading.tsx
// "use client";

// import React from "react";

// export default function DashboardLoading(): JSX.Element {
//   return (
//     <div
//       className="animate-pulse space-y-6 p-4"
//       role="status"
//       aria-busy="true"
//       aria-label="Loading dashboard"
//     >
//       {/* header placeholder */}
//       <div className="flex items-center justify-between">
//         <div className="h-6 w-40 rounded bg-gray-200 dark:bg-slate-700" />
//         <div className="h-6 w-20 rounded bg-gray-200 dark:bg-slate-700" />
//       </div>

//       {/* top cards */}
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//         {Array.from({ length: 3 }).map((_, i) => (
//           <div
//             key={i}
//             className="rounded-lg border bg-white/50 p-4 dark:bg-slate-800/60"
//           >
//             <div className="h-4 w-32 rounded bg-gray-200 dark:bg-slate-700 mb-4" />
//             <div className="h-8 w-full rounded bg-gray-200 dark:bg-slate-700" />
//             <div className="mt-3 h-3 w-3/4 rounded bg-gray-200 dark:bg-slate-700" />
//           </div>
//         ))}
//       </div>

//       {/* main content */}
//       <div className="grid gap-4 md:grid-cols-2">
//         <div className="rounded-lg border p-4 bg-white/50 dark:bg-slate-800/60">
//           <div className="h-6 w-48 rounded bg-gray-200 dark:bg-slate-700 mb-4" />
//           <div className="space-y-3">
//             {Array.from({ length: 5 }).map((_, i) => (
//               <div key={i} className="flex items-center justify-between">
//                 <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-slate-700" />
//                 <div className="h-4 w-20 rounded bg-gray-200 dark:bg-slate-700" />
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="rounded-lg border p-4 bg-white/50 dark:bg-slate-800/60">
//           <div className="h-6 w-48 rounded bg-gray-200 dark:bg-slate-700 mb-4" />
//           <div className="h-56 rounded bg-gray-200 dark:bg-slate-700" />
//         </div>
//       </div>
//     </div>
//   );
// }

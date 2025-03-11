'use client';

import React, { useState } from "react";
// import SkeletonInfo from "@/components/Skeletons/SkeletonInfo";
// import SkeletonGraph from "@/components/Skeletons/SkeletonGraph";
// import SkeletonAudit from "@/components/Skeletons/SkeletonAudit";
// import { Skeleton } from "@/components/ui/skeleton";

export const Loading: React.FC = () => {
    return (
        // <div className='profile-grid-container'>
        //     <div className='profile-grid'>
        //         {/* <SkeletonInfo />
        //         <SkeletonAudit /> */}
        //         <div className='bar-chart h-[40%]'>
        //             {/* graph Skeleton */}
        //         </div>
        //         <div className='xp-line-chart h-[60%]'>
        //             {/* graph Skeleton */}
        //         </div>
        //     </div>
        // </div>

        <div>
            <p className="font-3em">Loading...</p>
        </div>
    )
}
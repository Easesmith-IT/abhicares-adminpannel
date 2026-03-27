import React from 'react'
import { Skeleton } from '../ui/skeleton'
import { Card, CardContent, CardHeader } from '../ui/card'

export const CategoryDetailsSkeleton = () => {
  return (
    <div>
        <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-4 w-80" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-52" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-36" />
          </CardContent>
        </Card>

        {/* Items Table Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-24" />
          </CardHeader>

          <CardContent className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-4 gap-4 items-center"
              >
                <Skeleton className="h-4 w-6" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

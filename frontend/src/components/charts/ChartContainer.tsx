import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartContainerProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  description,
  children,
  className = "",
  actions
}) => {
  return (
    <Card className={`bg-slate-800 border-slate-700 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg font-semibold text-white">
            {title}
          </CardTitle>
          {description && (
            <p className="text-sm text-slate-400 mt-1">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default ChartContainer;

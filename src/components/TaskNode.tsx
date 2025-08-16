import React from "react";

interface Props {
  id: string;
  depth?: number;
}

export const TaskNode: React.FC<Props> = ({ id, depth = 0 }) => {
  return (
    <div>
      {/* TaskNode component will be implemented here */}
    </div>
  );
};

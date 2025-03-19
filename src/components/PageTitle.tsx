import React from 'react';

interface PageTitleProps {
  title: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
  return (
    <div className="mt-12 mb-6">
      <h1 className="text-2xl font-display text-white/70">
        {title}
      </h1>
    </div>
  );
};

export default PageTitle; 
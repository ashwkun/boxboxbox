import React, { useState, useEffect } from 'react';

interface TabItem {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  items: TabItem[];
  defaultActiveTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'enclosed' | 'underline';
  fullWidth?: boolean;
  centered?: boolean;
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({
  items,
  defaultActiveTab,
  onChange,
  variant = 'default',
  fullWidth = false,
  centered = false,
  className = '',
}) => {
  // Set active tab state
  const [activeTab, setActiveTab] = useState<string>(
    defaultActiveTab || (items.length > 0 ? items[0].id : '')
  );

  // Update active tab when defaultActiveTab changes
  useEffect(() => {
    if (defaultActiveTab) {
      setActiveTab(defaultActiveTab);
    }
  }, [defaultActiveTab]);

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  // Get the current tab content
  const getActiveTabContent = () => {
    const activeItem = items.find((item) => item.id === activeTab);
    return activeItem ? activeItem.content : null;
  };

  // Styles for different variants
  const getTabListClasses = () => {
    switch (variant) {
      case 'pills':
        return 'space-x-2 bg-gray-100 p-1 rounded-md';
      case 'enclosed':
        return 'border-b border-gray-200';
      case 'underline':
        return 'border-b border-gray-200';
      default:
        return '';
    }
  };

  const getTabClasses = (isActive: boolean, isDisabled: boolean) => {
    let classes = 'px-4 py-2 text-sm font-medium transition-colors';

    if (isDisabled) {
      classes += ' text-gray-400 cursor-not-allowed';
      return classes;
    }

    classes += ' cursor-pointer';

    switch (variant) {
      case 'pills':
        classes += isActive
          ? ' bg-white text-primary shadow rounded-md'
          : ' text-gray-700 hover:text-primary';
        break;
      case 'enclosed':
        classes += isActive
          ? ' border-l border-t border-r border-gray-200 rounded-t-md bg-white text-primary -mb-px'
          : ' text-gray-700 hover:text-primary';
        break;
      case 'underline':
        classes += isActive
          ? ' text-primary border-b-2 border-primary'
          : ' text-gray-700 hover:text-primary';
        break;
      default:
        classes += isActive
          ? ' text-primary'
          : ' text-gray-700 hover:text-primary';
    }

    return classes;
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Tab List */}
      <div 
        className={`flex ${getTabListClasses()} ${fullWidth ? 'w-full' : ''} ${
          centered ? 'justify-center' : 'justify-start'
        }`}
        role="tablist"
        aria-orientation="horizontal"
      >
        {items.map((item) => (
          <button
            key={item.id}
            role="tab"
            className={`${getTabClasses(activeTab === item.id, !!item.disabled)} ${
              fullWidth ? 'flex-1 text-center' : ''
            }`}
            onClick={() => !item.disabled && handleTabChange(item.id)}
            aria-selected={activeTab === item.id}
            aria-disabled={item.disabled}
            tabIndex={activeTab === item.id ? 0 : -1}
            id={`tab-${item.id}`}
            aria-controls={`tabpanel-${item.id}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Tab Panel */}
      <div 
        className="mt-4"
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
        {getActiveTabContent()}
      </div>
    </div>
  );
};

export default Tabs; 
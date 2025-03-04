import React from 'react';
import { Button } from '../buttons';

type ISummaryAction = {
  title: string;
  content: string | JSX.Element;
  actionLabel: string;
  onAction?: () => void;
  disabled?: boolean;
};

export const SummaryAction: React.FC<ISummaryAction> = ({
                                                          title,
                                                          content,
                                                          actionLabel,
                                                          onAction,
                                                          disabled,
                                                        }) => {
  return (
    <div className="flex justify-between items-center p-4 rounded-lg style-stand-out style-border">
      <div className="w-2/3">
        <span className="text-xl font-semibold flex justify-between items-center">
          {title}
        </span>
        <div className="mt-1 flex justify-between items-center">
          <div>{content}</div>
        </div>
      </div>
      <div className="w-1/3 flex items-end  h-full">
        <Button
          label={actionLabel}
          onClick={onAction}
          className="style-primary-button"
          style={disabled ? { backgroundColor: 'transparent' } : {}}
        />
      </div>
    </div>
  );
};

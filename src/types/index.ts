export interface TableProps {
  data?: any[];
  showActionsColumn?: boolean;
  showActionButton?: boolean;
  actionButtonLabel?: string;
  onActionButtonClick?: () => void;
  onEditButtonClick?: (row: any) => void;
  onDeleteButtonClick?: (row: any) => void;
  incomeTotal?: number;
  expenseTotal?: number;
  showTotal?: boolean;
}
export interface ModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  type: string;
  initialData?: {
    description?: string;
    amount?: number | string;
    [key: string]: any;
  };
}

export type TableRowProps = {
  row: {
    date: string | number | Date;
    description: string;
    type: string;
    amount: number;
    [key: string]: any;
  };
  showActions: boolean | undefined;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
};

export interface NoDataProps {
  title?: string;
  description?: string;
  onAddIncome?: () => void;
  onAddExpense?: () => void;
  showIncomeAction?: boolean;
  showExpenseAction?: boolean;
}
export type IncomeExpenseType = {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: string;
};
export interface DateCellProps {
  date: string | Date | number;
  className?: string;
  formatOptions?: Intl.DateTimeFormatOptions;
}

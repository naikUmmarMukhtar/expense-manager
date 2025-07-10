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
  isOpen?: boolean;
  onClose?: () => void;
  onSubmit?: (data: any) => void;
  categoriesList?: { id: string; category: string; type: string }[];
  type?: string;
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
  onAddTransaction?: () => void;
  showIncomeAction?: boolean;
  showExpenseAction?: boolean;
  buttonLabel?: string;
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

export interface CategoryProps {
  id: string;
  type: string;
  category: string;
  date: string;
}
export interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { category: string; type: string }) => void;
  initialData?: {
    category?: string;
    type?: string;
    date?: Date | string;
  };
}

export type CategoryState = {
  category: string;
  type: string;
  date?: Date | undefined;
};

import React, { createContext, useState, useContext, ReactNode } from 'react';

export type Transaction = {
  id: number;
  title: string;
  date: string;
  amount: number;
  category: string;
  note: string;
  type: 'income' | 'expense';
};

type AppContextType = {
  incomeList: Transaction[];
  expenseList: Transaction[];
  setIncomeList: React.Dispatch<React.SetStateAction<Transaction[]>>;
  setExpenseList: React.Dispatch<React.SetStateAction<Transaction[]>>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [incomeList, setIncomeList] = useState<Transaction[]>([]);
  const [expenseList, setExpenseList] = useState<Transaction[]>([]);

  return (
    <AppContext.Provider value={{ incomeList, setIncomeList, expenseList, setExpenseList }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

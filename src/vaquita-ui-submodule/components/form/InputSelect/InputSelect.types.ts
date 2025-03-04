export interface Option<T extends string | number | undefined = string> {
  value: T;
  text: string;
}

export interface Props<T extends string | number | undefined> {
  label: string;
  options: Option<T>[];
  defaultValue?: T;
  value?: T;
  onChange?: (value: T) => void;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

import {
  DateFilterOptions,
  TimeFilterOptions,
} from "react-datepicker/dist/date_utils";
// TODO: UNINSTALL react-datepicker, REPLACE WITH NEXTUI
export interface Props {
  label: string;
  value?: Date;
  onChange?: (value: Date) => void;
  filterTime?: TimeFilterOptions["filterTime"];
  filterDate?: DateFilterOptions["filterDate"];
}

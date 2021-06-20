# React Calendar

## React Calendar useses react-material and momnet js to build a calendar

## install

```bash
npm i nikitkrsk-react-calendar
```

### How to use

```js
import CalendarComponent from "nikitkrsk-react-calendar";
<CalendarComponent onDateClick={(date, week) => console.log(date, week)} />; // 2021-June-17 :date - 24 :week of the year
```

### Avaliable props

```js
interface ICalendarComponent {
  /** initial Date value
   *
   *@default new Date()
   */
  startDate?: Date;
  /**
   * Title of the compoinent in text field, if null passed (doesn't work in keyboard mode)
   * @default ' '
   */
  title?: string;
  /**
   * Be Data in format of
   * @interface  IBackEndInput[]
   * @default 'undefined'
   */

  input?: IBackEndInput[];

  /**
   * Be Data in format of
   * @interface  ICalendarStyles
   * @default 'undefined'
   */

  styles?: ICalendarStyles;

  /**
   * Main Function which returns selected date
   * @param  {[date]} date:string ['date in format YYYY-MMMM-DD']
   * @param  {[week]} week"number ['week number']
   */
  onDateClick: (date: string, week?: number) => void;
  /**
   * Function which returns BE data for selected days
   * @param  {[IBackEndInput[] | []]} dates ['BE Dates']
   */
  onDatesSelect?: (dates: IBackEndInput[] | []) => void;
}
```
## Examples

### Example of BE data

```js
const exampleBeData = [
  {
    date: "2021-06-11T10:01:01.735Z",
    status: "active",
    info: "somne info",
  },
  {
    date: "2021-06-11T10:01:01.735Z",
    status: "pending",
    info: "somne info",
  },
];

<CalendarComponent
  input={exampleBeData}
  onDateClick={(date: any, week: any) => console.log(date, week)}// 2021-June-17 :date - 24 :week of the year
  onDatesSelect={(dates: any) => console.log(dates)}// exampleBeData for 11th of june if user clicks on 11-th
/>;
```

### Example of stylings

```js
const customStyles = {
  root: {
    background: "black",
    minWidth: 400,
    minHeight: 600,
    color: "white",
  },
  iconSize: {
    fill: "white",
    hover: {
      background: "white",
    },
  },
  weekDay: {
    border: "1px solid white",
    hover: {
      border: "1px solid green",
    },
  },
  success: {
    background: "purple",
  },
};

<CalendarComponent
  onDateClick={(date: any, week: any) => console.log(date, week)}
  styles={customStyles}
/>;
```

import * as React from 'react'
import * as Moment from "moment";
import { extendMoment, MomentRange } from "moment-range";
import clsx from "clsx";
;

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Theme } from "@material-ui/core";
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

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

interface ICalendarDate {
  start: number;
  end: number;
  week: number;
  amountOfDaysInWeek: {
    date: number;
    dayOfWeek: string;
    monthName: string;
    year: number;
  }[];
  year: number;
  monthName: string;
  monthNumber: number;
}

interface ICalendarStyles {
  root?: {
    background?: string;
    minWidth?: number | string;
    minHeight?: number | string;
    color?: string;
    borderRadius?: number | string;
  };
  iconSize?: {
    fill?: string;
    hover?: {
      background: string;
    };
  };
  weekDay?: {
    border?: string;
    hover?: {
      border?: string;
      color?: string
    };
  };
  success?: {
    background: string;
    
  };
  pending?: {
    background: string;
  };
  canceled?: {
    background: string;
  };
}

interface IBackEndInput {
  date: string;
  status: string;
  info: string;
}
enum ChangeMonthMethod {
  NEXT = "next",
  PREVIOUS = "previous",
}

/* 
  Moment Range definitions might be used to handle ranges if BE Date will be in format:
  {
    startDate: "someDate",
    endDate: "someDate"
  }
*/
const moment: MomentRange = extendMoment(Moment as any);

// Styles
const useStyles = makeStyles<Theme, ICalendarStyles>((theme) => ({
  root: {
    background: ({ root }) =>
      root?.background || theme.palette.background.default,
    color: ({ root }) => root?.color || "black",
    borderRadius: "4px",
    minWidth: ({ root }) => root?.minWidth || 450,
    minHeight: ({ root }) => root?.minHeight || 540,
  },
  title: {
    display: "flex",
    margin: theme.spacing(2, 1),
  },
  monthYearTitle: {
    display: "flex",
    justifyContent: "space-between",
    margin: theme.spacing(2, 1),
  },
  buttons: {
    display: "flex",
  },
  iconSize: {
    fill: ({ iconSize }) => iconSize?.fill || theme.palette.primary.main,
    width: 15,
    padding: theme.spacing(2),
    cursor: "pointer",
    borderRadius: "2px",
    height: 15,
    "&:hover": {
      background: ({ iconSize }) =>
        iconSize?.hover?.background || theme.palette.primary.light,
    },
  },
  weekDays: {
    display: "flex",
    justifyContent: "space-between",
  },
  weekDaysAbbr: {
    display: "flex",
    justifyContent: "space-between",
  },
  weekDayAbbr: {
    minHeight: 10,
    padding: theme.spacing(1),
    width: "100%",
  },
  weekDay: {
    minHeight: 40,
    padding: theme.spacing(1),
    width: "100%",
    cursor: "pointer",
    border:  ({ weekDay }) => weekDay?.border || `1px solid ${theme.palette.primary.light}`,
    "&:hover": {
      border: ({ weekDay }) => weekDay?.hover?.border || `1px solid ${theme.palette.secondary.light}`,
      color:  ({ weekDay }) => weekDay?.hover?.color || theme.palette.secondary.light,
    },
  },
  previousMonthWeekDay: {
    opacity: 0.4,
  },
  inputFormat: {
    display: "grid",
    gridGap: "4px 1px",

    gridTemplateColumns: "repeat(4, 25%)",
  },
  input: {
    minHeight: 7,
    maxWidth: 7,
    borderRadius: "100%",
  },
  success: {
    background: ({ success }) =>
      success?.background || theme.palette.success.main,
  },
  pending: {
    background: ({ pending }) =>
      pending?.background || theme.palette.warning.main,
  },
  canceled: {
    background: ({ canceled }) =>
      canceled?.background || theme.palette.error.main,
  },
}));

// CREATES RANGE FOR DATES IN CALENDAR
const CreateRangeWithWeekDays = (
  start: number,
  end: number,
  firstdayOfWeek: string,
  month: number,
  year: number
) => {
  let monthName = moment(`${month}-${year}`, "MMYYYY").format("MMMM");
  // Days names with abbreveations
  const daysInWeek = [
    { day: "Monday", abbr: "Mon" },
    { day: "Tuesday", abbr: "Tue" },
    { day: "Wednesday", abbr: "Wed" },
    { day: "Thursday", abbr: "Thu" },
    { day: "Friday", abbr: "Fri" },
    { day: "Saturday", abbr: "Sat" },
    { day: "Sunday", abbr: "Sun" },
  ];
  // Create copy of days in week to avoid future mutation of splice
  const daysInWeeksCopy = daysInWeek.slice();
  // Generate arr with existing dates
  const dayIndex = daysInWeek.map((e) => e.day).indexOf(firstdayOfWeek);
  const days = daysInWeeksCopy.splice(dayIndex);
  const daysArr = Array(end - start + 1)
    .fill(0)
    .map((_, idx) => {
      return {
        date: start + idx,
        dayOfWeek: days[idx]?.abbr || "",
        monthName,
        year,
      };
    });
  // If first or last week is not full and contains previous month dates add them to array
  if (end - start + 1 !== 7) {
    // first week is not full
    if (start === 1) {
      let monthLastDay = Number(
        moment(`${month}-${year}`, "MMYYYY")
          .subtract(1, "months")
          .endOf("month")
          .format("DD")
      );
      monthName = moment(`${month}-${year}`, "MMYYYY")
        .subtract(1, "months")
        .format("MMMM");
      if (monthName === "December") {
        year = year - 1;
      }

      let count = 7 - (end - start + 1);
      while (count > 0) {
        daysArr.unshift({
          date: monthLastDay,
          dayOfWeek: daysInWeek[count - 1]?.abbr || "",
          monthName,
          year,
        });
        count -= 1;
        monthLastDay -= 1;
      }
      // last week is not full
    } else {
      monthName = moment(`${month}-${year}`, "MMYYYY")
        .add(1, "months")
        .format("MMMM");
      let count = 7 - (end - start + 1);
      let monthFirstDay = 1;
      if (monthName === "January") {
        year = year + 1;
      }
      while (count > 0) {
        daysArr.push({
          date: monthFirstDay,
          dayOfWeek: daysInWeek[7 - count]?.abbr || "",
          monthName,
          year,
        });
        count -= 1;
        monthFirstDay += 1;
      }
    }
  }

  return daysArr;
};

//GET WEEKS BY MONTH
const GetfirstWeekEnd = (month: number, year: number) => {
  const date =
    parseInt(
      moment(`${month}-${1}-${year}`, "MMDYYYY").endOf("week").format("DD")
    ) + 1;
  const firstDay = date === 8 ? 1 : date;
  return firstDay;
};
const getWeeksStartAndEndInMonth = (month: number, year: number) => {
  const monthName = moment(`${month}-${year}`, "MMYYYY").format("MMMM");
  const daysInMonth = moment(`${year}-${month}`, "YYYY-MM").daysInMonth();
  let weeks = [];
  let start = 1;
  let end = GetfirstWeekEnd(month, year);
  while (start <= daysInMonth) {
    const week = moment(`${month}-${start}-${year}`, "MMDDYYYY").isoWeek();
    const firstdayOfWeek = moment(
      `${month}-${start}-${year}`,
      "MMDDYYYY"
    ).format("dddd");
    weeks.push({
      start: start,
      end: end,
      week: week,
      amountOfDaysInWeek: CreateRangeWithWeekDays(
        start,
        end,
        firstdayOfWeek,
        month,
        year
      ),
      year: year,
      monthName: monthName,
      monthNumber: Number(moment().month(monthName).format("MM")),
    });
    start = end + 1;
    end = end + 7;
    end = start === 1 && end === 8 ? 1 : end;
    if (end > daysInMonth) {
      end = daysInMonth;
    }
  }
  return weeks;
};

// Dates Compare
const compareDates = (calendarDate: string, inputDate: string) => {
  const dateFromCalendar = moment(`${calendarDate}`, "YYYY-MMMM-DD");
  const dateFromInput = moment(`${inputDate}`, "YYYY-MM-DD");

  return moment(dateFromCalendar).isSame(moment(dateFromInput));
};

// TODO - YEARS DROPDOWN
// const year = (new Date()).getFullYear();
// const years = Array.from(new Array(20),( val, index) => index + year);

// Main Component which renders
const CalendarComponent = (props: ICalendarComponent) => {
  const styles = props.styles ?? {};
  const classes = useStyles(styles);

  // CALENDAR DATA
  const [inputDates, setInputDates] = React.useState(props.input); // input dates from BE

  // Generate Dates From First Month
  const generateDates = (date: Date) => {
    var rows = [];

    let month = date.getMonth() + 1;
    let year = moment(date).year();
    year = month > 12 ? year + 1 : year;
    month = month > 12 ? month - 12 : month;
    rows.push(getWeeksStartAndEndInMonth(month, year));

    return rows;
  };
  // Set Dates for month on first loading
  const [calendarDates, setCalendarDates] = React.useState(
    generateDates(props.startDate ?? new Date())
  );

  // Change Calendar First Month and generate new dates
  const changeDate = (date: Date) => {
    const dates = generateDates(date);
    setCalendarDates(dates);
  };

  const HandleMonthChange = (
    month: number,
    year: number,
    method: ChangeMonthMethod
  ) => {
    let updated: string;
    if (method === ChangeMonthMethod.NEXT) {
      updated = moment(`${month}-${year}`, "MMYYYY").add(1, "months").format();
    } else {
      updated = moment(`${month}-${year}`, "MMYYYY")
        .subtract(1, "months")
        .format();
    }
    const updatedDate: Date = new Date(updated);

    changeDate(updatedDate);
  };

  React.useEffect(() => {
    return setInputDates(props.input);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.input?.length]);

  return (
    <div className={classes.root}>
      {props.title && (
        <Typography variant="h5" className={classes.title}>
          {props.title}
        </Typography>
      )}

      {calendarDates.map((cd: ICalendarDate[], i) => (
        <>
          <div className={classes.monthYearTitle}>
            <Typography variant="body1">
              {cd[i].monthName} {cd[i].year}
            </Typography>
            <div className={classes.buttons}>
              <NavigateBeforeIcon
                className={classes.iconSize}
                onClick={() =>
                  HandleMonthChange(
                    cd[i].monthNumber,
                    cd[i].year,
                    ChangeMonthMethod.PREVIOUS
                  )
                }
              />
              <NavigateNextIcon
                className={classes.iconSize}
                onClick={() =>
                  HandleMonthChange(
                    cd[i].monthNumber,
                    cd[i].year,
                    ChangeMonthMethod.NEXT
                  )
                }
              />
            </div>
          </div>
          <div className={classes.weekDaysAbbr}>
            {cd[i].amountOfDaysInWeek.map((week) => (
              <div className={classes.weekDayAbbr}>
                <Typography variant="body2">{week.dayOfWeek}</Typography>
              </div>
            ))}
          </div>
          {cd.map((weeks, index) => (
            <div className={classes.weekDays}>
              {weeks.amountOfDaysInWeek.map((week) => (
                <div
                  className={clsx(classes.weekDay, {
                    [classes.previousMonthWeekDay]:
                      week.monthName !== cd[i].monthName,
                  })}
                  onClick={() => {
                    props.onDateClick(
                      `${week.year}-${week.monthName}-${week.date}`,
                      cd[index].week
                    );
                    props.onDatesSelect !== undefined &&
                      props.onDatesSelect(
                        inputDates === undefined
                          ? []
                          : inputDates.filter((inputDate) =>
                              compareDates(
                                `${week.year}-${week.monthName}-${week.date}`,
                                `${inputDate.date}`
                              )
                            )
                      );
                  }}
                >
                  <Typography variant="body2">{week.date}</Typography>
                  <div className={classes.inputFormat}>
                    {inputDates !== undefined &&
                      inputDates.length !== 0 &&
                      inputDates.map((inputDate) => {
                        const checkStatus = compareDates(
                          `${week.year}-${week.monthName}-${week.date}`,
                          `${inputDate.date}`
                        );
                        return (
                          checkStatus && (
                            <div
                              // More Colors Can Be Implemented Here with checks of different params

                              className={clsx(classes.input, {
                                [classes.success]: inputDates.some(
                                  (_) =>
                                    compareDates(
                                      `${week.year}-${week.monthName}-${week.date}`,
                                      `${inputDate.date}`
                                    ) && inputDate.status === "active"
                                ),
                                [classes.pending]: inputDates.some(
                                  (_) =>
                                    compareDates(
                                      `${week.year}-${week.monthName}-${week.date}`,
                                      `${inputDate.date}`
                                    ) && inputDate.status === "pending"
                                ),
                                [classes.canceled]: inputDates.some(
                                  (_) =>
                                    compareDates(
                                      `${week.year}-${week.monthName}-${week.date}`,
                                      `${inputDate.date}`
                                    ) && inputDate.status === "canceled"
                                ),
                              })}
                            />
                          )
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </>
      ))}
    </div>
  );
};

export default CalendarComponent;

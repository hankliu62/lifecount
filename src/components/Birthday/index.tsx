import { Calendar, CalendarProps, Input } from '@hankliu/hankliu-ui';
import classNames from 'classnames';
import { Dayjs } from 'dayjs';
import moment, { Moment } from 'moment';
import { HolidayUtil, Lunar } from 'lunar-typescript';
import React, { useCallback, useState } from 'react';
import { CloseOutlined, IconCycle } from '@hankliu/icons';

interface IBirthdayProps {
  value: Moment;
  onChange: (date: Moment) => void;
}

const Birthday = ({ value, onChange }: IBirthdayProps) => {
  const [selectDate, setSelectDate] = useState<Moment>(value);
  const [date, setDate] = useState<string>(selectDate?.format('YYYY-MM-DD'));
  // 是否展开
  const [expanded, setExpanded] = useState<boolean>(false);

  const dateFullCellRender: CalendarProps<Moment>['dateFullCellRender'] = (date) => {
    const d = Lunar.fromDate(date.toDate());
    const lunar = d.getDayInChinese();
    const solarTerm = d.getJieQi();
    const h = HolidayUtil.getHoliday(date.get('year'), date.get('month') + 1, date.get('date'));
    const displayHoliday = h?.getTarget() === h?.getDay() ? h?.getName() : undefined;
    return (
      <div
        className={classNames(
          "hlui-picker-cell-inner hlui-picker-calendar-date !rounded-[4px] !bg-transparent !p-4 transition-[background] duration-300 before:absolute before:bottom-0 before:left-0 before:right-0 before:top-0 before:rounded-[4px] before:content-[''] hover:before:bg-black/5",
          {
            'text-white before:bg-[#1677ff] hover:before:!bg-[#1677ff] hover:before:opacity-80':
              selectDate?.isSame(date, 'date'),
            'hover:before:border-[1px_solid_#1677ff]': date.isSame(moment(), 'date'),
          },
        )}
      >
        <div className={classNames('relative m-auto box-border')}>
          <div className="relative z-[1]">
            <div
              className={classNames('hlui-picker-calendar-date-value', {
                '!text-white': selectDate?.isSame(date, 'date'),
              })}
            >
              {date.get('date')}
            </div>
            <div
              className={classNames(
                'hlui-picker-calendar-date-content !text-right text-white opacity-90',
                {
                  '!text-black/25': date.isAfter(moment()) || !selectDate?.isSame(date, 'month'),
                  '!text-white': selectDate?.isSame(date, 'date'),
                },
              )}
            >
              {displayHoliday || solarTerm || lunar}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const monthFullCellRender: CalendarProps<Moment>['monthFullCellRender'] = (date) => {
    const month = '正_二_三_四_五_六_七_八_九_十_冬_腊'.split('_');
    return (
      <div
        className={classNames(
          'hlui-picker-cell-inner hlui-picker-calendar-date !rounded-[4px] hover:!border-transparent hover:bg-black/5',
          {
            '!bg-[#1677ff] hover:!bg-[#1677ff] hover:!opacity-80': selectDate?.isSame(
              date,
              'month',
            ),
          },
        )}
      >
        <div
          className={classNames('hlui-picker-calendar-date-value py-[5px] text-black', {
            '!text-white': selectDate?.isSame(date, 'month'),
            'opacity-30': date.isAfter(moment()),
          })}
        >
          {date.get('month') + 1}月（{month[date.get('month')]}月）
        </div>
        <div className="hlui-picker-calendar-date-content" />
      </div>
    );
  };

  const onChangeDate = useCallback(
    (date: Moment) => {
      if (date.isValid() && !date.isSame(selectDate, 'day')) {
        setDate(date.isValid() ? date.format('YYYY-MM-DD') : undefined);
        setSelectDate(date.isValid() ? date : undefined);

        onChange(date);
      }
    },
    [selectDate],
  );

  return (
    <div className="relative">
      <Input
        onBlur={(e) => {
          const current = moment(e.target.value);
          console.log(current.isValid());
          onChangeDate(current);
        }}
        onFocus={() => {
          setExpanded(true);
        }}
        defaultValue={selectDate ? selectDate.format('YYYY-MM-DD') : ''}
        value={date}
        onChange={(e) => setDate(e.target.value)}
        placeholder="请输入您的生日"
        suffix={<IconCycle className="opacity-70" />}
        size="large"
      />
      <div className="relative h-auto">
        <div
          className={classNames(
            'h-0 overflow-hidden opacity-0 transition-[opacity,_height] delay-[0ms,0ms] duration-[500ms,_500ms]',
            {
              'h-[960px] opacity-100': expanded,
            },
          )}
        >
          <span
            className={classNames('absolute left-0 top-[5px] p-[5px] text-[20px] text-black/50', {
              'cursor-pointer': expanded,
            })}
            onClick={() => {
              expanded && setExpanded((prev) => !prev);
            }}
          >
            <CloseOutlined />
          </span>
          <Calendar
            validRange={[moment().add(-200, 'year'), moment().add(50, 'year')]}
            dateFullCellRender={dateFullCellRender}
            monthFullCellRender={monthFullCellRender}
            value={selectDate}
            onChange={onChangeDate}
            disabledDate={(date) => date.isAfter(moment())}
          />
        </div>
      </div>
    </div>
  );
};

export default Birthday;

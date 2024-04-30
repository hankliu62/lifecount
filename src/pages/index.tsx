import AOS from 'aos';
import React, { useEffect, useMemo, useState } from 'react';
import type { Moment } from 'moment';
import moment from 'moment';
import { Card, Tooltip } from '@hankliu/hankliu-ui';

import Birthday from '@/components/Birthday';
import {
  FieldTimeOutlined,
  IconCycle,
  IconMango,
  IconRecord,
  InfoCircleOutlined,
} from '@hankliu/icons';
import classNames from 'classnames';

// 最大年龄
const MaxAge = 100;
// 格子数量
const TotalGrid = 400;
// 生小孩年龄
const KidsAge = 28;
// 小孩长大陪伴年龄
const KidsGrowAge = 18;
// 每天陪伴小孩时长
const AccompanyKidsGrowHourDaily = 5;
// 每天工作时长
const WorkHourDaily = 8;
// 每天睡觉时长
const SleepHourDaily = 8;
// 退休年龄
const RetireAge = 65;

/**
 * 人生一格
 *
 * @returns
 */
export default function Index() {
  const [birthday, setBirthday] = useState<Moment>();
  const [current, setCurrent] = useState<Moment>(moment());
  // 过去多少年
  const passedYear = useMemo<string>(() => {
    if (birthday) {
      const end = birthday.clone().set('year', current.get('year'));
      const start = end.clone().add(-1, 'year');
      if (!end.isAfter(current, 'day')) {
        end.add(1, 'year');
        start.add(1, 'year');
      }
      return (
        current.clone().startOf('day').diff(birthday.clone().startOf('day'), 'year') +
        (current.valueOf() - start.valueOf()) / (end.valueOf() - start.valueOf())
      ).toFixed(2);
    }
    return undefined;
  }, [birthday, current]);

  // 还剩多少年
  const featureYear = useMemo<string>(() => {
    if (birthday) {
      return (MaxAge - parseFloat(passedYear)).toFixed(2);
    }
    return undefined;
  }, [birthday, passedYear]);

  // 过去多少月
  const passedMonth = useMemo<string>(() => {
    if (birthday) {
      const end = birthday
        .clone()
        .set('year', current.get('year'))
        .set('month', current.get('month'));
      const start = end.clone().add(-1, 'month');
      if (!end.isAfter(current, 'day')) {
        end.add(1, 'month');
        start.add(1, 'month');
      }

      return (
        current.clone().startOf('day').diff(birthday.clone().startOf('day'), 'month') +
        (current.valueOf() - start.valueOf()) / (end.valueOf() - start.valueOf())
      ).toFixed(2);
    }
    return undefined;
  }, [birthday, current]);

  // 还剩多少月
  const featureMonth = useMemo<string>(() => {
    if (birthday) {
      return (MaxAge * 12 - parseFloat(passedMonth)).toFixed(2);
    }
    return undefined;
  }, [birthday, passedMonth]);

  // 过去多少天
  const passedDay = useMemo<string>(() => {
    if (birthday) {
      const end = birthday
        .clone()
        .set('year', current.get('year'))
        .set('month', current.get('month'))
        .set('day', current.get('day'));
      const start = end.clone().add(-1, 'month');
      if (!end.isAfter(current, 'day')) {
        end.add(1, 'day');
        start.add(1, 'day');
      }
      return (
        current.clone().startOf('day').diff(birthday.clone().startOf('day'), 'day') +
        (current.valueOf() - start.valueOf()) / (end.valueOf() - start.valueOf())
      ).toFixed(2);
    }
    return undefined;
  }, [birthday, current]);

  // 还剩多少天
  const featureDay = useMemo<string>(() => {
    if (birthday) {
      const end = birthday.clone().set('year', current.get('year') + MaxAge);
      return (
        end.clone().startOf('day').diff(current.clone().startOf('day'), 'day') -
        parseFloat(passedDay)
      ).toFixed(2);
    }
    return undefined;
  }, [birthday, passedDay]);

  // 过去多少小时
  const passedHour = useMemo<string>(() => {
    if (birthday) {
      return (
        current.diff(birthday.clone().startOf('day'), 'hour') +
        current.get('minute') / 60
      ).toFixed(2);
    }
    return undefined;
  }, [birthday, current]);

  // 还剩多少小时
  const featureHour = useMemo<string>(() => {
    if (birthday) {
      const end = birthday.clone().set('year', current.get('year') + MaxAge);
      return (end.clone().startOf('day').diff(current, 'hour') - parseFloat(passedDay)).toFixed(2);
    }
    return undefined;
  }, [birthday, passedDay]);

  // 过去多少分钟
  const passedMinute = useMemo<string>(() => {
    if (birthday) {
      return (
        current.diff(birthday.clone().startOf('day'), 'minute') +
        current.get('second') / 60
      ).toFixed(2);
    }
    return undefined;
  }, [birthday, current]);

  // 还剩多少分钟
  const featureMinute = useMemo<string>(() => {
    if (birthday) {
      const end = birthday.clone().set('year', current.get('year') + MaxAge);
      return (
        end.clone().startOf('day').diff(current, 'minute') - parseFloat(passedMinute)
      ).toFixed(2);
    }
    return undefined;
  }, [birthday, passedMinute]);

  // 过去多少秒
  const passedSecond = useMemo<string>(() => {
    if (birthday) {
      return (
        current.diff(birthday.clone().startOf('day'), 'second') +
        current.get('millisecond') / 1000
      ).toFixed(2);
    }
    return undefined;
  }, [birthday, current]);

  // 还剩多少秒
  const featureSecond = useMemo<string>(() => {
    if (birthday) {
      const end = birthday.clone().set('year', current.get('year') + MaxAge);
      return (
        end.clone().startOf('day').diff(current, 'second') - parseFloat(passedSecond)
      ).toFixed(2);
    }
    return undefined;
  }, [birthday, passedSecond]);

  // 逝去的生命格子
  const grids = useMemo<
    { key: string; color: string; className?: string; tooltip: string }[]
  >(() => {
    if (birthday) {
      const passedYearNumber = parseFloat(passedYear);
      const passedLength = Math.ceil((passedYearNumber * TotalGrid) / MaxAge);
      // 过去的格子
      const passedGrids = new Array(passedLength).fill(1).map((_, index) => ({
        key: `passedGrids_${index}`,
        color: '#faad14',
        className: classNames('passed-grid', {
          'animate-[flash_2s_ease_infinite]': passedLength === index + 1,
        }),
        tooltip: `已经过去 ${passedYear} 年了`,
      }));

      // 每一天有1/3用来睡觉
      const sleepLength = Math.ceil(
        (((parseFloat(featureYear) * SleepHourDaily) / 24) * TotalGrid) / MaxAge,
      );
      // 睡觉的格子
      const sleepGrids = new Array(sleepLength).fill(1).map((_, index) => ({
        key: `sleepGrids_${index}`,
        color: '#1677ff',
        className: 'sleep-grid',
        tooltip: `您总共有 ${passedYear} 年时长的睡眠时光，记得说晚安哦`,
      }));

      // 到65岁退休还有多少年
      const retireYear = RetireAge - passedYearNumber;
      let retireGrids = [];
      // 小于65岁
      if (retireYear > 0) {
        // 每一天有1/3用来工作
        const retireLength = Math.ceil((((retireYear * WorkHourDaily) / 24) * TotalGrid) / MaxAge);
        retireGrids = new Array(retireLength).fill(1).map((_, index) => ({
          key: `retireGrids_${index}`,
          color: '#722ed1',
          className: 'retire-grid',
          tooltip: `您距离退休总共还需要工作 ${((retireYear * WorkHourDaily) / 24).toFixed(2)} 年的时光，加油哦`,
        }));
      }

      // 陪伴孩子时间
      let kidsLength = 0;
      if (passedYearNumber < KidsAge) {
        // 18年中每一天有5/24用来陪伴孩子
        kidsLength = Math.ceil(
          (((KidsGrowAge * AccompanyKidsGrowHourDaily) / 24) * TotalGrid) / MaxAge,
        );
      } else if (passedYearNumber < KidsAge + KidsGrowAge) {
        // 在孩子未满18岁前
        // 剩余的年中每一天有5/24用来陪伴孩子
        kidsLength = Math.ceil(
          ((((KidsAge + KidsGrowAge - passedYearNumber) * AccompanyKidsGrowHourDaily) / 24) *
            TotalGrid) /
            MaxAge,
        );
      }
      const kidsGrids = new Array(kidsLength).fill(1).map((_, index) => ({
        key: `kidsGrids_${index}`,
        color: '#13c2c2',
        className: 'kids-grid',
        tooltip: `您总共有 ${(((KidsAge + KidsGrowAge - passedYearNumber) * AccompanyKidsGrowHourDaily) / 24).toFixed(2)} 年时长的亲子童年成长时光，好好珍惜哦`,
      }));

      // 陪伴父母的时间
      let parentGrids = [];
      if (passedYearNumber < MaxAge - KidsAge) {
        // 每一年按365天计算，每个月一天
        const parentLength = Math.ceil(
          ((((MaxAge - KidsAge - passedYearNumber) * 12) / 365) * TotalGrid) / MaxAge,
        );

        parentGrids = new Array(parentLength).fill(1).map((_, index) => ({
          key: `parentGrids_${index}`,
          color: '#f759ab',
          className: 'parent-grid',
          tooltip: `您总共有 ${(((MaxAge - KidsAge - passedYearNumber) * 12) / 365).toFixed(2)} 年时长的父母陪伴时光，常回家看看吧`,
        }));
      }

      const currentGrids = [].concat(passedGrids, sleepGrids, retireGrids, kidsGrids, parentGrids);

      // 自由时间
      const freeLength = 400 - currentGrids.length - 1;
      const freeGrids = new Array(freeLength).fill(1).map((_, index) => ({
        key: `freeGrids_${index}`,
        color: '#52c41a',
        className: 'free-grid',
        tooltip: `您总共有 ${(freeLength / 4).toFixed(2)} 年时长的自由时光，用心规划吧`,
      }));

      // 65岁退休的格子
      const retiringGrid = {
        key: `retiringGrids_0`,
        color: '#f5222d',
        className: 'retiring-grid',
        tooltip: `恭喜您，您退休了`,
      };

      const totalGrids = currentGrids.concat(freeGrids);
      totalGrids.splice(((RetireAge - 1) * TotalGrid) / MaxAge + 1, 0, retiringGrid);
      return totalGrids;
    }
    return undefined;
  }, [birthday, passedYear]);

  useEffect(() => {
    AOS.init();
    let requestAnimationTime;

    const restoreCurrent = () => {
      setCurrent(moment());

      requestAnimationTime = window.requestAnimationFrame(restoreCurrent);
    };

    requestAnimationTime = window.requestAnimationFrame(restoreCurrent);

    return () => {
      requestAnimationTime && window.cancelAnimationFrame(requestAnimationTime);
    };
  }, []);

  return (
    <div className="relative w-full text-white/75">
      <div className="relative z-20 mx-auto mt-6 w-full max-w-[1920px]">
        <div className="flex flex-col flex-wrap">
          {/* 生日 */}
          <div
            data-aos="fade-up"
            data-aos-offset="200"
            data-aos-delay="50"
            data-aos-duration="1000"
            data-aos-easing="ease-in-out"
            data-aos-mirror="true"
            data-aos-once="true"
            className="info-card group relative flex w-full flex-col content-between justify-between gap-[24px] overflow-hidden rounded-[4px] p-[24px] ease-in"
          >
            <Card bordered className="relative shadow-lg">
              <Tooltip title="您的生日">
                <div className="absolute top-0 flex h-[40px] w-[40px] -translate-y-1/2 items-center justify-center rounded bg-[#1677ff]">
                  <IconCycle className="text-[20px] text-white" />
                </div>
              </Tooltip>
              <div className="relative grid grid-cols-1 gap-4 pt-4">
                <Birthday value={birthday} onChange={(date) => setBirthday(date)} />
              </div>
            </Card>
          </div>

          {/* 过去的时光 */}
          {birthday && (
            <div className="info-card group relative flex w-full flex-col content-between justify-between gap-[24px] overflow-hidden rounded-[4px] p-[24px] ease-in">
              <Card bordered className="relative shadow-lg">
                <Tooltip title="逝去的时光">
                  <div className="absolute top-0 flex h-[40px] w-[40px] -translate-y-1/2 items-center justify-center rounded bg-[#1677ff]">
                    <FieldTimeOutlined className="text-[20px] text-white" />
                  </div>
                </Tooltip>
                <div className="relative grid grid-cols-3 grid-rows-2 gap-4 pt-4">
                  <div className="flex items-end justify-center">
                    <div className="text-3xl font-medium text-black/80">{passedYear}</div>
                    <div className="ml-2 text-base text-[#999]">年</div>
                  </div>

                  <div className="flex items-end justify-center">
                    <div className="text-3xl font-medium text-black/80">{passedMonth}</div>
                    <div className="ml-2 text-base text-[#999]">月</div>
                  </div>

                  <div className="flex items-end justify-center">
                    <div className="text-3xl font-medium text-black/80">{passedDay}</div>
                    <div className="ml-2 text-base text-[#999]">天</div>
                  </div>

                  <div className="flex items-end justify-center">
                    <div className="text-3xl font-medium text-black/80">{passedHour}</div>
                    <div className="ml-2 text-base text-[#999]">小时</div>
                  </div>

                  <div className="flex items-end justify-center">
                    <div className="text-3xl font-medium text-black/80">{passedMinute}</div>
                    <div className="ml-2 text-base text-[#999]">分钟</div>
                  </div>

                  <div className="flex items-end justify-center">
                    <div className="text-3xl font-medium text-black/80">{passedSecond}</div>
                    <div className="ml-2 text-base text-[#999]">秒</div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* 未来的时光 */}
          {birthday && (
            <div className="info-card group relative flex w-full flex-col content-between justify-between gap-[24px] overflow-hidden rounded-[4px] p-[24px] ease-in">
              <Card bordered className="relative shadow-lg">
                <Tooltip title="未来的时光">
                  <div className="absolute top-0 flex h-[40px] w-[40px] -translate-y-1/2 items-center justify-center rounded bg-[#1677ff]">
                    <IconRecord className="text-[20px] text-white" />
                  </div>
                </Tooltip>
                <div className="relative grid grid-cols-3 grid-rows-2 gap-4 pt-4">
                  <div className="flex items-end justify-center">
                    <div className="text-3xl font-medium text-black/80">{featureYear}</div>
                    <div className="ml-2 text-base text-[#999]">年</div>
                  </div>

                  <div className="flex items-end justify-center">
                    <div className="text-3xl font-medium text-black/80">{featureMonth}</div>
                    <div className="ml-2 text-base text-[#999]">月</div>
                  </div>

                  <div className="flex items-end justify-center">
                    <div className="text-3xl font-medium text-black/80">{featureDay}</div>
                    <div className="ml-2 text-base text-[#999]">天</div>
                  </div>

                  <div className="flex items-end justify-center">
                    <div className="text-3xl font-medium text-black/80">{featureHour}</div>
                    <div className="ml-2 text-base text-[#999]">小时</div>
                  </div>

                  <div className="flex items-end justify-center">
                    <div className="text-3xl font-medium text-black/80">{featureMinute}</div>
                    <div className="ml-2 text-base text-[#999]">分钟</div>
                  </div>

                  <div className="flex items-end justify-center">
                    <div className="text-3xl font-medium text-black/80">{featureSecond}</div>
                    <div className="ml-2 text-base text-[#999]">秒</div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* 时光格子 */}
          {birthday && (
            <div className="info-card group relative flex w-full flex-col content-between justify-between gap-[24px] overflow-hidden rounded-[4px] p-[24px] ease-in">
              <Card bordered className="relative shadow-lg">
                <Tooltip title="时光格子">
                  <div className="absolute top-0 flex h-[40px] w-[40px] -translate-y-1/2 items-center justify-center rounded bg-[#1677ff]">
                    <IconMango className="text-[20px] text-white" />
                  </div>
                </Tooltip>
                <div className="relative flex justify-center pt-4">
                  <div className="grid-cols-20 grid-rows-20 grid w-[29.75rem] gap-1">
                    {grids?.map((item) => (
                      <Tooltip title={item.tooltip} key={item.key}>
                        <div
                          key={item.key}
                          className={classNames('h-5 w-5 rounded-sm', {
                            [item.className]: item.className,
                          })}
                          style={{ backgroundColor: item.color }}
                        />
                      </Tooltip>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* 使用说明 */}
          <div
            data-aos="fade-up"
            data-aos-offset="200"
            data-aos-delay="50"
            data-aos-duration="1000"
            data-aos-easing="ease-in-out"
            data-aos-mirror="true"
            data-aos-once="true"
            className="info-card group relative flex w-full flex-col content-between justify-between gap-[24px] overflow-hidden rounded-[4px] p-[24px] ease-in"
          >
            <Card bordered className="relative shadow-lg">
              <Tooltip title="使用说明">
                <div className="absolute top-0 flex h-[40px] w-[40px] -translate-y-1/2 items-center justify-center rounded bg-[#1677ff]">
                  <InfoCircleOutlined className="text-[20px] text-white" />
                </div>
              </Tooltip>
              <div className="relative grid grid-cols-1 gap-4 pt-4">
                <div className="text-base">
                  <div className="mb-2">
                    参考了小程序 <span className="font-semibold">lifecount</span> 而制作的网页版本。
                  </div>
                  <div>
                    假设未来医疗技术高速发展，人类的平均寿命是{' '}
                    <span className="font-semibold">{MaxAge}</span> 岁，我们将其平均分为{' '}
                    <span className="font-semibold">{TotalGrid}</span> 个方块。
                  </div>
                </div>
                <ul className="m-0 grid list-none grid-cols-1 gap-1 p-0 text-base">
                  <li className="flex items-center justify-start">
                    <span className="h-4 w-4 rounded-sm bg-[#faad14]"></span>
                    <span className="ml-3 flex-1">你逝去的时光。</span>
                  </li>

                  <li className="flex items-center justify-start">
                    <span className="h-4 w-4 rounded-sm bg-[#1677ff]"></span>
                    <span className="ml-3 flex-1">
                      如果你平均每天休息 <span className="font-semibold">{SleepHourDaily}</span>{' '}
                      小时，这是你余下生命里睡眠占用的时间。
                    </span>
                  </li>

                  <li className="flex items-center justify-start">
                    <span className="h-4 w-4 rounded-sm bg-[#722ed1]"></span>
                    <span className="ml-3 flex-1">
                      如果你 <span className="font-semibold">{RetireAge}</span>{' '}
                      岁退休，退休前平均每天工作{' '}
                      <span className="font-semibold">{WorkHourDaily}</span>{' '}
                      小时，这是你余下生命里工作占用的时间。
                    </span>
                  </li>

                  <li className="flex items-center justify-start">
                    <span className="h-4 w-4 rounded-sm bg-[#f5222d]"></span>
                    <span className="ml-3 flex-1">
                      <span className="font-semibold">{RetireAge}</span> 岁，你退休了。
                    </span>
                  </li>

                  <li className="flex items-center justify-start">
                    <span className="h-4 w-4 rounded-sm bg-[#13c2c2]"></span>
                    <span className="ml-3 flex-1">
                      如果你 <span className="font-semibold">{KidsAge}</span> 岁生孩子，孩子{' '}
                      <span className="font-semibold">{KidsGrowAge}</span> 岁出门上大学，这{' '}
                      <span className="font-semibold">{KidsGrowAge}</span> 年里你平均每天能花{' '}
                      <span className="font-semibold">{AccompanyKidsGrowHourDaily}</span>{' '}
                      个小时陪伴孩子，这里是你余下生命里所用去的时光。
                    </span>
                  </li>

                  <li className="flex items-center justify-start">
                    <span className="h-4 w-4 rounded-sm bg-[#f759ab]"></span>
                    <span className="ml-3 flex-1">
                      如果你每个月能看望父母一天，在他们{' '}
                      <span className="font-semibold">{MaxAge}</span>{' '}
                      岁前，这是你的余生里还能陪伴他们的时光。
                    </span>
                  </li>

                  <li className="flex items-center justify-start">
                    <span className="h-4 w-4 rounded-sm bg-[#52c41a]"></span>
                    <span className="ml-3 flex-1">除了以上之外，你能自由支配的时光。</span>
                  </li>
                </ul>

                <div className="text-base">数据仅供娱乐，人生苦短，奋斗吧，少年们~</div>
                <div className="text-base">
                  人生就像一次旅行，不必在乎目的地，在乎的是沿途的风景以及看风景的心情。
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

import classNames from 'classnames';
import type { CSSProperties} from 'react';
import { useEffect, useMemo, useState } from 'react';
import BTween from 'b-tween';
import uniqueId from 'lodash.uniqueid';

interface ICloudProps {
  height: number;
  className?: string;
  // 是否开启动画
  animated?: boolean;
  // 持续时间
  duration?: number;
  // 动画方向
  direction?: CSSProperties['animationDirection'];
}
export default function Cloud({
  className,
  animated = true,
  duration,
  height,
  direction = 'normal',
}: ICloudProps) {
  const scale = useMemo(() => {
    return ~~(20 + 30 * Math.random()) / 100;
  }, [animated]);

  // 持续时间
  const countDuration = useMemo(
    () => ~~(duration || Math.random() * 5 * 60 * 1000 + 5 * 60 * 1000),
    [duration],
  );

  // 延迟时间
  const animationDelay = useMemo(() => ~~(Math.random() * 10 * 1000), []);
  // 动画名称
  const animationName = useMemo(
    () =>
      ['cloud-move-mid', 'cloud-move-quick', 'cloud-move-slow'].sort(() => Math.random() - 0.5)[0],
    [],
  );
  // 动画方向
  const animationDirection = useMemo(
    () => (['cloud-move-mid'].includes(animationName) ? 'normal' : direction),
    [direction, animationName],
  );

  const filterBack = useMemo(() => `filter-back-${uniqueId()}`, []);
  const filterMid = useMemo(() => `filter-mid-${uniqueId()}`, []);
  const filterFront = useMemo(() => `filter-front-${uniqueId()}`, []);

  // 云的形状
  const [baseFrequency, setBaseFrequency] = useState<number>(0.012);
  // 位置
  const translateX = useMemo(() => -500 + 300 * Math.random(), []);
  const translateY = useMemo(() => -50 + height * 2 * Math.random(), []);

  useEffect(() => {
    let tween;
    if (animated) {
      const baseFrequencyFrom =
        0.012 + (~~(6 * Math.random()) * (Math.random() > 0.5 ? -1 : 1)) / 1000;
      const baseFrequencyTo = Math.max(
        baseFrequencyFrom + 0.005 * (Math.random() > 0.5 ? -1 : 1),
        0.006,
      );
      // const translateFrom = -1000 + ~~(400 * Math.random());
      // const translateTo = document.documentElement.clientWidth + Math.abs(baseFrequencyFrom);
      tween = new BTween({
        from: {
          baseFrequency: baseFrequencyFrom,
          // translate: translateFrom, // 很卡
        },
        to: {
          baseFrequency: baseFrequencyTo,
          // translate: translateTo,
        },
        duration: countDuration,
        easing: 'quartOut',
        onUpdate: (keys) => {
          setBaseFrequency(keys.baseFrequency);
          // setTranslateX(keys.translate);
        },
        onFinish: () => {
          setBaseFrequency(baseFrequencyTo);
        },
      });
      tween.start();
    }

    return () => {
      tween && tween.stop();
    };
  }, [animated]);

  return (
    <div
      className={classNames('cloud-container absolute left-0 top-0 opacity-0 transition-all', {
        [className]: className,
      })}
      style={{
        animation: `${animationName} ${countDuration}ms ease ${animationDelay}ms ${animationDirection} infinite`,
      }}
    >
      <div style={{ transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)` }}>
        <div
          className="cloud-back absolute left-0 top-0 h-[275px] w-[500px] rounded-[50%] shadow-[300px_300px_30px_-20px_#fff]"
          style={{ filter: `url('#${filterBack}')` }}
        />
        <div
          className="cloud-mid absolute left-0 top-0 h-[275px] w-[500px] rounded-[50%] shadow-[300px_340px_70px_-60px_rgba(158,_168,_179,_0.5)]"
          style={{ filter: `url('#${filterMid}')` }}
        />
        <div
          className="cloud-front absolute left-0 top-0 h-[275px] w-[500px] rounded-[50%] shadow-[300px_370px_60px_-100px_rgba(0,_0,_0,_0.3)]"
          style={{ filter: `url('#${filterFront}')` }}
        />
        <svg className="hidden" width="0" height="0">
          <filter id={filterBack}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency={baseFrequency}
              numOctaves="4"
              seed="0"
            ></feTurbulence>
            <feDisplacementMap in="SourceGraphic" scale="170"></feDisplacementMap>
          </filter>
          <filter id={filterMid}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency={baseFrequency}
              numOctaves="2"
              seed="0"
            ></feTurbulence>
            <feDisplacementMap in="SourceGraphic" scale="150"></feDisplacementMap>
          </filter>
          <filter id={filterFront}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency={baseFrequency}
              numOctaves="2"
              seed="0"
            ></feTurbulence>
            <feDisplacementMap in="SourceGraphic" scale="100"></feDisplacementMap>
          </filter>
        </svg>
      </div>
    </div>
  );
}

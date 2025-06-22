import { Box, createStyles } from '@mantine/core';
import { useEffect, useState } from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useNuiEvent } from '../../../hooks/useNuiEvent';
import { fetchNui } from '../../../utils/fetchNui';
import { isIconUrl } from '../../../utils/isIconUrl';
import ScaleFade from '../../../transitions/ScaleFade';
import type { RadialMenuItem } from '../../../typings';
import { useLocales } from '../../../providers/LocaleProvider';
import LibIcon from '../../../components/LibIcon';

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  sector: {
    // fill: theme.colors.basicBg[2],
    fill: "#141B25",
    color: '#fff',

    '&:hover': {
      fill: '#222D3D',
      cursor: 'pointer',
      '> g > text, > g > svg > path': {
        fill: '#fff',
      },
    },
    '> g > text': {
      fill: '#fff',
      strokeWidth: 0,
    },
  },
  backgroundCircle: {
    fill: theme.colors.basicBg[2],
    stroke: theme.colors.basicBg[2],
    strokeWidth: 10,
  },
  centerCircle: {
    fill: theme.colors.mainColor[0],
    color: '#fff',
    stroke: theme.colors.basicBg[2],
    strokeWidth: 5,
    '&:hover': {
      cursor: 'pointer',
      fill: '#BA1A26',
    },
  },
  centerIconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
  },
  centerIcon: {
    color: '#fff',
  },
}));

const calculateFontSize = (text: string): number => {
  if (text.length > 20) return 10;
  if (text.length > 15) return 12;
  return 13;
};

const splitTextIntoLines = (text: string, maxCharPerLine: number = 15): string[] => {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    if (currentLine.length + words[i].length + 1 <= maxCharPerLine) {
      currentLine += ' ' + words[i];
    } else {
      lines.push(currentLine);
      currentLine = words[i];
    }
  }
  lines.push(currentLine);
  return lines;
};

const PAGE_ITEMS = 6;

const degToRad = (deg: number) => deg * (Math.PI / 180);

const RadialMenu: React.FC = () => {
  const { classes } = useStyles();
  const { locale } = useLocales();
  const newDimension = 350 * 1.1025 * 0.85;
  const [visible, setVisible] = useState(false);
  const [menuItems, setMenuItems] = useState<RadialMenuItem[]>([]);
  const [menu, setMenu] = useState<{ items: RadialMenuItem[]; sub?: boolean; page: number }>({
    items: [],
    sub: false,
    page: 1,
  });

  const changePage = async (increment?: boolean) => {
    setVisible(false);

    const didTransition: boolean = await fetchNui('radialTransition');

    if (!didTransition) return;

    setVisible(true);
    setMenu({ ...menu, page: increment ? menu.page + 1 : menu.page - 1 });
  };

  useEffect(() => {
    if (menu.items.length <= PAGE_ITEMS) return setMenuItems(menu.items);
    const items = menu.items.slice(
      PAGE_ITEMS * (menu.page - 1) - (menu.page - 1),
      PAGE_ITEMS * menu.page - menu.page + 1
    );
    if (PAGE_ITEMS * menu.page - menu.page + 1 < menu.items.length) {
      items[items.length - 1] = { icon: 'ellipsis-h', label: locale.ui.more, isMore: true };
    }
    setMenuItems(items);
  }, [menu.items, menu.page]);

  useNuiEvent('openRadialMenu', async (data: { items: RadialMenuItem[]; sub?: boolean; option?: string } | false) => {
    if (!data) return setVisible(false);
    let initialPage = 1;
    if (data.option) {
      data.items.findIndex(
        (item, index) => item.menu == data.option && (initialPage = Math.floor(index / PAGE_ITEMS) + 1)
      );
    }
    setMenu({ ...data, page: initialPage });
    setVisible(true);
  });

  useNuiEvent('refreshItems', (data: RadialMenuItem[]) => {
    setMenu({ ...menu, items: data });
  });

  return (
    <>
      <Box
        className={classes.wrapper}
        onContextMenu={async () => {
          if (menu.page > 1) await changePage();
          else if (menu.sub) fetchNui('radialBack');
        }}
      >
       <ScaleFade visible={visible}>
        <svg
          style={{ overflow: 'visible' }}
          width={`${1.5 * newDimension}px`}
          height={`${1.5 * newDimension}px`}
          viewBox="0 0 367.5 367.5"
          transform="rotate(90)"
        >
          <g transform="translate(183.75, 183.75)">
            <circle r={183.75} className={classes.backgroundCircle} />
          </g>
          {menuItems.map((item, index) => {
            const pieAngle = 360 / (menuItems.length < 3 ? 3 : menuItems.length);
            const angle = degToRad(pieAngle / 2 + 90);
            const gap = 1.5 * 0.7;
            const radius = 183.75 * 0.65 - gap;
            const sinAngle = Math.sin(angle);
            const cosAngle = Math.cos(angle);
            const iconYOffset = splitTextIntoLines(item.label, 15).length > 3 ? 4.5 * 0.7 : 0;
            const iconX = 183.75 + sinAngle * radius;
            const iconY = 183.75 + cosAngle * radius + iconYOffset;
            const iconWidth = Math.min(Math.max(item.iconWidth || 40, 0), 80) * 0.7;
            const iconHeight = Math.min(Math.max(item.iconHeight || 40, 0), 80) * 0.7;

            return (
              <g
                transform={`rotate(-${index * pieAngle} 183.75 183.75) translate(${sinAngle * gap}, ${cosAngle * gap})`}
                className={classes.sector}
                onClick={async () => {
                  const clickIndex = menu.page === 1 ? index : PAGE_ITEMS * (menu.page - 1) - (menu.page - 1) + index;
                  if (!item.isMore) fetchNui('radialClick', clickIndex);
                  else {
                    await changePage(true);
                  }
                }}
              >
                <path
                  d={`M183.75,183.75 l${183.75 - gap},0 A183.75,183.75 0 0,0 ${
                    183.75 + (183.75 - gap) * Math.cos(-degToRad(pieAngle))
                  }, ${183.75 + (183.75 - gap) * Math.sin(-degToRad(pieAngle))} z`}
                />
                <g transform={`rotate(${index * pieAngle - 90} ${iconX} ${iconY})`} pointerEvents="none">
                  {typeof item.icon === 'string' && isIconUrl(item.icon) ? (
                    <image
                      href={item.icon}
                      width={iconWidth}
                      height={iconHeight}
                      x={iconX - iconWidth / 2}
                      y={iconY - iconHeight / 2 - iconHeight / 4}
                    />
                  ) : (
                    <LibIcon
                      x={iconX - 15 * 0.7}
                      y={iconY - 15 * 0.7}
                      icon={item.icon as IconProp}
                      width={30 * 0.7}
                      height={30 * 0.7}
                      fixedWidth
                    />
                  )}
                  <text
                    x={iconX}
                    y={iconY + (splitTextIntoLines(item.label, 15).length > 2 ? 22.5 * 0.7 : 42 * 0.7)}
                    fill="#fff"
                    textAnchor="middle"
                    fontSize={calculateFontSize(item.label) * 1.3 * 0.7}
                    pointerEvents="none"
                    lengthAdjust="spacingAndGlyphs"
                  >
                    {splitTextIntoLines(item.label, 15).map((line, index) => (
                      <tspan x={iconX} dy={index === 0 ? 0 : '1.2em'} key={index}>
                        {line}
                      </tspan>
                    ))}
                  </text>
                </g>
              </g>
            );
          })}
          <g
            transform={`translate(183.75, 183.75)`}
            onClick={async () => {
              if (menu.page > 1) await changePage();
              else {
                if (menu.sub) fetchNui('radialBack');
                else {
                  setVisible(false);
                  fetchNui('radialClose');
                }
              }
            }}
          >
            <circle r={30 * 0.7} className={classes.centerCircle} />
          </g>
        </svg>
        <div className={classes.centerIconContainer}>
          <LibIcon
            icon={!menu.sub && menu.page < 2 ? 'xmark' : 'arrow-rotate-left'}
            fixedWidth
            className={classes.centerIcon}
            color="#fff"
            size="lg"
          />
        </div>
      </ScaleFade>
      </Box>
    </>
  );
};

export default RadialMenu;
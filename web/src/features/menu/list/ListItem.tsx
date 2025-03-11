import { Box, createStyles, Group, Progress, Stack, Text } from '@mantine/core';
import React, { forwardRef } from 'react';
import CustomCheckbox from './CustomCheckbox';
import type { MenuItem } from '../../../typings';
import { isIconUrl } from '../../../utils/isIconUrl';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import LibIcon from '../../../components/LibIcon';

interface Props {
  item: MenuItem;
  index: number;
  scrollIndex: number;
  checked: boolean;
}

const useStyles = createStyles((theme, params: { iconColor?: string }) => ({
  buttonContainer: {
    background: theme.colors.basicBg[0],
    borderRadius: 2,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 362,
    height: 55,
    border: '2px solid #19212E',
    scrollMargin: 8,
    '&:focus': {
      background: '#222D3D',
      outline: 'none',
    },
  },
  iconImage: {
    maxWidth: 32,
  },
  buttonWrapper: {
    color: '#fff',
    paddingLeft: 12,
    paddingRight: 16,
    height: '100%',
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    width: 29,
    height: 29,
  },
  icon: {
    fontSize: 24,
    color: params.iconColor || theme.colors.mainColor[0],
  },
  label: {
    color: '#FCFCFC',
    opacity: 0.5,
    fontSize: 13,
    letterSpacing: 1,
    lineHeight: '12px',
    fontWeight: 300,
    fontFamily: 'Helvetica',
    verticalAlign: 'middle',
  },
  chevronIcon: {
    width: 18,
    padding: 6,
    height: 18,
    backgroundColor: theme.colors.mainColor[0],
    fontSize: 12,
    color: '#fff',
  },
  scrollIndexValue: {
    color: '#fff',
    width: 30,
    background: '#12151B',
    height: 30,
    paddingTop: 4,

    justifyContent: 'center',

    display: 'flex',
    textTransform: 'uppercase',
    fontSize: 14,
  },
  progressStack: {
    width: '100%',
    marginRight: 5,
  },
  progressLabel: {
    verticalAlign: 'middle',
    marginBottom: 3,
  },

  progressBar: {
    height: 6,
    background: theme.colors.basicBg[2],
  },
}));

const ListItem = forwardRef<Array<HTMLDivElement | null>, Props>(({ item, index, scrollIndex, checked }, ref) => {
  const { classes } = useStyles({ iconColor: item.iconColor });

  return (
    <Box
      tabIndex={index}
      className={classes.buttonContainer}
      key={`item-${index}`}
      ref={(element: HTMLDivElement) => {
        if (ref)
          // @ts-ignore i cba
          return (ref.current = [...ref.current, element]);
      }}
    >
      <Group spacing={15} noWrap className={classes.buttonWrapper}>
        {item.icon && (
          <Box className={classes.iconContainer}>
            {typeof item.icon === 'string' && isIconUrl(item.icon) ? (
              <img src={item.icon} alt="Missing image" className={classes.iconImage} />
            ) : (
              <LibIcon
                icon={item.icon as IconProp}
                className={classes.icon}
                fixedWidth
                animation={item.iconAnimation}
              />
            )}
          </Box>
        )}
        {Array.isArray(item.values) ? (
          <Group position="apart" w="100%">
            <Stack spacing={0} justify="space-between">
              <Text className={classes.label}>{item.label}</Text>
              <Text>
                {typeof item.values[scrollIndex] === 'object'
                  ? // @ts-ignore for some reason even checking the type TS still thinks it's a string
                    item.values[scrollIndex].label
                  : item.values[scrollIndex]}
              </Text>
            </Stack>
            <Group spacing={1} position="center">
              <LibIcon icon="chevron-left" className={classes.chevronIcon} />
              <Text className={classes.scrollIndexValue}>
                {scrollIndex + 1}
              </Text>
              <LibIcon icon="chevron-right" className={classes.chevronIcon} />
            </Group>
          </Group>
        ) : item.checked !== undefined ? (
          <Group position="apart" w="100%">
            <Text>{item.label}</Text>
            <CustomCheckbox checked={checked}></CustomCheckbox>
          </Group>
        ) : item.progress !== undefined ? (
          <Stack className={classes.progressStack} spacing={0}>
            <Text className={classes.progressLabel}>{item.label}</Text>
            <Progress
              value={item.progress}
              color={item.colorScheme || '#CD2E36'}
              className={classes.progressBar}
            />
          </Stack>
        ) : (
          <Text>{item.label}</Text>
        )}
      </Group>
    </Box>
  );
});

export default React.memo(ListItem);

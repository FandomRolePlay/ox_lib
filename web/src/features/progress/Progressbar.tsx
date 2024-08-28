import React from 'react';
import { Box, createStyles, Text } from '@mantine/core';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import ScaleFade from '../../transitions/ScaleFade';
import type { ProgressbarProps } from '../../typings';

const useStyles = createStyles((theme) => ({
  container: {
    width: 350,
    height: 10,
    borderRadius: theme.radius.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.246)',
    overflow: 'hidden',
  },
  wrapper: {
    width: '100%',
    height: '20%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    position: 'absolute',
  },
  bar: {
    height: '100%',
    backgroundColor: '#C01616',
    boxShadow: '0 0 10px rgba(201, 18, 18, 0.6)',
    borderRadius: theme.radius.sm,
  },
  labelWrapper: {
    marginTop: 8,
    position: 'absolute',
    display: 'flex',
    width: 350,
    height: 45,
    alignItems: 'center',
    justifyContent: 'left',
  },
  label: {
    maxWidth: 350,
    padding: 8,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontSize: 20,
    color: theme.colors.gray[3],
    textShadow: theme.shadows.sm,
  },
  precentWrapper: {
    marginTop: 8,
    position: 'absolute',
    display: 'flex',
    width: 340,
    height: 45,
    alignItems: 'center',
    justifyContent: 'right',
  },
  precent: {
    maxWidth: 50,
    padding: 8,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontSize: 20,
    color: theme.colors.gray[3],
    textShadow: theme.shadows.sm,
  },
}));

const Progressbar: React.FC = () => {
  const { classes } = useStyles();
  const [visible, setVisible] = React.useState(false);
  const [label, setLabel] = React.useState('');
  const [duration, setDuration] = React.useState(0);
  const [elapsedTime, setElapsedTime] = React.useState(0);


  useNuiEvent('progressCancel', () => setVisible(false));

  useNuiEvent<ProgressbarProps>('progress', (data) => {
    setVisible(true);
    setLabel(data.label);
    setDuration(data.duration);
  });

  React.useEffect(() => {
    if (visible) {
      const interval = setInterval(() => {
        setElapsedTime((prev) => {
          if (prev >= duration) {
            clearInterval(interval);
            return duration;
          }
          return prev + 50;
        });
      }, 50);
  
      return () => clearInterval(interval);
    } else {
      setElapsedTime(0); // Reset elapsed time when progress bar is hidden
    }
  }, [visible, duration]);

  const percentage = Math.min((elapsedTime / duration) * 100, 100);

  return (
    <>
      <Box className={classes.wrapper}>
        <ScaleFade visible={visible} onExitComplete={() => fetchNui('progressComplete')}>
          <Box className={classes.container}>
              <Box className={classes.labelWrapper}>
                <Text className={classes.label}>{label}</Text>
              </Box>
              <Box className={classes.precentWrapper}>
                <Text>{`${percentage.toFixed(0)}%`}</Text>
              </Box>

            <Box
              className={classes.bar}
              onAnimationEnd={() => setVisible(false)}
              sx={{
                animation: 'progress-bar linear',
                animationDuration: `${duration}ms`,
              }}
            >
            </Box>
          </Box>
        </ScaleFade>
      </Box>
    </>
  );
};

export default Progressbar;

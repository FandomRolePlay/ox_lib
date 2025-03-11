import React from 'react';
import { Box, createStyles, Text, ThemeIcon } from '@mantine/core';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import ScaleFade from '../../transitions/ScaleFade';
import type { ProgressbarProps } from '../../typings';
import LibIcon from '../../components/LibIcon';

const useStyles = createStyles((theme) => ({
  wrapper: {
    width: '100%',
    height: '12.5%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    position: 'absolute',
  },
  container: {
    width: 360,
    height: 85,
    borderRadius: 3,
    background: theme.colors.basicBg[0],
    overflow: 'hidden',
    border: '1px solid #19212E', // Poprawiona składnia
    
  },
  bar: {
    height: '100%',
    backgroundColor: '#CD2E36',
    borderRadius: 6,
  },

  outsideBar: {
    width: '90%',
    height: 6,
    background: '#0D1016',
    borderRadius: 6,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 4,
  },
  
  
  firstRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'left',
    alignItems: 'center',
    marginTop: 15,
    height: 35,
  },
  
  
  labelWrapper: {
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 7,
  },
  
  label: {
    maxWidth: 350,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontSize: 16,
    color: theme.colors.gray[3],
    textShadow: theme.shadows.sm,
    fontWeight: 600,
  },

  imageWrapper: {
    marginLeft: '5%',
    width: 25,
    height: 25,
    background: '#0D1117',
    borderRadius: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  percentWrapper: {
    marginLeft: 'auto',
    marginRight: '5%',
    width: 50,
    height: 25,
    background: '#0D1117',
    borderRadius: 2,
  },

  percentText: {
    fontSize: 16,
    color: theme.colors.gray[3],
    textShadow: theme.shadows.sm,
    textAlign: 'center',
    fontWeight: 600,
  },

}));

const Progressbar: React.FC = () => {
  const { classes } = useStyles();
  const [visible, setVisible] = React.useState(false);
  const [label, setLabel] = React.useState('');
  const [duration, setDuration] = React.useState(0);
  const [value, setValue] = React.useState(0);

  useNuiEvent('progressCancel', () => setVisible(false));

  useNuiEvent<ProgressbarProps>('progress', (data) => {
    setVisible(true);
    setLabel(data.label);
    setDuration(data.duration); 
    setValue(0);

    const onePercent = data.duration * 0.01;
    const updateProgress = setInterval(() => {
      setValue((previousValue) => {
        const newValue = previousValue + 1;
        newValue >= 100 && clearInterval(updateProgress);
        return newValue;
      });
    }, onePercent);
  });

  return (
    <>
      <Box className={classes.wrapper}>
        <ScaleFade visible={visible} onExitComplete={() => fetchNui('progressComplete')}>
          <Box className={classes.container}>
            

            <Box className={classes.firstRow}>
              <Box className={classes.imageWrapper}>
              <ThemeIcon
                radius="xl"
                size={15}
                sx={{ backgroundColor: "transparent" }} // Zamiast opacity={0.0}
              >
                <LibIcon icon='spinner' fixedWidth color={'#CD2E36'} spin />
              </ThemeIcon>


          
              </Box>
              <Box className={classes.labelWrapper}>
                <Text className={classes.label}>{label}</Text>
              </Box>

              <Box className={classes.percentWrapper}>
                <Text className={classes.percentText}>{value}%</Text>
              </Box>
            </Box>

            <Box className={classes.outsideBar}>  
              <Box
                className={classes.bar}
                onAnimationEnd={() => setVisible(false)}
                sx={{
                  animation: 'progress-bar linear',
                  animationDuration: `${duration}ms`,
                }}
              />
            </Box>
            
  
          </Box>
        </ScaleFade>
      </Box>
    </>
  );
};

export default Progressbar;

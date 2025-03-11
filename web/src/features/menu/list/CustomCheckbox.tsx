import { Checkbox, createStyles } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: 30,
    height: 30,
    border: 'none',
    background: theme.colors.basicBg[2],
    '&:checked': { backgroundColor: theme.colors.mainColor[0]},
  },
  inner: {
    '> svg > path': {
      fill: '#fff',
    },
  },
}));

const CustomCheckbox: React.FC<{ checked: boolean }> = ({ checked }) => {
  const { classes } = useStyles();
  return (
    <Checkbox
      checked={checked}
      size="lg"
      classNames={{ root: classes.root, input: classes.input, inner: classes.inner }}
    />
  );
};

export default CustomCheckbox;

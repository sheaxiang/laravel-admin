import numeral from 'numeral';
import ChartCard from './ChartCard';
import Field from './Field';
import MiniProgress from './MiniProgress';

const yuan = (val: number | string) => `¥ ${numeral(val).format('0,0')}`;

const Charts = {
  yuan,
  MiniProgress,
  Field,
};

export {
  Charts as default,
  yuan,
  MiniProgress,
  ChartCard,
  Field,
};

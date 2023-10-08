import { RotatingLines } from 'react-loader-spinner';
import css from './Loader.module.css';

export const Loader = () => {
  return (
    <span className={css.loader}>
      <RotatingLines
        strokeColor="lime"
        strokeWidth="5"
        animationDuration="0.75"
        width="96"
        visible={true}
      />
    </span>
  );
};

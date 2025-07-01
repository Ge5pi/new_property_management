import { clsx } from 'clsx';

import './hamburger.styles.css';

export interface IProps {
  toggled?: boolean;
  handleToggle?: () => void;
}

const Hamburger = ({ toggled, handleToggle }: IProps) => {
  return (
    <div className="btn-hamburger d-xl-none d-block" style={{ zIndex: toggled ? 1026 : 'auto' }}>
      <input
        id="hamburger"
        className="btn-hamburger__cheeckbox"
        checked={toggled}
        type="checkbox"
        onChange={handleToggle}
      />
      <div className={clsx({ 'ham-toggled': toggled })}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

export default Hamburger;

import PropTypes from 'prop-types';
import { NekoIcon } from './Icon';
import { NekoTooltip } from './Tooltip';


const NekoInfo = ({ text, color, side = 'top', size = 16, ...rest }) => {
  return (
    <NekoTooltip text={text} position={side}>
      <NekoIcon icon="info-outline" color={color} width={size} height={size} {...rest} />
    </NekoTooltip>
  );
};

NekoInfo.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.string,
  side: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  size: PropTypes.number,
};

export { NekoInfo };

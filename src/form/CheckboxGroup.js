// Previous: none
// Current: 0.0.0

import React from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';

/**
 * @param {string} name
 * @param {int} max=-1 Max number of checkboxes to be checked. Negative number means unlimited
 */
const StyledNekoCheckboxGroup = Styled(props => {
  const { name, max = -1, isPro = false } = props;

  // React.Children.toArray(props.children)

  // Modify child components (Checkboxes)
  const children = React.Children.map(props.children, child => {
    if (child.props.name) return child; // Do not modify if the child has its own name
    return React.cloneElement(child, {
      name: name, // Apply the group's name
      isPro
    });
  });

  return children;
})`
`;

const NekoCheckboxGroup = (props) => {
  return (<StyledNekoCheckboxGroup {...props} />);
}

NekoCheckboxGroup.propTypes = {
  name: PropTypes.string,
  max: PropTypes.number,
  isPro: PropTypes.bool
};

export { NekoCheckboxGroup };

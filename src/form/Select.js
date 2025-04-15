// Previous: none
// Current: 0.0.0

import React, { useMemo, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ProOnly } from '../label/ProOnly';
import { useClasses } from '../hooks';
import { NekoSpinner } from '../misc/Spinner';

import { Icon } from '@iconify/react';
import checkboxBlankCircleOutline from '@iconify/icons-mdi/checkbox-blank-circle-outline';
import recordCircle from '@iconify/icons-mdi/record-circle';
import chevronDown from '@iconify/icons-mdi/chevron-down';
import chevronUp from '@iconify/icons-mdi/chevron-up';
import checkboxBlankOutline from '@iconify/icons-mdi/checkbox-blank-outline';
import checkboxMarked from '@iconify/icons-mdi/checkbox-marked';
import { NekoIcon } from '../misc/Icon';
import { NekoInput } from './Input';
import { NekoContextMenu } from '../misc/ContextMenu';

import {
  Select,
  SelectedOption,
  Description,
  Options,
  OptionsContainer,
  RadioOption,
  SelectOption,
} from './Select.styles';

const StyledNekoSelect = (props) => {
  const {
    name,
    description: inDescription,
    scrolldown = false,
    isPro = false,
    onChange,
    isBusy = false,
    chevronIconSize = 24,
    textFiltering,
    value,
    className,
    disabled,
    requirePro: inRequirePro,
    multiple = false,
    ...rest
  } = props;

  let label,
    description,
    requirePro,
    icon,
    iconSize = 15;
  if (multiple) {
    const selectedOptions = React.Children.toArray(props.children)
      .filter((child) => (value || []).includes(child.props.value) || child.props.checked)
      .map((child) => child.props);

    label = selectedOptions.map((option) => option.label).join(', ') || 'Select';
    description = inDescription;
    requirePro = selectedOptions.some((option) => option.requirePro) || inRequirePro;
    icon = null; 
  } else {
    const currentOption = React.Children.toArray(props.children).find(
      (child) => child.props.value === value || child.props.checked
    )?.props;
    label = currentOption?.label || 'Select';
    description = currentOption?.description || inDescription;
    requirePro = currentOption?.requirePro || inRequirePro;
    icon = currentOption?.icon;
    iconSize = currentOption?.iconSize || 15;
  }

  const [showOptions, setShowOptions] = useState(false);
  const [filterText, setFilterText] = useState('');
  const componentRef = useRef();

  const showUpProOnly = requirePro && !isPro;

  const onContextMenuClose = () => {
    if (showOptions) {
      setShowOptions(false);
    }
  };

  const onOptionClick = (event, newValue) => {
    event.stopPropagation();
    if (!onChange) {
      console.log(`The onChange handler is not set for this select.`, props);
      return;
    }

    if (multiple) {
      let newValueArray = Array.isArray(value) ? [...value] : [];
      if (newValueArray.includes(newValue)) {
        newValueArray = newValueArray.filter((v) => v !== newValue);
      } else {
        newValueArray.push(newValue);
      }
      onChange(newValueArray, name);
    } else {
      if (newValue !== value) {
        onChange(newValue, name);
      }
      if (scrolldown) {
        setShowOptions(false);
      }
    }
  };

  const children = React.Children.map(props.children, (child) => {
    if (!child) return null;
    return React.cloneElement(child, {
      name: child.props.name || name,
      checked: multiple
        ? (value || []).includes(child.props.value) || child.props.checked
        : child.props.value === value || child.props.checked,
      onClick: (e) => onOptionClick(e, child.props.value),
      scrolldown,
      isPro,
      disabled,
      multiple,
    });
  });

  const filteredChildren = useMemo(() => {
    if (!filterText || !children.length) return children;

    const lowercaseFilterText = filterText.toLowerCase();

    return React.Children.toArray(children).filter((child) => {
      const labelText = typeof child.props.label === 'string' ? child.props.label.toLowerCase() : '';
      const valueText = typeof child.props.value === 'string' ? child.props.value.toLowerCase() : '';
      return labelText.includes(lowercaseFilterText) || valueText.includes(lowercaseFilterText);
    });
  }, [children, filterText]);

  const selectClassNames = useClasses('neko-select', className, {
    'show-options': showOptions,
    disabled: disabled || isBusy,
  });
  const selectOptionsClassNames = useClasses('neko-select-options', {
    hidden: !showOptions,
  });
  const selectOptionClassNames = useClasses('neko-select-option', { isBusy });

  return scrolldown ? (
    <Select
      name={name}
      {...rest}
      onClick={() => {
        if (!disabled && !isBusy) {
          setShowOptions(!showOptions);
        }
      }}
      className={selectClassNames}
      data-is-disabled={disabled || isBusy}
      ref={componentRef}
    >
      <SelectedOption className={selectOptionClassNames}>
        {isBusy ? (
          <>
            <NekoSpinner type="circle" size="20px" />
          </>
        ) : (
          <>
            {icon && (
              <NekoIcon
                icon={icon}
                width={iconSize}
                height={iconSize}
                style={{ marginRight: `${Math.max(iconSize - 15, 4)}px` }}
              />
            )}
            <span className="neko-select-option-label">{label}</span>
            <div className="rightContent">
              {showUpProOnly && <ProOnly />}
              <Icon icon={showOptions ? chevronUp : chevronDown} width={chevronIconSize} />
            </div>
          </>
        )}
      </SelectedOption>
      {description && <Description>{description}</Description>}

      <NekoContextMenu visible={showOptions} targetRef={componentRef} onClose={onContextMenuClose}>
        <Options className={selectOptionsClassNames}>
          {textFiltering && (
            <OptionsContainer className="neko-select-filter-container">
              <NekoInput
                value={filterText}
                placeholder="Search..."
                onChange={(v) => setFilterText(v)}
                onClick={(e) => e.stopPropagation()}
                style={{ background: `var(--neko-white)`, borderRadius: 10, margin: '5px 7px' }}
                inputStyle={{ margin: 0, borderRadius: 0 }}
                autoFocus
              />
            </OptionsContainer>
          )}
          <OptionsContainer>{filteredChildren}</OptionsContainer>
        </Options>
      </NekoContextMenu>
    </Select>
  ) : (
    children
  );
};

const StyledNekoOption = (props) => {
  const {
    id,
    name,
    value,
    checked = false,
    label,
    description,
    onClick,
    scrolldown = false,
    isPro = false,
    optionDisabled = false,
    requirePro = false,
    icon,
    iconSize = 20,
    multiple = false,
  } = props;

  const showUpProOnly = requirePro && !isPro;
  const classNames = useClasses(
    { 'neko-radio': !scrolldown },
    { 'neko-select-option': scrolldown },
    props.className,
    {
      disabled: showUpProOnly || optionDisabled,
    }
  );

  const checkboxIcon = multiple
    ? checked
      ? checkboxMarked
      : checkboxBlankOutline
    : checked
    ? recordCircle
    : checkboxBlankCircleOutline;

  const selectOption = (
    <SelectOption
      className={classNames}
      onClick={(e) => {
        onClick(e, value);
      }}
    >
      <div className="option">
        <div className="option-group">
          <Icon
            icon={checkboxIcon}
            width={iconSize}
            color={
              showUpProOnly
                ? `var(--neko-disabled-color)`
                : checked
                ? `var(--neko-main-color)`
                : `var(--neko-input-border)`
            }
            style={{ marginRight: '8px' }}
          />
          {icon && (
            <NekoIcon
              icon={icon}
              width={iconSize}
              height={iconSize}
              style={{ marginRight: `${Math.max(iconSize - 11, 4)}px` }}
            />
          )}
          {label}
        </div>
        <ProOnly show={showUpProOnly} />
      </div>
    </SelectOption>
  );

  const radioOption = (
    <RadioOption
      className={classNames}
      onClick={(e) => {
        onClick(e, value);
      }}
    >
      <label htmlFor={id}>
        <Icon
          icon={checkboxIcon}
          width="24px"
          color={
            showUpProOnly
              ? `var(--neko-disabled-color)`
              : checked
              ? `var(--neko-main-color)`
              : `var(--neko-input-border)`
          }
        />
        <div className="inner-container">
          <span className="label">
            {label}
            <ProOnly className="inline" style={{ top: -1 }} show={showUpProOnly} />
          </span>
          {description && <Description style={{ marginTop: 0 }}>{description}</Description>}
        </div>
      </label>
    </RadioOption>
  );

  return scrolldown ? selectOption : radioOption;
};

const NekoSelect = (props) => {
  return <StyledNekoSelect {...props} />;
};

NekoSelect.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  scrolldown: PropTypes.bool,
  isPro: PropTypes.bool,
  onChange: PropTypes.func,
  isBusy: PropTypes.bool,
  chevronIconSize: PropTypes.number,
  textFiltering: PropTypes.bool,
  multiple: PropTypes.bool,
};

const NekoOption = (props) => {
  return <StyledNekoOption {...props} />;
};

NekoOption.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  checked: PropTypes.bool,
  label: PropTypes.string,
  description: PropTypes.string,
  onClick: PropTypes.func,
  scrolldown: PropTypes.bool,
  isPro: PropTypes.bool,
  optionDisabled: PropTypes.bool,
  requirePro: PropTypes.bool,
  icon: PropTypes.string,
  iconSize: PropTypes.number,
  multiple: PropTypes.bool,
};

export { NekoSelect, NekoOption };
import React, { useMemo, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ProOnly } from '../label/ProOnly';
import { useClasses, useDeprecatedIsBusy } from '../hooks';
import { NekoSpinner } from '../misc/Spinner';
import { ICON_SIZES } from '../common/PresetIcons';

import { Circle, CircleDot, ChevronDown, ChevronUp, Square, CheckSquare } from 'lucide-react';
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
    // Default to dropdown (scrolldown) — the radio-list is opt-in via
    // `scrolldown={false}` for the rare case where it's actually desired.
    scrolldown = true,
    isPro = false,
    onChange,
    isBusy = false,
    busy = false,
    chevronIconSize = ICON_SIZES.chevron,
    textFiltering,
    value,
    className,
    disabled,
    requirePro: inRequirePro,
    multiple = false,
    placeholder,
    ...rest
  } = props;
  
  // Handle both busy and isBusy props - prefer busy over isBusy
  const busyState = busy || isBusy;
  
  useDeprecatedIsBusy(isBusy, 'NekoSelect');

  // Determine selected options
  let label,
    description,
    requirePro,
    icon,
    iconSize = 15;
  if (multiple) {
    const selectedOptions = React.Children.toArray(props.children)
      .filter((child) => (value || []).includes(child.props.value) || child.props.checked)
      .map((child) => child.props);

    label = selectedOptions.map((option) => option.label).join(', ') || placeholder || 'Select';
    description = inDescription;
    requirePro = selectedOptions.some((option) => option.requirePro) || inRequirePro;
    icon = null; // Icons are not displayed in multiple mode
  } else {
    const currentOption = React.Children.toArray(props.children).find(
      (child) => child.props.value === value || child.props.checked
    )?.props;
    label = currentOption?.label || placeholder || 'Select';
    description = currentOption?.description || inDescription;
    requirePro = currentOption?.requirePro || inRequirePro;
    icon = currentOption?.icon;
    iconSize = currentOption?.iconSize || 15;
  }

  const [showOptions, setShowOptions] = useState(false);
  const [filterText, setFilterText] = useState('');
  const componentRef = useRef();

  const showUpProOnly = requirePro && !isPro;

  // Warn if multiple is used without scrolldown
  useEffect(() => {
    if (multiple && !scrolldown) {
      console.warn(
        'NekoSelect: The "multiple" prop should be used with "scrolldown={true}" for proper functionality. ' +
        'Multiple selection requires the dropdown interface to work correctly.'
      );
    }
  }, [multiple, scrolldown]);

  const onContextMenuClose = () => {
    if (showOptions) {
      setShowOptions(false);
    }
  };

  // Handle ESC key to close dropdown
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && showOptions) {
        setShowOptions(false);
      }
    };

    if (showOptions) {
      document.addEventListener('keydown', handleEscKey);
      return () => {
        document.removeEventListener('keydown', handleEscKey);
      };
    }
  }, [showOptions]);

  const onOptionClick = (event, newValue) => {
    event.stopPropagation(); // Prevent the dropdown from closing
    if (!onChange) {
      console.log(`The onChange handler is not set for this select.`, props);
      return;
    }

    if (multiple) {
      let newValueArray = Array.isArray(value) ? [...value] : [];
      if (newValueArray.includes(newValue)) {
        // Remove the value
        newValueArray = newValueArray.filter((v) => v !== newValue);
      } else {
        // Add the value
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

  // Clone children to pass additional props
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

    const searchTerms = filterText.toLowerCase().split(' ').filter(term => term.length > 0);

    return React.Children.toArray(children).filter((child) => {
      const label = typeof child.props.label === 'string' ? child.props.label.toLowerCase() : '';
      const value = typeof child.props.value === 'string' ? child.props.value.toLowerCase() : '';
      const combinedText = `${label} ${value}`;
      
      return searchTerms.every(term => combinedText.includes(term));
    });
  }, [children, filterText]);

  const selectClassNames = useClasses('neko-select', className, {
    'show-options': showOptions,
    disabled: disabled || isBusy,
  });
  const selectOptionsClassNames = useClasses('neko-select-options', {
    hidden: !showOptions,
  });
  const selectOptionClassNames = useClasses('neko-select-option', { isBusy: busyState });

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
        {busyState ? (
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
              <span className="neko-chevron-wrap">
                <ChevronDown
                  size={chevronIconSize}
                  className="neko-select-chevron"
                  style={{
                    transform: showOptions ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1)'
                  }}
                />
              </span>
            </div>
          </>
        )}
      </SelectedOption>
      {description && (
        typeof description === 'string'
          ? <Description dangerouslySetInnerHTML={{ __html: description }} />
          : <Description>{description}</Description>
      )}

      <NekoContextMenu visible={showOptions} targetRef={componentRef} onClose={onContextMenuClose}>
        <Options className={selectOptionsClassNames}>
          {textFiltering && (
            <OptionsContainer className="neko-select-filter-container">
              <NekoInput
                value={filterText}
                placeholder="Search..."
                onChange={(v) => setFilterText(v)}
                onClick={(e) => e.stopPropagation()}
                style={{ background: `var(--neko-white)`, borderRadius: 10, margin: '5px 7px', borderColor: `var(--neko-input-background)` }}
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

// Tag pill appended after the option label — a tiny coloured chip used for
// things like LATEST / PREVIEW / DEPRECATED / EXPERIMENTAL / TUNED next to
// model names in the AI Engine environment dropdown.
const OPTION_TAG_COLORS = {
  latest:       'var(--neko-blue, #2563eb)',
  preview:      'var(--neko-orange, #f97316)',
  deprecated:   'var(--neko-red, #dc2626)',
  experimental: 'var(--neko-red, #dc2626)',
  tuned:        'var(--neko-green, #16a34a)',
  beta:         'var(--neko-orange, #f97316)',
  new:          'var(--neko-green, #16a34a)',
};
const OptionTag = ({ tag }) => {
  if (!tag) return null;
  const color = OPTION_TAG_COLORS[tag] || 'var(--neko-gray-50)';
  return (
    <small style={{
      background: color, color: 'white', padding: '4px 6px',
      margin: '1px 0 0 5px', borderRadius: 8,
      fontSize: 8, lineHeight: '100%',
    }}>{tag.toUpperCase()}</small>
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
    scrolldown = true,
    isPro = false,
    optionDisabled = false,
    requirePro = false,
    icon,
    iconSize = 20,
    multiple = false,
    tag,
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

  const CheckboxIcon = multiple
    ? checked
      ? CheckSquare
      : Square
    : checked
    ? CircleDot
    : Circle;

  const selectOption = (
    <SelectOption
      className={classNames}
      onClick={(e) => {
        onClick(e, value);
      }}
    >
      <div className="option">
        <div className="option-group">
          {multiple ? (
            React.createElement(CheckboxIcon, {
              size: iconSize,
              color: showUpProOnly
                ? `var(--neko-disabled-color)`
                : checked
                ? `var(--neko-main-color)`
                : `var(--neko-input-border)`,
              style: { marginRight: '8px' }
            })
          ) : (
            <div style={{ position: 'relative', width: iconSize, height: iconSize, flexShrink: 0, marginRight: '8px' }}>
              {React.createElement(Circle, {
                size: iconSize,
                color: showUpProOnly
                  ? `var(--neko-disabled-color)`
                  : `var(--neko-input-border)`,
                strokeWidth: 1.5
              })}
              {checked && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: iconSize * 0.4,
                  height: iconSize * 0.4,
                  borderRadius: '50%',
                  backgroundColor: showUpProOnly
                    ? `var(--neko-disabled-color)`
                    : `var(--neko-main-color)`
                }} />
              )}
            </div>
          )}
          {icon && (
            <NekoIcon
              icon={icon}
              width={iconSize}
              height={iconSize}
              style={{ marginRight: `${Math.max(iconSize - 11, 4)}px` }}
            />
          )}
          {label}
          <OptionTag tag={tag} />
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
        <div style={{ position: 'relative', width: 24, height: 24, flexShrink: 0 }}>
          {React.createElement(Circle, {
            size: 24,
            color: showUpProOnly
              ? `var(--neko-disabled-color)`
              : `var(--neko-input-border)`,
            strokeWidth: 1.5
          })}
          {checked && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: showUpProOnly
                ? `var(--neko-disabled-color)`
                : `var(--neko-main-color)`
            }} />
          )}
        </div>
        <div className="inner-container">
          <span className="label">
            {label}
            <OptionTag tag={tag} />
            <ProOnly className="inline" style={{ top: -1 }} show={showUpProOnly} />
          </span>
          {description && (
            typeof description === 'string'
              ? <Description style={{ marginTop: 0 }} dangerouslySetInnerHTML={{ __html: description }} />
              : <Description style={{ marginTop: 0 }}>{description}</Description>
          )}
        </div>
      </label>
    </RadioOption>
  );

  return scrolldown ? selectOption : radioOption;
};

/**
 * The NekoSelect has 2 types, radio (default) or select.
 */
const NekoSelect = (props) => {
  return <StyledNekoSelect {...props} />;
};

NekoSelect.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  scrolldown: PropTypes.bool,
  isPro: PropTypes.bool,
  onChange: PropTypes.func,
  busy: PropTypes.bool,
  isBusy: PropTypes.bool,
  chevronIconSize: PropTypes.number,
  textFiltering: PropTypes.bool,
  multiple: PropTypes.bool,
  placeholder: PropTypes.string,
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

// Previous: none
// Current: 0.0.0

import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { NekoIcon } from "../misc/Icon";
import { NekoContextMenu } from "../misc/ContextMenu";
import Styled from 'styled-components';
import { NekoCheckboxGroup } from "../form/CheckboxGroup";
import { NekoOption, NekoSelect } from "../form/Select";
import { NekoCheckbox } from "../form/Checkbox";
import { NekoButton } from "../button/Button";
import { NekoSpacer } from '../layout/Spacer';
import { NekoInput } from "../form/Input";

const StyledTableFilters = Styled.div`
  min-width: 160px;
  padding: 8px;
  border-radius: 8px;
  overflow: hidden;
  background: var(--neko-main-color-alternative);
  color: white;
  
  .neko-context-content {
    max-height: 202px;
    overflow-y: auto;
  }

  .neko-checkbox {
    margin-bottom: 5px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .neko-radio:last-child {
    margin-bottom: 0;
  }

  svg {
    color: var(--neko-disabled-color);

    &.neko-active {
      color: white;
    }
  }
`;

const TableFilters = ({ accessor, options, type = 'checkbox', onChange, description, filters }) => {
  const [ visible, setVisible ] = useState(false);
  const [ textWord, setTextWord ] = useState(''); // Variable renamed subtly
  const [ typingTextValue, setTypingTextValue ] = useState('');
  const refIcon = useRef(null);
  const refInput = useRef(null);
  const isActive = (filters && filters.length > 0) || textWord.length > 0; // Using textWord instead of textValue
  const isCheckbox = type === 'checkbox';
  const isSelect = type === 'select';
  const isText = type === 'text';

  const onValidateTextChange = (value = undefined) => {
    if (value !== undefined && value !== textWord) {
      setTextWord(() => value);
    }
    if (typingTextValue !== textWord) {
      onChange(accessor, typingTextValue);
      setTextWord(typingTextValue);
    }
  }

  useEffect(() => {
    onValidateTextChange();
    if (visible) {
      setTimeout(() => {
        if (refInput.current) {
          refInput.current.focus();
        }
      }, 10);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <>
      <div ref={refIcon}>
        <NekoIcon icon="filter" className={isActive ? 'neko-active' : ''}
          onClick={() => setVisible(!visible)} width={16} height={16} />
      </div>
      <NekoContextMenu visible={visible} targetRef={refIcon} onClose={() => setVisible(false)}>
        <StyledTableFilters>
          <div className="neko-context-menu">
            {!!description && <p style={{ marginTop: 0, marginBottom: 5 }}>{description}</p>}
            <div className="neko-context-content">
              {isCheckbox && (<NekoCheckboxGroup name="neko-context-menu-checkboxes">
                {options.map((item) => (
                  <NekoCheckbox small key={item.value} label={item.label}
                    checked={filters?.includes(item.value)}
                    onChange={(checked) => { 
                      if (!filters) {
                        console.error("[NekoUI] filters needs to be set for the NekoTable.", { accessor, option: item.value });
                        return;
                      }
                      return checked ? onChange(accessor, [...filters, item.value])
                      : onChange(accessor, filters.filter(v => v != item.value));
                      }}
                  />
                ))}
              </NekoCheckboxGroup>)}
              {isSelect && (<NekoSelect name="neko-context-menu-select"
                onChange={(value) => onChange(accessor, value)}>
                  {options.map((item) => (
                    <NekoOption id={item.value} key={item.value} label={item.label} value={item.value} checked={filters === item.value} />
                  ))}
                </NekoSelect>
              )}
            </div>
            {isText && (<NekoInput ref={refInput}
              name="neko-context-menu-text"
              value={typingTextValue}
              onChange={(value) => setTypingTextValue(value)}
              onEnter={(value) => {  onValidateTextChange(value); setVisible(false); }}
            />)}
            <NekoSpacer tiny />
            <div className="neko-context-menu-bottom-actions">
              <NekoButton fullWidth
                disabled={!isActive}
                onClick={() => {
                  onChange(accessor, isCheckbox ? [] : null);
                  setTypingTextValue('');
                  setVisible(false);  
                  setTextWord('');
                }}>
                  Reset
              </NekoButton>
            </div>
          </div>
        </StyledTableFilters>
      </NekoContextMenu>
    </>
  );
};

TableFilters.propTypes = {
  accessor: PropTypes.string,
  options: PropTypes.array,
  type: PropTypes.oneOf(['checkbox', 'select', 'text']),
  onChange: PropTypes.func,
  filters: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
};

export { TableFilters };
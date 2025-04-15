// Previous: none
// Current: 0.0.0

import Styled from 'styled-components';

const Select = Styled.div`
  position: relative;
  border-radius: 8px;
  user-select: none;
  cursor: pointer;
  transition: background 0.3s ease, color 0.3s ease;
  color: black;
  box-sizing: border-box;

  .neko-select-option-label {
    overflow: hidden;
    height: 100%;
    display: flex;
    align-items: center;
  }

  &.show-options {
    border-radius: 8px 8px 0 0;
  }

  &[data-is-disabled=true], &.disabled {
    cursor: none;
    pointer-events: none;
    color: var(--neko-gray-60);

    .neko-select-option {
      pointer-events: none;
      background: var(--neko-gray-98);
      border-color: var(--neko-gray-60);
    }
  }

  &.neko-dropdown-up {
    background: red !important;
  }
`;

const SelectedOption = Styled.div`
  align-items: center;
  background-color: var(--neko-input-background);
  border: 1.5px solid var(--neko-input-border);
  border-radius: 8px;
  display: flex;
  font-size: var(--neko-font-size); 
  padding: 0 5px 0 10px;
  box-sizing: border-box;
  height: 30px;

  &.isBusy {
    padding-left: 5px;
  }

  .rightContent {
    align-items: center;
    display: flex;
    margin-left: auto;
  }
`;

const Description = Styled.div`
  display: block;
  margin-top: 5px;
  font-size: var(--neko-small-font-size);
  line-height: 14px;
  color: var(--neko-gray-60);

  * {
    line-height: inherit;
    margin: 0;
  }
`;

const Options = Styled.div`
  position: absolute;
  left: 0;
  z-index: 9999;
  border-radius: 8px;
  overflow: hidden;
  min-width: 100%;
  width: max-content;
  max-width: 100vw;
  top: 100%;
  
  &.neko-dropdown-up {
    top: auto;
    bottom: 100%;
  }
  
  &.hidden {
    opacity: 0;
  }
`;

const OptionsContainer = Styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 320px;
  background-color: var(--neko-main-color-alternative);

  &.neko-select-filter-container {
    background-color: var(--neko-main-color-alternative);
    padding: 6px;
    margin-top: 2px;
    overflow: hidden;

    div {
      overflow: hidden;
    }
  }
`;

const RadioOption = Styled.div`
  margin-bottom: 0px;

  input {
    display: none;
  }

  label {
    cursor: pointer;
    display: flex;

    svg {
      flex-shrink: 0;
    }
  }

  .inner-container {
    margin-left: 4px;

    .label {
      display: block;
      font-size: var(--neko-font-size);
      line-height: 17px;
      padding-top: 4.5px;
      padding-bottom: 4px;
    }

    .description {
      display: block;
      font-size: var(--neko-small-font-size);
    }
  }

  &.disabled {
    color: var(--neko-disabled-color);

    label {
      cursor: default;
    }
  }
`;

const SelectOption = Styled.div`
  background-color: var(--neko-main-color-alternative);
  cursor: pointer;
  font-size: var(--neko-font-size); 
  padding: 5.5px 13px;

  &:hover {
    filter: brightness(80%);
  }

  input {
    display: none;
  }

  .option {
    align-items: center;
    color: var(--neko-white);
    display: flex;
    justify-content: space-between;
    font-size: var(--neko-font-size); 
    line-height: 17px;

    .option-group {
      align-items: center;
      display: flex;
    }
  }

  &.disabled {
    background-color: rgb(224 156 54);
    pointer-events: none;

    .option {
      color: rgb(255 255 255 / 35%);
    }
  }
`;

export { Select, SelectedOption, Description, Options, OptionsContainer, RadioOption, SelectOption };
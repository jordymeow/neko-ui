import Styled from 'styled-components';

const Select = Styled.div`
  position: relative;
  border-radius: 8px;
  user-select: none;
  cursor: pointer;
  transition: background 0.3s ease, color 0.3s ease;
  color: var(--neko-font-color);
  box-sizing: border-box;

  .neko-select-option-label {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &.show-options {
    border-radius: 8px 8px 0 0;
  }

  &[data-is-disabled=true], &.disabled {
    cursor: not-allowed;
    pointer-events: none;
    color: var(--neko-gray-60);
    transition: opacity 0.3s ease, border-color 0.3s ease;

    .neko-select-option {
      pointer-events: none;
      background: var(--neko-gray-98);
      border-color: var(--neko-input-border);
    }

    .neko-select-option .rightContent .neko-select-chevron {
      color: var(--neko-gray-60);
    }
  }

  &.neko-dropdown-up {}
`;

const SelectedOption = Styled.div`
  align-items: center;
  background-color: var(--neko-input-background);
  border: 1.5px solid var(--neko-input-border);
  border-radius: var(--neko-radius-md);
  display: flex;
  font-size: var(--neko-font-size);
  padding: 0 5px 0 10px;
  box-sizing: border-box;
  height: var(--neko-control-height);
  transition: opacity 0.3s ease, border-color 0.3s ease, background-color 0.3s ease;
  
  &[data-is-disabled=true], &.disabled {
    border-color: var(--neko-input-border);
    opacity: 0.6;
  }

  &.isBusy {
    padding-left: 5px;
  }

  .rightContent {
    align-items: center;
    display: flex;
    margin-left: auto;
  }

  /* Chevron hover animation */
  .rightContent .neko-chevron-wrap {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transform-origin: center;
    transition: transform 160ms cubic-bezier(0.2, 0.8, 0.2, 1);
    will-change: transform;
  }

  &:hover .rightContent .neko-chevron-wrap { transform: scale(1.06); }

  /* Chevron color transition */
  .rightContent .neko-select-chevron {
    color: var(--neko-font-color);
    transition: color 150ms ease;
  }

  &:hover .rightContent .neko-select-chevron { color: var(--neko-main-color); }
`;

const Description = Styled.div`
  display: block;
  margin-top: 5px;
  font-size: var(--neko-small-font-size);
  line-height: 14px;
  color: var(--neko-gray-60);

  code {
    font-size: 9px;
    background: #016fba14;
    border-radius: 5px;
    padding: 2px 4px;
  }

  * {
    line-height: inherit;
    margin: 0;
  }
`;

const Options = Styled.div`
  position: absolute;
  left: 0;
  z-index: 9999;
  border-radius: var(--neko-radius-md);
  overflow: hidden;
  min-width: 100%;
  width: max-content;
  max-width: 100vw;
  top: 100%;
  margin-top: 4px;
  background: var(--neko-white);
  border: 1px solid var(--neko-input-border);
  box-shadow: var(--neko-shadow-lg);
  
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
  background-color: var(--neko-white);

  /* Custom scrollbar styling */
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    border: 2px solid transparent;
    background-clip: content-box;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(255, 255, 255, 0.5);
  }

  &.neko-select-filter-container {
    background-color: var(--neko-white);
    position: relative;
    padding: 6px;
    margin-top: 0;
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
  background-color: var(--neko-white);
  cursor: pointer;
  font-size: var(--neko-font-size); 
  padding: 7px 13px;
  transition: background-color 0.12s ease, box-shadow 0.2s ease;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: -60%;
    width: 120%;
    background: linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 100%);
    opacity: 0;
    pointer-events: none;
    transform: translateX(-120%) skewX(-15deg);
  }

  @keyframes nekoOptionGloss {
    0% { opacity: 0; transform: translateX(-120%) skewX(-15deg); }
    20% { opacity: .35; }
    100% { opacity: 0; transform: translateX(120%) skewX(-15deg); }
  }

  &:hover {
    background-color: var(--neko-main-color-95);
    box-shadow: var(--neko-shadow-xs);
  }

  &:hover::after { animation: nekoOptionGloss 650ms ease; }

  input {
    display: none;
  }

  .option {
    align-items: center;
    color: var(--neko-font-color);
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
    background-color: var(--neko-gray-98);
    pointer-events: none;

    .option {
      color: var(--neko-gray-60);
    }
  }
`;

export { Select, SelectedOption, Description, Options, OptionsContainer, RadioOption, SelectOption };

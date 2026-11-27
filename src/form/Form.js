import Styled from 'styled-components';

const Form = Styled.div`
  label {
    display: block;
    margin-bottom: 3px;
  }

  .neko-input, .neko-textarea {
    margin-bottom: 5px;
  }
`;

/**
 * @param {string} id
 * @param {string} name
 * @param {string} value
 * @param {string} description
 * @param {string} placeholder
 */
const StyledNekoForm = (props) => {
  return (
    <Form className='neko-form'>
      {props.children || null}
    </Form>
  );
};

const NekoForm = (props) => {
  return (<StyledNekoForm {...props} />);
};

NekoForm.propTypes = {
};

export { NekoForm };

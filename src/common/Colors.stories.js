// Previous: none
// Current: 0.0.0

import Styled from "styled-components";

import { useNekoColors } from "../NekoUI";

import { NekoTypo } from "../../index";

export default {
  title: "Components/Colors",
  component: useNekoColors,
  parameters: {
    componentSubtitle: "useNekoColors() is a hook that returns the NekoUI colors.",
  },
  argTypes: {
    color: {
        description: "The defined color in the NekoUI.",
        control: { type: "select" },
        options: Object.keys(useNekoColors().colors),
    },
  },
};

const PreviewContainer = Styled.div`
  margin-bottom: 30px;
  margin-right: 30px;
`;
const PreviewCircle = Styled.div`
  width: 50px;
  height: 50px;
`;

const Template = ({ color }) => {
  const NekoColors = useNekoColors().colors;
  return (
    <PreviewContainer key={color}>
      <PreviewCircle style={{ background: NekoColors[color] }} />
      <NekoTypo>{color}<br />{NekoColors[color]}</NekoTypo>
    </PreviewContainer>
  );
};

export const Default = Template.bind({});
Default.args = {
  color: 'black',
};

export const Sample = () => {
  const NekoColors = useNekoColors().colors;
  return (
    <div style={{display: 'flex'}}>
      {Object.keys(NekoColors).map((color) => (
        <PreviewContainer key={color}>
          <PreviewCircle style={{ background: NekoColors[color] }} />
          <NekoTypo>{color}<br />{NekoColors[color]}</NekoTypo>
        </PreviewContainer>
      ))}
    </div>
  );
}

import React from "react";
import { styled } from "@storybook/theming";
import { H1, H2, Code, UL, LI } from "@storybook/components";

const TabWrapper = styled.div(({ theme }) => ({
  background: theme.background.content,
  boxSizing: "border-box",
  height: "100vh",
  minHeight: "100vh",
  overflowY: "auto",
  width: "100%",
}));

const TabInner = styled.div({
  maxWidth: 768,
  margin: "4rem 20px",
  marginLeft: "auto",
  marginRight: "auto",
});

export const TabContent = ({ title, description, sections = [] }) => (
  <TabWrapper>
    <TabInner>
      {title && <H1>{title}</H1>}
      <p>{description}</p>
      {sections.map((section) => (
        <div key={section.title}>
          <H2>{section.title}</H2>
          {section.content && <p>{section.content}</p>}
          {section.list && (
            <UL>
              {section.list.map((item) => (
                <LI key={item}>{item}</LI>
              ))}
            </UL>
          )}
          {section.code && <Code>{section.code}</Code>}
        </div>
      ))}
    </TabInner>
  </TabWrapper>
);

import React from "react";
import { Flex, theme, Typography } from "antd";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";

const { useToken } = theme;
const { Title } = Typography;

interface SectionContainerProps {
  title?: string;
  id?: string;
  isBordered?: boolean;
  children: React.ReactNode;
}
function SectionContainer({
  title,
  id,
  isBordered,
  children,
}: SectionContainerProps) {
  const { token } = useToken();
  const screens = useBreakpoint();
  return (
    <Flex
      vertical
      id={id}
      style={{
        padding: "1rem",
        borderRadius: "1rem",
        margin: "2rem 1rem",
        ...(isBordered
          ? {
              borderWidth: "0.125rem",
              borderStyle: "solid",
              borderColor: token.colorBorder,
            }
          : {}),
      }}
    >
      {title && (
        <Title style={{ margin: "0 0 1.5rem 0" }} level={3}>
          {title}
        </Title>
      )}
      <Flex
        vertical={!screens.md}
        style={{
          justifyContent: "center",
          alignItems: !screens.md ? "center" : "unset",
        }}
        gap="2rem"
      >
        {children}
      </Flex>
    </Flex>
  );
}

export default SectionContainer;
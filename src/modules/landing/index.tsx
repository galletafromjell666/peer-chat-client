import React from "react";
import { Layout, theme, Typography } from "antd";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";

import DidYouKnow from "./components/DidYouKnow";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import ImagesCarousel from "./components/ImagesCarousel";
import LandingPageHeader from "./components/LandingPageHeader";
import PrivacyIsPriority from "./components/PrivacyIsPriority";
import TechnicalInsights from "./components/TechnicalInsights";
import WhyPeerChat from "./components/WhyPeerChat";

const { useToken } = theme;
const { Content, Footer } = Layout;
const { Text } = Typography;

const Landing: React.FC = () => {
  const screens = useBreakpoint();
  const { token } = useToken();

  return (
    <Layout>
      <LandingPageHeader />
      <Content
        style={{
          padding: screens.md ? "0 1rem" : "0",
          backgroundColor: token.colorBgContainerDisabled,
        }}
      >
        <Hero />
        <WhyPeerChat />
        <ImagesCarousel />
        <HowItWorks />
        <PrivacyIsPriority />
        <DidYouKnow />
        <TechnicalInsights />
      </Content>
      <Footer
        style={{
          textAlign: "center",
          paddingTop: "1rem",
          paddingBottom: "1rem",
          backgroundColor: token.colorBgContainerDisabled,
        }}
      >
        <Text style={{ fontSize: "1.115rem" }}>Developed with ❤️ in 🇸🇻</Text>
      </Footer>
    </Layout>
  );
};

export default Landing;

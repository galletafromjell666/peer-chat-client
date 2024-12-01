import chatInfo from "@assets/landingCarousel/chatInfo.png";
import conversation from "@assets/landingCarousel/conversation.png";
import createJoin from "@assets/landingCarousel/createJoin.png";
import mediaConfiguration from "@assets/landingCarousel/mediaConfiguration.png";
import videoChat from "@assets/landingCarousel/videoChat.png";
import { Carousel, Flex, theme, Typography } from "antd";

const { useToken } = theme;
const { Title } = Typography;

function ImagesCarousel() {
  const { token } = useToken();
  return (
    <>
      <Flex
        vertical
        style={{
          padding: "1rem",
          borderRadius: "1rem",
          margin: "2rem 1rem",
          borderWidth: "0.125rem",
          borderStyle: "solid",
          borderColor: token.colorBorder,
        }}
      >
        <Title style={{ margin: "0 0 1.5rem 0" }} level={3}>
          Screenshots
        </Title>
        <Carousel arrows infinite>
          <div>
            <div className="carousel_content">
              <img src={conversation} alt="0" />
              <Title level={5}>
                Securely exchange messages and files directly with your peer,
                with no servers storing your data.
              </Title>
            </div>
          </div>
          <div>
            <div className="carousel_content">
              <img src={chatInfo} alt="0" />
              <Title level={5}>
                Intuitive interface to share your chat room link and enable
                browser notifications for seamless communication.
              </Title>
            </div>
          </div>
          <div>
            <div className="carousel_content">
              <img src={createJoin} alt="0" />
              <Title level={5}>
                Effortlessly create or join chat rooms with a clean,
                user-friendly interface—no login or personal information
                required.
              </Title>
            </div>
          </div>
          <div>
            <div className="carousel_content">
              <img src={videoChat} alt="0" />
              <Title level={5}>
                Enjoy smooth video chats with your peer, complete with both
                video and audio support.
              </Title>
            </div>
          </div>
          <div>
            <div className="carousel_content">
              <img src={mediaConfiguration} alt="0" />
              <Title level={5}>
                Configure your input and output devices for a personalized video
                chat experience.
              </Title>
            </div>
          </div>
        </Carousel>
      </Flex>
    </>
  );
}
// src/public/assets/landingCarousel/0.png
export default ImagesCarousel;

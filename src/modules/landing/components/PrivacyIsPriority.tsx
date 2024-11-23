import { Typography } from 'antd';

import SectionContainer from './SectionContainer'
const { Text, } = Typography;

function PrivacyIsPriority() {
  return (
    <SectionContainer
    title="Your Privacy is a Priority."
    isBordered
    id="privacy-is-priority"
  >
    <ul>
      <li>
        <Text>
          PeerChat uses WebRTC technology to establish direct, secure
          connections between you and your partner.
        </Text>
      </li>
      <li>
        <Text>
          With no data stored on servers, there’s nothing to hack or
          track.
        </Text>
      </li>
    </ul>
  </SectionContainer>
  )
}

export default PrivacyIsPriority